import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function encodeWav(chunks: Float32Array[], sampleRate: number, targetRate = 16000): Blob {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }

  const ratio = sampleRate / targetRate;
  const outLength = ratio > 1 ? Math.floor(merged.length / ratio) : merged.length;
  const samples = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    samples[i] = merged[Math.floor(i * (ratio > 1 ? ratio : 1))] ?? 0;
  }
  const rate = ratio > 1 ? targetRate : sampleRate;

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (pos: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(pos + i, s.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let pos = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    pos += 2;
  }
  return new Blob([buffer], { type: "audio/wav" });
}

const SEGMENT_MS = 4000;

export function useVoiceDictation(onText: (text: string) => void) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);
  const sentIndexRef = useRef(0);
  const busyRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  const cleanup = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    nodeRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close().catch(() => undefined);
    nodeRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    ctxRef.current = null;
  }, []);

  const transcribeBlob = useCallback(async (blob: Blob) => {
    const form = new FormData();
    form.append("file", blob, "recording.wav");
    const { data, error: fnError } = await supabase.functions.invoke("transcribe-audio", { body: form });
    if (fnError) throw fnError;
    return ((data as { text?: string })?.text ?? "").trim();
  }, []);

  // Transcribes everything recorded since the last flush and appends it to the caption.
  const flush = useCallback(
    async (final: boolean) => {
      if (busyRef.current && !final) return;
      const all = chunksRef.current;
      const slice = all.slice(sentIndexRef.current);
      const samples = slice.reduce((n, c) => n + c.length, 0);
      const sampleRate = ctxRef.current?.sampleRate ?? 44100;
      if (!slice.length || samples < sampleRate * (final ? 0.4 : 1.2)) return;
      sentIndexRef.current = all.length;
      busyRef.current = true;
      try {
        const blob = encodeWav(slice, sampleRate);
        if (blob.size < 4096) return;
        const text = await transcribeBlob(blob);
        if (!text) return;
        setCaption((prev) => (prev ? `${prev} ${text}` : text));
        onTextRef.current(text);
      } catch {
        if (final) setError("Could not turn that recording into text. Please try again.");
      } finally {
        busyRef.current = false;
      }
    },
    [transcribeBlob]
  );

  const start = useCallback(async () => {
    setError(null);
    setCaption("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const node = ctx.createScriptProcessor(4096, 1, 1);
      nodeRef.current = node;
      chunksRef.current = [];
      sentIndexRef.current = 0;
      busyRef.current = false;
      node.onaudioprocess = (e) => {
        chunksRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };
      source.connect(node);
      node.connect(ctx.destination);
      setRecording(true);
      timerRef.current = window.setInterval(() => void flush(false), SEGMENT_MS);
    } catch {
      cleanup();
      setError("Microphone access is needed to dictate. Please allow it and try again.");
    }
  }, [cleanup, flush]);

  const stop = useCallback(async () => {
    if (!recording) return;
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;

    setTranscribing(true);
    try {
      // wait for any in-flight segment, then transcribe the tail
      for (let i = 0; i < 40 && busyRef.current; i++) {
        await new Promise((r) => setTimeout(r, 150));
      }
      await flush(true);
      if (!caption && sentIndexRef.current === 0) {
        setError("That recording was empty — please try again.");
      }
    } finally {
      setTranscribing(false);
      chunksRef.current = [];
      sentIndexRef.current = 0;
      cleanup();
    }
  }, [recording, cleanup, flush, caption]);

  const toggle = useCallback(() => {
    if (recording) void stop();
    else void start();
  }, [recording, start, stop]);

  const clearCaption = useCallback(() => setCaption(""), []);

  return { recording, transcribing, caption, error, toggle, start, stop, clearCaption };
}

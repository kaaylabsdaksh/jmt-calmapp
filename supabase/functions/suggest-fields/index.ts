const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, fields } = await req.json();
    if (!text || !Array.isArray(fields) || fields.length === 0) {
      return new Response(JSON.stringify({ error: "text and fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const catalog = (fields as { section: string; label: string }[])
      .slice(0, 400)
      .map((f, i) => `${i}. [${f.section}] ${f.label}`)
      .join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You map free-text notes about a calibration work order onto form fields. " +
              "You are given a numbered catalog of available form fields. " +
              "Return ONLY fields from the catalog that the note refers to. " +
              "When the note contains a concrete value for a field (a serial number, PO number, date, manufacturer, model, quantity, status...), return that value exactly as it should be typed into the field; dates as MM/DD/YYYY. " +
              "If no value is present, return an empty string. Return at most 8 fields, best matches first. " +
              'Respond as JSON: {"matches":[{"index":number,"value":string,"reason":string}]}',
          },
          { role: "user", content: `FIELD CATALOG:\n${catalog}\n\nNOTE:\n${text}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return new Response(JSON.stringify({ error: detail || "AI request failed" }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: { matches?: { index: number; value?: string; reason?: string }[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    const suggestions = (parsed.matches ?? [])
      .map((m) => {
        const field = fields[m.index];
        if (!field) return null;
        return {
          section: field.section,
          label: field.label,
          value: typeof m.value === "string" ? m.value : "",
          reason: typeof m.reason === "string" ? m.reason : "",
        };
      })
      .filter(Boolean)
      .slice(0, 8);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

/**
 * PROTOTYPE ONLY — in-memory data store for the Onsite Scheduling capability.
 *
 * Backs Calendar, Unscheduled Work, and the technician roster picker with a
 * single shared state so, e.g., "Schedule" on a queue item shows up on the
 * Calendar immediately within the same session. Resets on page reload —
 * there is no persistence layer this pass (see /prototype/README.md).
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  seedJobs,
  seedNonServiceEntries,
  seedTechnicians,
  seedUnscheduledWork,
} from '@/lib/onsite-scheduling/mock-data';
import type {
  JobComment,
  NonServiceEntry,
  PrototypeTechnician,
  ScheduledJob,
  UnscheduledWorkItem,
} from '@/lib/onsite-scheduling/types';

interface SchedulingDataContextValue {
  jobs: ScheduledJob[];
  nonServiceEntries: NonServiceEntry[];
  unscheduledWork: UnscheduledWorkItem[];
  technicians: PrototypeTechnician[];
  addJob: (job: ScheduledJob) => void;
  /** Patches an existing job in place (e.g. reassigning technicians from
   * Quick View) — added so a conflict flagged on the Calendar grid can
   * actually be resolved, not just seen. */
  updateJob: (jobId: string, patch: Partial<ScheduledJob>) => void;
  addNonServiceEntry: (entry: NonServiceEntry) => void;
  updateNonServiceEntry: (entry: NonServiceEntry) => void;
  deleteNonServiceEntry: (id: string) => void;
  /** Converts a queue item into a real Job and removes it from the queue —
   * the only action the Unscheduled Work queue supports (FRD §6.5 US-1). */
  scheduleWorkItem: (workItemId: string, job: ScheduledJob) => void;
  /** Adds a new item straight into the queue (D11's quick-add path, built
   * 2026-08-15) — distinct from `scheduleWorkItem`, which converts an
   * existing item OUT of the queue into a Job. This is the other direction:
   * minimum-fields intake landing IN the queue for someone to Schedule
   * later. */
  addUnscheduledWorkItem: (item: UnscheduledWorkItem) => void;
  /** Appends one comment to a job's thread (D27) — a dedicated action
   * rather than routed through `updateJob`, so it always appends against
   * the current array via the functional setState form instead of a
   * snapshot that could be stale if two comments landed in the same
   * render pass. */
  addJobComment: (jobId: string, text: string) => void;
  /** Id of the job whose Detail dialog is open, or null. Lives here (rather
   * than as local state inside Calendar) so Calendar's job-bar click and
   * List's project-number click can open the exact same JobDetailDialog
   * instance — added for D19 to close the "same component" gap. */
  openJobId: string | null;
  openJobDetail: (jobId: string) => void;
  closeJobDetail: () => void;
}

const SchedulingDataContext = createContext<SchedulingDataContextValue | undefined>(
  undefined
);

export const SchedulingDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<ScheduledJob[]>(seedJobs);
  const [nonServiceEntries, setNonServiceEntries] =
    useState<NonServiceEntry[]>(seedNonServiceEntries);
  const [unscheduledWork, setUnscheduledWork] =
    useState<UnscheduledWorkItem[]>(seedUnscheduledWork);
  const [technicians] = useState<PrototypeTechnician[]>(seedTechnicians);
  const [openJobId, setOpenJobId] = useState<string | null>(null);

  const openJobDetail = useCallback((jobId: string) => {
    setOpenJobId(jobId);
  }, []);

  const closeJobDetail = useCallback(() => {
    setOpenJobId(null);
  }, []);

  const addJob = useCallback((job: ScheduledJob) => {
    setJobs((prev) => [...prev, job]);
  }, []);

  const updateJob = useCallback((jobId: string, patch: Partial<ScheduledJob>) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...patch } : j)));
  }, []);

  const addNonServiceEntry = useCallback((entry: NonServiceEntry) => {
    setNonServiceEntries((prev) => [...prev, entry]);
  }, []);

  const updateNonServiceEntry = useCallback((entry: NonServiceEntry) => {
    setNonServiceEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)));
  }, []);

  const deleteNonServiceEntry = useCallback((id: string) => {
    setNonServiceEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const scheduleWorkItem = useCallback((workItemId: string, job: ScheduledJob) => {
    setJobs((prev) => [...prev, job]);
    setUnscheduledWork((prev) => prev.filter((w) => w.id !== workItemId));
  }, []);

  const addUnscheduledWorkItem = useCallback((item: UnscheduledWorkItem) => {
    setUnscheduledWork((prev) => [...prev, item]);
  }, []);

  const addJobComment = useCallback((jobId: string, text: string) => {
    const comment: JobComment = {
      id: `jc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, comments: [...j.comments, comment] } : j))
    );
  }, []);

  const value = useMemo(
    () => ({
      jobs,
      nonServiceEntries,
      unscheduledWork,
      technicians,
      addJob,
      updateJob,
      addNonServiceEntry,
      updateNonServiceEntry,
      deleteNonServiceEntry,
      scheduleWorkItem,
      addUnscheduledWorkItem,
      addJobComment,
      openJobId,
      openJobDetail,
      closeJobDetail,
    }),
    [
      jobs,
      nonServiceEntries,
      unscheduledWork,
      technicians,
      addJob,
      updateJob,
      addNonServiceEntry,
      updateNonServiceEntry,
      deleteNonServiceEntry,
      scheduleWorkItem,
      addUnscheduledWorkItem,
      addJobComment,
      openJobId,
      openJobDetail,
      closeJobDetail,
    ]
  );

  return (
    <SchedulingDataContext.Provider value={value}>
      {children}
    </SchedulingDataContext.Provider>
  );
};

export function useSchedulingData(): SchedulingDataContextValue {
  const ctx = useContext(SchedulingDataContext);
  if (!ctx) {
    throw new Error('useSchedulingData must be used within a SchedulingDataProvider');
  }
  return ctx;
}

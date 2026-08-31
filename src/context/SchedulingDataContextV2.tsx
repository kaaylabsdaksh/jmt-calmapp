import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  NonServiceEntry,
  ScheduledJob,
  Technician,
  UnscheduledWorkItem,
  seedJobs,
  seedNonServiceEntries,
  seedTechnicians,
  seedUnscheduledWork,
} from "@/lib/onsite/schedulingData";

interface SchedulingDataValue {
  jobs: ScheduledJob[];
  entries: NonServiceEntry[];
  technicians: Technician[];
  unscheduled: UnscheduledWorkItem[];
  updateJob: (id: string, patch: Partial<ScheduledJob>) => void;
  addJob: (job: ScheduledJob) => void;
  upsertEntry: (entry: NonServiceEntry) => void;
  deleteEntry: (id: string) => void;
  removeUnscheduled: (id: string) => void;
}

const SchedulingDataContext = createContext<SchedulingDataValue | null>(null);

export const SchedulingDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobs, setJobs] = useState<ScheduledJob[]>(seedJobs);
  const [entries, setEntries] = useState<NonServiceEntry[]>(seedNonServiceEntries);
  const [unscheduled, setUnscheduled] = useState<UnscheduledWorkItem[]>(seedUnscheduledWork);

  const updateJob = useCallback((id: string, patch: Partial<ScheduledJob>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }, []);

  const addJob = useCallback((job: ScheduledJob) => setJobs((prev) => [...prev, job]), []);

  const upsertEntry = useCallback((entry: NonServiceEntry) => {
    setEntries((prev) =>
      prev.some((e) => e.id === entry.id)
        ? prev.map((e) => (e.id === entry.id ? entry : e))
        : [...prev, entry],
    );
  }, []);

  const deleteEntry = useCallback(
    (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)),
    [],
  );

  const removeUnscheduled = useCallback(
    (id: string) => setUnscheduled((prev) => prev.filter((u) => u.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({
      jobs,
      entries,
      technicians: seedTechnicians,
      unscheduled,
      updateJob,
      addJob,
      upsertEntry,
      deleteEntry,
      removeUnscheduled,
    }),
    [jobs, entries, unscheduled, updateJob, addJob, upsertEntry, deleteEntry, removeUnscheduled],
  );

  return <SchedulingDataContext.Provider value={value}>{children}</SchedulingDataContext.Provider>;
};

export const useSchedulingData = () => {
  const ctx = useContext(SchedulingDataContext);
  if (!ctx) throw new Error("useSchedulingData must be used within SchedulingDataProvider");
  return ctx;
};

import { useState, useCallback } from 'react';
import { LotEntry, MachineConfig, createDefaultEntry, createDefaultParameters } from '@/types/measurement';

const STORAGE_KEY = 'measurement_data';

function loadFromStorage(): LotEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveToStorage(data: LotEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useMeasurementStore() {
  const [entries, setEntries] = useState<LotEntry[]>(loadFromStorage);

  const update = useCallback((fn: (prev: LotEntry[]) => LotEntry[]) => {
    setEntries(prev => {
      const next = fn(prev);
      saveToStorage(next);
      return next;
    });
  }, []);

  const addEntry = useCallback((config: MachineConfig, lotId: string) => {
    const entry = createDefaultEntry(config, lotId);
    update(prev => [...prev, entry]);
    return entry;
  }, [update]);

  const deleteEntry = useCallback((id: string) => {
    update(prev => prev.filter(e => e.id !== id));
  }, [update]);

  const updateEntry = useCallback((entry: LotEntry) => {
    update(prev => prev.map(e => e.id === entry.id ? entry : e));
  }, [update]);

  const getEntriesForMachine = useCallback((machineId: string) => {
    return entries.filter(e => e.machineId === machineId);
  }, [entries]);

  // Position management
  const addPosition = useCallback((entryId: string, posName: string, config: MachineConfig) => {
    update(prev => prev.map(e => {
      if (e.id !== entryId) return e;
      return {
        ...e,
        positions: [...e.positions, {
          id: crypto.randomUUID(),
          name: posName,
          points: config.defaultPoints.map(pt => ({
            id: crypto.randomUUID(),
            name: pt,
            parameters: createDefaultParameters(config),
          })),
        }],
      };
    }));
  }, [update]);

  const removePosition = useCallback((entryId: string, posId: string) => {
    update(prev => prev.map(e => {
      if (e.id !== entryId) return e;
      return { ...e, positions: e.positions.filter(p => p.id !== posId) };
    }));
  }, [update]);

  // Point management
  const addPoint = useCallback((entryId: string, posId: string, pointName: string, config: MachineConfig) => {
    update(prev => prev.map(e => {
      if (e.id !== entryId) return e;
      return {
        ...e,
        positions: e.positions.map(pos => {
          if (pos.id !== posId) return pos;
          return {
            ...pos,
            points: [...pos.points, {
              id: crypto.randomUUID(),
              name: pointName,
              parameters: createDefaultParameters(config),
            }],
          };
        }),
      };
    }));
  }, [update]);

  const removePoint = useCallback((entryId: string, posId: string, pointId: string) => {
    update(prev => prev.map(e => {
      if (e.id !== entryId) return e;
      return {
        ...e,
        positions: e.positions.map(pos => {
          if (pos.id !== posId) return pos;
          return { ...pos, points: pos.points.filter(pt => pt.id !== pointId) };
        }),
      };
    }));
  }, [update]);

  // Parameter value update
  const updateParameter = useCallback((entryId: string, posId: string, pointId: string, paramKey: string, value: any) => {
    update(prev => prev.map(e => {
      if (e.id !== entryId) return e;
      return {
        ...e,
        positions: e.positions.map(pos => {
          if (pos.id !== posId) return pos;
          return {
            ...pos,
            points: pos.points.map(pt => {
              if (pt.id !== pointId) return pt;
              return { ...pt, parameters: { ...pt.parameters, [paramKey]: value } };
            }),
          };
        }),
      };
    }));
  }, [update]);

  return {
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
    getEntriesForMachine,
    addPosition,
    removePosition,
    addPoint,
    removePoint,
    updateParameter,
  };
}

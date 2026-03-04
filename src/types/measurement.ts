// Parameter field definition
export interface ParameterFieldDef {
  key: string;
  label: string;
  type: 'single' | 'array' | 'hardness' | 'minmax';
  defaultCount?: number;
  optional?: boolean;
}

// Machine configuration
export interface MachineConfig {
  id: string;
  name: string;
  defaultPositions: string[];
  defaultPoints: string[];
  parameters: ParameterFieldDef[];
}

// Runtime data
export interface ParameterValue {
  key: string;
  value: string | string[] | Record<string, string[]> | { min: string; max: string };
}

export interface MeasurementPoint {
  id: string;
  name: string;
  parameters: Record<string, any>;
}

export interface Position {
  id: string;
  name: string;
  points: MeasurementPoint[];
}

export interface LotEntry {
  id: string;
  lotId: string;
  machineId: string;
  positions: Position[];
  createdAt: string;
}

// Machine configs
export const MACHINE_CONFIGS: MachineConfig[] = [
  {
    id: 'epf-f',
    name: 'EPF-F',
    defaultPositions: ['HEAD', 'TAIL'],
    defaultPoints: ['TOP1', 'MID1', 'BOT1', 'TOP2', 'MID2', 'BOT2', 'TOP3', 'MID3', 'BOT3'],
    parameters: [
      { key: 'density', label: 'Density', type: 'single' },
      { key: 'cellCount', label: 'Cell Count', type: 'single', optional: true },
      { key: 'compressionSet', label: 'Compression Set', type: 'array', defaultCount: 3 },
      { key: 'airFlow10mm', label: 'Air Flow 10mm', type: 'array', defaultCount: 3 },
      { key: 'fHardness', label: 'F Hardness', type: 'hardness', defaultCount: 5, optional: true },
      { key: 'waterStopping', label: 'Water Stopping', type: 'array', defaultCount: 5 },
    ],
  },
  {
    id: 'ewz-40c',
    name: 'EWZ-40C',
    defaultPositions: ['HEAD', 'TAIL'],
    defaultPoints: ['TOP', 'MID', 'BOT'],
    parameters: [
      { key: 'density', label: 'Density', type: 'single' },
      { key: 'ballRebound', label: 'Ball Rebound', type: 'array', defaultCount: 3 },
      { key: 'cellCount', label: 'Cell Count', type: 'single', optional: true },
      { key: 'compressionSet', label: 'Compression Set', type: 'array', defaultCount: 3 },
      { key: 'airFlow10mm', label: 'Air Flow 10mm', type: 'array', defaultCount: 3 },
      { key: 'fHardness', label: 'F Hardness', type: 'hardness', defaultCount: 5, optional: true },
    ],
  },
  {
    id: 'ewz-ve',
    name: 'EWZ-VE',
    defaultPositions: ['HEAD', 'TAIL'],
    defaultPoints: ['TOP', 'MID', 'BOT'],
    parameters: [
      { key: 'density', label: 'Density', type: 'single' },
      { key: 'ballRebound', label: 'Ball Rebound', type: 'array', defaultCount: 3 },
      { key: 'cellCount', label: 'Cell Count', type: 'single', optional: true },
      { key: 'compressionSet', label: 'Compression Set', type: 'array', defaultCount: 3 },
      { key: 'airFlow10mm', label: 'Air Flow 10mm', type: 'array', defaultCount: 3 },
      { key: 'fHardness3sRefer', label: 'F Hardness (3s) - refer', type: 'hardness', defaultCount: 5, optional: true },
      { key: 'fHardness20s', label: 'F Hardness (20s)', type: 'hardness', defaultCount: 5 },
      { key: 'fHardnessSample3s', label: 'F Hardness of sample (3s)', type: 'minmax' },
    ],
  },
  {
    id: 'mcfcube55',
    name: 'MCFCUBE55',
    defaultPositions: ['HEAD', 'TAIL'],
    defaultPoints: ['TOP', 'MID', 'BOT'],
    parameters: [
      { key: 'density', label: 'Density', type: 'single' },
    ],
  },
];

export function createDefaultParameters(config: MachineConfig): Record<string, any> {
  const params: Record<string, any> = {};
  for (const p of config.parameters) {
    if (p.type === 'single') params[p.key] = '';
    else if (p.type === 'array') params[p.key] = Array(p.defaultCount || 3).fill('');
    else if (p.type === 'hardness') params[p.key] = { left: Array(p.defaultCount || 5).fill(''), center: Array(p.defaultCount || 5).fill(''), right: Array(p.defaultCount || 5).fill('') };
    else if (p.type === 'minmax') params[p.key] = { min: '', max: '' };
  }
  return params;
}

export function createDefaultEntry(config: MachineConfig, lotId: string): LotEntry {
  return {
    id: crypto.randomUUID(),
    lotId,
    machineId: config.id,
    createdAt: new Date().toISOString(),
    positions: config.defaultPositions.map(pos => ({
      id: crypto.randomUUID(),
      name: pos,
      points: config.defaultPoints.map(pt => ({
        id: crypto.randomUUID(),
        name: pt,
        parameters: createDefaultParameters(config),
      })),
    })),
  };
}

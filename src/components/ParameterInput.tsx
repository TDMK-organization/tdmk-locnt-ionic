import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { ParameterFieldDef } from '@/types/measurement';

interface Props {
  field: ParameterFieldDef;
  value: any;
  onChange: (value: any) => void;
}

export function ParameterInput({ field, value, onChange }: Props) {
  if (field.type === 'single') {
    return (
      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">
          {field.label} {field.optional && <Badge variant="outline" className="ml-1 text-[10px]">Optional</Badge>}
        </Label>
        <Input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.label}
          className="h-8 text-sm"
        />
      </div>
    );
  }

  if (field.type === 'array') {
    const arr = Array.isArray(value) ? value : Array(field.defaultCount || 3).fill('');
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-muted-foreground">
            {field.label} {field.optional && <Badge variant="outline" className="ml-1 text-[10px]">Optional</Badge>}
          </Label>
          <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => onChange([...arr, ''])}>
            <Plus className="h-3 w-3" />
          </Button>
          {arr.length > 1 && (
            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => onChange(arr.slice(0, -1))}>
              <Minus className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {arr.map((v: string, i: number) => (
            <Input
              key={i}
              value={v}
              onChange={e => { const next = [...arr]; next[i] = e.target.value; onChange(next); }}
              placeholder={`n${i + 1}`}
              className="h-8 w-20 text-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'hardness') {
    const hv = value && typeof value === 'object' && !Array.isArray(value)
      ? value
      : { left: Array(field.defaultCount || 5).fill(''), center: Array(field.defaultCount || 5).fill(''), right: Array(field.defaultCount || 5).fill('') };
    const sections = ['left', 'center', 'right'] as const;
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-muted-foreground">
            {field.label} {field.optional && <Badge variant="outline" className="ml-1 text-[10px]">Optional</Badge>}
          </Label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {sections.map(sec => {
            const arr = Array.isArray(hv[sec]) ? hv[sec] : Array(field.defaultCount || 5).fill('');
            return (
              <div key={sec} className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">{sec}</span>
                  <Button size="icon" variant="ghost" className="h-4 w-4" onClick={() => onChange({ ...hv, [sec]: [...arr, ''] })}>
                    <Plus className="h-2.5 w-2.5" />
                  </Button>
                  {arr.length > 1 && (
                    <Button size="icon" variant="ghost" className="h-4 w-4" onClick={() => onChange({ ...hv, [sec]: arr.slice(0, -1) })}>
                      <Minus className="h-2.5 w-2.5" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {arr.map((v: string, i: number) => (
                    <Input
                      key={i}
                      value={v}
                      onChange={e => { const next = [...arr]; next[i] = e.target.value; onChange({ ...hv, [sec]: next }); }}
                      placeholder={`n${i + 1}`}
                      className="h-7 w-16 text-xs"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === 'minmax') {
    const mv = value && typeof value === 'object' ? value : { min: '', max: '' };
    return (
      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{field.label}</Label>
        <div className="flex gap-2">
          <Input value={mv.min} onChange={e => onChange({ ...mv, min: e.target.value })} placeholder="Min" className="h-8 w-24 text-sm" />
          <Input value={mv.max} onChange={e => onChange({ ...mv, max: e.target.value })} placeholder="Max" className="h-8 w-24 text-sm" />
        </div>
      </div>
    );
  }

  return null;
}

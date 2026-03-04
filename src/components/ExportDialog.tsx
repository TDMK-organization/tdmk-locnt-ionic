import { useState } from 'react';
import { LotEntry } from '@/types/measurement';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machineId: string;
  entries: LotEntry[];
}

export function ExportDialog({ open, onOpenChange, machineId, entries }: Props) {
  const [lotId, setLotId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleExport = () => {
    if (!lotId.trim()) {
      toast.error('Vui lòng nhập Lot sản xuất');
      return;
    }
    if (!file) {
      toast.error('Vui lòng upload file format');
      return;
    }

    const entry = entries.find(e => e.lotId === lotId.trim());
    if (!entry) {
      toast.error('Không tìm thấy Lot: ' + lotId);
      return;
    }

    // Prepare data package for external processing
    const exportData = {
      lotId: entry.lotId,
      machineId,
      positions: entry.positions,
      formatFile: file.name,
      exportedAt: new Date().toISOString(),
    };

    // Download as JSON (user will process with their own tool)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${machineId}_${lotId}_export.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Đã xuất dữ liệu thành công!');
    onOpenChange(false);
    setLotId('');
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" /> Export Data
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Lot sản xuất</Label>
            <Input value={lotId} onChange={e => setLotId(e.target.value)} placeholder="VD: 20250926V-7" />
          </div>
          <div className="space-y-2">
            <Label>Upload Format Template</Label>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground w-full">
                <Upload className="h-4 w-4" />
                {file ? file.name : 'Chọn file format...'}
                <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" /> Xuất dữ liệu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

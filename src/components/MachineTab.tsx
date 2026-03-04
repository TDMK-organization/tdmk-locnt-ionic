import { useState, useMemo } from 'react';
import { MachineConfig, LotEntry } from '@/types/measurement';
import { useMeasurementStore } from '@/hooks/useMeasurementStore';
import { ParameterInput } from './ParameterInput';
import { ExportDialog } from './ExportDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Plus, Trash2, Download, ChevronRight } from 'lucide-react';

interface Props {
  config: MachineConfig;
}

const ITEMS_PER_PAGE = 5;

export function MachineTab({ config }: Props) {
  const store = useMeasurementStore();
  const [search, setSearch] = useState('');
  const [newLotId, setNewLotId] = useState('');
  const [page, setPage] = useState(1);
  const [newPosName, setNewPosName] = useState('');
  const [newPointName, setNewPointName] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  const allEntries = store.getEntriesForMachine(config.id);
  const filtered = useMemo(() => {
    if (!search) return allEntries;
    return allEntries.filter(e => e.lotId.toLowerCase().includes(search.toLowerCase()));
  }, [allEntries, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddLot = () => {
    if (!newLotId.trim()) return;
    store.addEntry(config, newLotId.trim());
    setNewLotId('');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm Lot..."
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={newLotId}
            onChange={e => setNewLotId(e.target.value)}
            placeholder="Nhập Lot ID (VD: 20250926V-7)"
            className="h-9 w-64"
            onKeyDown={e => e.key === 'Enter' && handleAddLot()}
          />
          <Button onClick={handleAddLot} size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Thêm Lot
          </Button>
        </div>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setExportOpen(true)}>
          <Download className="h-4 w-4" /> Export Data
        </Button>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Tổng: <span className="font-semibold text-foreground">{filtered.length}</span> lot
      </div>

      {/* Entries */}
      {paginated.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Chưa có dữ liệu. Thêm Lot mới để bắt đầu nhập liệu.
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {paginated.map(entry => (
            <LotEntryCard key={entry.id} entry={entry} config={config} store={store} newPosName={newPosName} setNewPosName={setNewPosName} newPointName={newPointName} setNewPointName={setNewPointName} />
          ))}
        </Accordion>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={e => { e.preventDefault(); setPage(i + 1); }}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={e => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} machineId={config.id} entries={allEntries} />
    </div>
  );
}

function LotEntryCard({
  entry,
  config,
  store,
  newPosName,
  setNewPosName,
  newPointName,
  setNewPointName,
}: {
  entry: LotEntry;
  config: MachineConfig;
  store: ReturnType<typeof useMeasurementStore>;
  newPosName: string;
  setNewPosName: (v: string) => void;
  newPointName: string;
  setNewPointName: (v: string) => void;
}) {
  return (
    <AccordionItem value={entry.id} className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-mono">{entry.lotId}</Badge>
          <span className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString('vi-VN')}</span>
          <Badge variant="outline" className="text-xs">{entry.positions.length} vị trí</Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="destructive"
            size="sm"
            className="gap-1"
            onClick={() => store.deleteEntry(entry.id)}
          >
            <Trash2 className="h-3 w-3" /> Xóa Lot
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3 w-3" /> Thêm vị trí
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Thêm vị trí mới</DialogTitle></DialogHeader>
              <Input value={newPosName} onChange={e => setNewPosName(e.target.value)} placeholder="Tên vị trí (VD: HEAD2)" />
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={() => { if (newPosName.trim()) { store.addPosition(entry.id, newPosName.trim(), config); setNewPosName(''); } }}>
                    Thêm
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Positions */}
        <div className="space-y-3">
          {entry.positions.map(pos => (
            <Card key={pos.id} className="border-l-4 border-l-primary">
              <CardHeader className="py-2 px-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    {pos.name}
                    <Badge variant="outline" className="text-[10px]">{pos.points.length} điểm</Badge>
                  </CardTitle>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                          <Plus className="h-3 w-3" /> Điểm
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Thêm điểm đo mới</DialogTitle></DialogHeader>
                        <Input value={newPointName} onChange={e => setNewPointName(e.target.value)} placeholder="Tên điểm (VD: TOP4)" />
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button onClick={() => { if (newPointName.trim()) { store.addPoint(entry.id, pos.id, newPointName.trim(), config); setNewPointName(''); } }}>
                              Thêm
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {entry.positions.length > 1 && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => store.removePosition(entry.id, pos.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <Accordion type="multiple" className="space-y-1">
                  {pos.points.map(pt => (
                    <AccordionItem key={pt.id} value={pt.id} className="border rounded">
                      <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pt.name}</span>
                          {pos.points.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 text-destructive"
                              onClick={e => { e.stopPropagation(); store.removePoint(entry.id, pos.id, pt.id); }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          {config.parameters.map(field => (
                            <ParameterInput
                              key={field.key}
                              field={field}
                              value={pt.parameters[field.key]}
                              onChange={v => store.updateParameter(entry.id, pos.id, pt.id, field.key, v)}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

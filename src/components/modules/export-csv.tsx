import { FileIcon, MagicWandIcon } from '@radix-ui/react-icons';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Button } from '../ui/button';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogWrapperContent
} from '@/components/ui/dialog';
import { Input } from '../ui/input';

const ExportCsv = ({ data, headers }: { data: object[]; headers: { label: string; key: string }[] }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const handleClick = () => {
    setIsExporting(true);
    setOpen(false);
    setTimeout(() => {
      setIsExporting(false);
    }, 5000);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isExporting}>
            <MagicWandIcon className="w-2 h-2" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent
          onCloseAutoFocus={() => {
            // reset()
            setFileName('');
          }}
        >
          <DialogHeader>
            <DialogTitle>Export CSV</DialogTitle>
          </DialogHeader>
          <DialogWrapperContent>
            <Input
              type="text"
              placeholder="Enter file name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleClick();
                  ref.current.click();
                }
              }}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </DialogWrapperContent>
          <DialogFooter className="sm:justify-end">
            <CSVLink ref={ref} data={data} headers={headers} filename={fileName} >
              <Button variant="outline" onClick={handleClick} className="cursor-pointer">
                <FileIcon className="w-2 h-2" />
                Save
              </Button>
            </CSVLink>
          </DialogFooter>
        </DialogContent>
      </Dialog>{' '}
    </>
  );
};

export default ExportCsv;

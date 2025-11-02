import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogWrapperContent
} from '@/components/ui/dialog';
import { useDuckDBStore } from '@/store/duckdb';
import useTableStore from '@/store/table';
import { PlusIcon } from '@radix-ui/react-icons';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '../ui/dropzone';
import ListUploadFile from './table-duckdb/list-upload-file';
import { loadFile } from '@/lib/duckdb-util';
import { toast } from 'sonner';
import { MAX_FILE_SIZE } from '@/lib/constant';

const AddNewTable = () => {
  const [listFiles, setListFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  // Handle file selection
  console.log(listFiles);
  const handleDrop = (files: File[]) => {
    console.log(files);
    setListFiles(files);
  };

  const [isloading, setIsloading] = useState(false);

  const { db, connection } = useDuckDBStore();
  const { listTable, setListTable } = useTableStore();

  // Get file type icon based on file extension
  const handleLoadFile = async () => {
    setIsloading(true);
    const newMap = new Map(listTable);

    setListTable(newMap);

    for (const file of listFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size is too large: ' + file.name);
        continue;
      }
      const { tableName, metadataTable } = await loadFile(file, connection!, db!);
      if (metadataTable.columns.length === 0) {
        toast.error('File loaded failed: ' + file.name);
        continue;
      }
      newMap.set(tableName, metadataTable);
    }
    setListTable(newMap);
    setListFiles([]);
    setOpen(false);
    setIsloading(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="flex items-center gap-2 text-xs cursor-pointer">
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent
          onCloseAutoFocus={() => {
            // reset()
            setListFiles([]);
          }}
        >
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>Add new table from file</DialogDescription>
          </DialogHeader>
          <DialogWrapperContent>
            <Dropzone
              disabled={isloading}
              className="cursor-pointer"
              maxFiles={5}
              maxSize={5 * 1024 * 1024} // 5MB in bytes
              accept={{
                'text/csv': ['.csv'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls']
              }}
              onDrop={handleDrop}
              src={listFiles}
              onError={(err) => {
                console.log(err.message.toLowerCase());
                if (err.message.toLowerCase().includes('file is larger')) {
                  toast.error('Max file size is 5MB');
                } else {
                  toast.error(err.message);
                }
              }}
            >
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
            {listFiles.length > 0 && (
              <div className="mt-4">
                <ListUploadFile listFiles={listFiles} isLoading={isloading} />
              </div>
            )}
          </DialogWrapperContent>
          <DialogFooter className="sm:justify-between">
            <Button disabled={isloading} type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleLoadFile} className="gap-2" disabled={isloading}>
              {isloading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>{' '}
    </div>
  );
};

export default AddNewTable;

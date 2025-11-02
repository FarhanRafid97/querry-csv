import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, formatFileSize, getFileTypeColor } from '@/lib/utils';
import { Cross2Icon, FileIcon } from '@radix-ui/react-icons';
import { CircleAlert } from 'lucide-react';
import FileIconComponent from './file-icon';
import { MAX_FILE_SIZE } from '@/lib/constant';

interface ListUploadFileProps {
  listFiles: File[];
  onRemoveFile?: (index: number) => void;
  className?: string;
  isLoading?: boolean;
}

const ListUploadFile = ({ listFiles, onRemoveFile, className, isLoading = false }: ListUploadFileProps) => {
  // Get file type badge color

  if (listFiles.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        <FileIcon className="size-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Uploaded Files ({listFiles.length})</h3>
        <div className="text-xs text-muted-foreground">
          Total: {formatFileSize(listFiles.reduce((acc, file) => acc + file.size, 0))}
        </div>
      </div>

      <div
        className={cn(
          'space-y-2 max-h-64  px-1',
          isLoading ? 'opacity-50 overflow-y-hidden' : 'opacity-100 overflow-y-auto'
        )}
      >
        {listFiles.map((file, index) => {
          const isOverCapacity = file.size > MAX_FILE_SIZE;
          return (
            <div>
              <div
                key={`${file.name}-${index}`}
                className={cn(
                  'group flex items-center gap-3 p-3 rounded-lg border   transition-all duration-75 hover:shadow-sm',
                  isOverCapacity
                    ? 'bg-destructive/5 border-destructive/30 hover:bg-destructive/10'
                    : 'bg-card hover:bg-accent/50'
                )}
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  <FileIconComponent fileName={file.name} />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{file.name}</p>
                      </TooltipContent>
                    </Tooltip>

                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        getFileTypeColor(file.name)
                      )}
                    >
                      {file.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn(isOverCapacity ? ' text-destructive/80 ' : 'text-primary')}>
                      {formatFileSize(file.size)}
                    </span>
                    <span>•</span>
                    <span>Modified {new Date(file.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Remove Button */}
                {onRemoveFile && (
                  <div className="flex-shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFile(index)}
                          className="size-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Cross2Icon className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove file</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
              {isOverCapacity ? (
                <div className="flex text-xs text-destructive/80 mt-1 items-center gap-1">
                  <CircleAlert size={14} />
                  <span>Maximum file size </span>
                  <span>{formatFileSize(MAX_FILE_SIZE)}</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {listFiles.length > 3 && (
        <>
          <Separator className="my-2" />
          <div className="text-xs text-muted-foreground text-center">Scroll to view more files</div>
        </>
      )}
    </div>
  );
};

export default ListUploadFile;

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import usePanelResizeStore from '@/store/panel-resize';
import useQuerryStore from '@/store/querry';
import useTableStore from '@/store/table';
import { useCallback, useRef } from 'react';
import { match } from 'ts-pattern';
import ErrorQuerry from '../modules/error-querry';
import ShowListResult from '../modules/show-list-result';
import SQLEditor from '../modules/sql-editor';
import { AppSidebar } from '../sidebar/app-sidebar';

export default function Page() {
  const { currentShowingDataMultiple, currentShowingHeadersMultiple } = useTableStore();
  const { errorQuerry } = useQuerryStore();

  const { setPanelResize, setPanelOnResize } = usePanelResizeStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handler for individual panel resize
  const handlePanelResize = useCallback(() => {
    return (size: number): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setPanelResize('resize-result', size, size);
      }, 50); // Adjust delay as needed
    };
  }, [setPanelResize]);

  return (
    <SidebarProvider className="font-geist-mono">
      <AppSidebar />
      <SidebarInset className="max-w-full min-w-0 ">
        <div className="w-full h-screen flex flex-col">
          <header className="bg-background flex shrink-0 items-center gap-2 border-b p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Inbox</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex-1 min-h-0 overflow-hidden   ">
            <ResizablePanelGroup direction="vertical" className="h-full  ">
              <ResizablePanel defaultSize={50} className="min-h-0">
                <div className="h-full">
                  <SQLEditor />
                </div>
              </ResizablePanel>
              <ResizableHandle
                onDragging={(e) => {
                  console.log('onDragging', e);
                  setPanelOnResize('resize-result', e);
                }}
              />
              <ResizablePanel
                minSize={40}
                maxSize={90}
                panel-name="resize-result"
                defaultSize={50}
                className="min-h-0"
                onResize={(e) => {
                  handlePanelResize()(e);
                }}
              >
                <div className="h-full overflow-hidden flex flex-col">
                  {match(!!errorQuerry)
                    .with(true, () => <ErrorQuerry errorQuerry={errorQuerry} />)
                    .otherwise(() => {
                      return match(currentShowingHeadersMultiple.length)
                        .with(0, () => {
                          return <div className="p-4">No data</div>;
                        })
                        .otherwise(() => {
                          return (
                            <ShowListResult
                              currentShowingHeadersMultiple={currentShowingHeadersMultiple}
                              currentShowingDataMultiple={currentShowingDataMultiple}
                            />
                          );
                        });
                    })}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

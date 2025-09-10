import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useQuerryStore from "@/store/querry";
import useTableStore from "@/store/table";
import { match } from "ts-pattern";
import ErrorQuerry from "../modules/error-querry";
import ShowListResult from "../modules/show-list-result";
import SQLEditor from "../modules/sql-editor";
import { AppSidebar } from "../sidebar/app-sidebar";

export default function Page() {
  const { currentShowingDataMultiple, currentShowingHeadersMultiple } =
    useTableStore();
  const { errorQuerry } = useQuerryStore();
  console.log(currentShowingHeadersMultiple);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-w-full min-w-0">
        <div className="w-full h-screen flex flex-col">
          <header className="bg-background flex shrink-0 items-center gap-2 border-b p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
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

          <div className="flex-1 min-h-0">
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={50} className="min-h-0">
                <div className="h-full">
                  <SQLEditor />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50} className="min-h-0">
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
                              currentShowingHeadersMultiple={
                                currentShowingHeadersMultiple
                              }
                              currentShowingDataMultiple={
                                currentShowingDataMultiple
                              }
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

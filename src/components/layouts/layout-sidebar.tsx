import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { match } from "ts-pattern";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SQLEditor from "../modules/sql-editor";
import OutputData from "../modules/output-data";
import useTableStore from "@/store/table";
import useQuerryStore from "@/store/querry";
import ErrorQuerry from "../modules/error-querry";

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
                            <div className="w-full h-full flex flex-col">
                              <Tabs
                                defaultValue="data-0"
                                className="w-full h-full flex flex-col"
                              >
                                <TabsList className="w-full flex shrink-0">
                                  {currentShowingHeadersMultiple.map(
                                    (_, index) => (
                                      <TabsTrigger
                                        key={index}
                                        value={`data-${index}`}
                                      >
                                        Result {index + 1}
                                      </TabsTrigger>
                                    )
                                  )}
                                </TabsList>
                                {currentShowingDataMultiple.map(
                                  (data, index) => (
                                    <TabsContent
                                      key={index}
                                      value={`data-${index}`}
                                      className="flex-1 min-h-0 overflow-auto"
                                    >
                                      <OutputData
                                        data={data}
                                        headers={
                                          currentShowingHeadersMultiple[index]
                                        }
                                      />
                                    </TabsContent>
                                  )
                                )}
                              </Tabs>
                            </div>
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

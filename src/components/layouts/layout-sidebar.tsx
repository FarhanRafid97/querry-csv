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
        <div className="w-full h-full">
          <ResizablePanelGroup direction="vertical">
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
            <ResizablePanel className="h-[100vh]">
              <div>
                <SQLEditor />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div>
                {match(!!errorQuerry)
                  .with(true, () => <ErrorQuerry errorQuerry={errorQuerry} />)
                  .otherwise(() => {
                    return match(currentShowingHeadersMultiple.length)
                      .with(0, () => {
                        return <div>No data</div>;
                      })
                      .otherwise(() => {
                        return (
                          <div className="w-full h-full">
                            <Tabs
                              defaultValue="data-0"
                              className="w-full  flex"
                            >
                              <TabsList className="w-full  flex">
                                {currentShowingHeadersMultiple.map(
                                  (_, index) => (
                                    <TabsTrigger value={`data-${index}`}>
                                      Result {index + 1}
                                    </TabsTrigger>
                                  )
                                )}
                              </TabsList>
                              {currentShowingDataMultiple.map((data, index) => (
                                <TabsContent value={`data-${index}`}>
                                  <OutputData
                                    data={data}
                                    headers={
                                      currentShowingHeadersMultiple[index]
                                    }
                                  />
                                </TabsContent>
                              ))}
                            </Tabs>
                          </div>
                        );
                      });
                  })}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

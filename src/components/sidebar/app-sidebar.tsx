"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import useTableStore from "@/store/table";
import { FrameIcon } from "@radix-ui/react-icons";
import * as React from "react";
import AddNewTable from "../modules/add-new-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.

  const { listTable } = useTableStore();

  return (
    <>
      {" "}
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>test</SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
              <div className="items-center grid-cols-12 grid">
                <span className="col-span-11 text-sm "> Table</span>
                <div className="col-span-1">
                  <AddNewTable />
                </div>
              </div>
            </SidebarGroupLabel>
            <SidebarMenu className="gap-y-0">
              {Array.from(listTable.values()).map((item) => (
                <SidebarMenuItem key={item.label} className="p-0 h-auto">
                  <SidebarMenuButton asChild className="p-1  px-2 h-auto">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1">
                        <FrameIcon />
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="col-span-11">{item.label}</span>
                        </TooltipTrigger>
                        <TooltipContent align="start" side="top">
                          {item.label}
                          <TooltipArrow />
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  );
}

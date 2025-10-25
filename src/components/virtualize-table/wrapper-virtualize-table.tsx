import { cn } from "@/lib/utils";
import React from "react";
import usePanelResizeStore from "@/store/panel-resize";

export default function WrapperVirtualizeTable({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { panelResize } = usePanelResizeStore();
  const resultPanelResize = panelResize["resize-result"];
  return (
    <div
      className={cn("relative w-full overflow-auto", className)}
      style={{
        maxHeight: `${resultPanelResize.height - 23}vh`,
      }}
      {...props}
    />
  );
}

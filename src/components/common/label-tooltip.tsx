import { cn } from "@/lib/utils";

import React, { useState, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

const LabelTooltip = ({ children }: { children: React.ReactNode }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = () => {
    const element = textRef.current;
    if (element) {
      const isOverflowing = element.scrollWidth > element.clientWidth;
      setIsTruncated(isOverflowing);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <span
        onMouseEnter={() => {
          checkTruncation();
        }}
        onMouseLeave={() => {
          setIsTruncated(false);
        }}
      >
        {isTruncated ? (
          <Tooltip>
            <TooltipTrigger
              className={cn(
                "h-fit overflow-hidden rounded-md max-w-fit text-xs cursor-text  truncate font-[500]"
              )}
            >
              {children}
            </TooltipTrigger>
            <TooltipContent
              align="start"
              side="top"
              className={cn("max-w-[300px]")}
            >
              {children}
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        ) : (
          <p
            ref={textRef}
            className={cn(
              "h-fit overflow-hidden rounded-md max-w-fit text-xs  truncate font-[500]"
            )}
          >
            {children || "-"}
          </p>
        )}
      </span>
    </TooltipProvider>
  );
};

export default LabelTooltip;

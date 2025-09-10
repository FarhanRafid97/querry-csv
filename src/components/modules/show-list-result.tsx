import React, { memo } from "react";
import OutputData from "./output-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

interface ShowListResultProps {
  currentShowingHeadersMultiple: [][];
  currentShowingDataMultiple: [][][];
}

const ShowListResult: React.FC<ShowListResultProps> = ({
  currentShowingHeadersMultiple,
  currentShowingDataMultiple,
}) => {
  console.log("ini currentShowingDataMultiple", currentShowingDataMultiple);
  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="data-0" className="w-full h-full flex flex-col">
        <TabsList className="w-full flex shrink-0">
          {currentShowingDataMultiple.map((_, index) => (
            <TabsTrigger key={index} value={`data-${index}`}>
              Result {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {currentShowingDataMultiple.map((data, index) => (
          <MemoizedTabContent
            heeaders={currentShowingHeadersMultiple[index]}
            data={data}
            index={index}
          />
        ))}
      </Tabs>
    </div>
  );
};

const TabContent = ({
  heeaders,
  data,
  index,
}: {
  heeaders: [];
  data: [][];
  index: number;
}) => {
  return (
    <TabsContent
      key={index}
      value={`data-${index}`}
      className="flex-1 min-h-0 overflow-auto"
    >
      <OutputData data={data} headers={heeaders} />
    </TabsContent>
  );
};
const MemoizedTabContent = memo(TabContent);

export default ShowListResult;

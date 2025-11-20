import { CSVLink } from 'react-csv';
import { Button } from '../ui/button';
import { useState } from 'react';
import { MagicWandIcon } from '@radix-ui/react-icons';

const ExportCsv = ({ data, headers }: { data: object[]; headers: { label: string; key: string }[] }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 5000);
  };

  return (
    <>
      {isExporting ? (
        <Button variant="outline" onClick={handleClick} disabled={isExporting}>
          Delay Export
        </Button>
      ) : (
        <CSVLink data={data} headers={headers}>
          <Button variant="outline" onClick={handleClick} className="cursor-pointer">
            <MagicWandIcon className="w-2 h-2" />
            Export
          </Button>
        </CSVLink>
      )}
    </>
  );
};

export default ExportCsv;

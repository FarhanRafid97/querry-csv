import { Cross2Icon } from '@radix-ui/react-icons';
import { SearchIcon } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { Input } from '../ui/input';

const SearchTable = ({
  search,
  setSearch
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const refInputSearch = React.useRef<HTMLInputElement>(null);
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  return (
    <div className="relative w-fit">
      <ButtonGroup>
        <Input
          ref={refInputSearch}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(refInputSearch.current?.value ?? '');
            }
          }}
          className="z-[9] w-60 pr-8 h-7"
          placeholder="Search Items..."
        />
        {search.length > 0 && (
          <button
            type="button"
            className=" overflow-hidden hover:bg-muted hover:rounded-xl h-fit p-1  absolute shadow-none right-12  top-1/2 transform -translate-y-1/2 z-[10] "
            onClick={() => {
              if (refInputSearch.current) {
                refInputSearch.current.value = '';
              }
              setSearch('');
            }}
          >
            <Cross2Icon className="size-4" />
          </button>
        )}

        <Button
          variant="outline"
          aria-label="Search"
          className="h-7"
          onClick={() => handleSearch(refInputSearch.current?.value ?? '')}
        >
          <SearchIcon size={14} />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default SearchTable;

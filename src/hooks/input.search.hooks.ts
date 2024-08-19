import { ChangeEvent, useMemo, useRef, useState } from "react";

export const useInputSearch = ({
  refetch,
  searchField = "queryString",
  ...props
}: {
  refetch: (props: any) => void;
  searchField?: string;
  [key: string]: any;
}) => {
  const [searchText, setSearchText] = useState("");
  const runSearch = useRef<NodeJS.Timeout | number | null>(null);
  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setSearchText(text);

    try {
      clearInterval(runSearch.current as number);
    } catch (e) {}

    runSearch.current = setTimeout(() => {
      refetch({
        current: 1,
        pageSize: 50,
        [searchField]: text,
        ...props,
      });
    }, 500);
  };
  return useMemo(
    () => ({
      searchText,
      handleChangeSearch,
    }),
    [searchText, handleChangeSearch],
  );
};

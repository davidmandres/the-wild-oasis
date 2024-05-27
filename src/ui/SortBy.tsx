import { useSearchParams } from "react-router-dom";
import { OperationOptionObj } from "../utils/config";
import Select from "./Select";

interface SortByProps<T extends string> {
  options: OperationOptionObj<T>[];
}

export default function SortBy<T extends string>({ options }: SortByProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currSortBy: T | "" = (searchParams.get("sortBy") as T | null) || "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set("sortBy", e.target.value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <Select<T | "">
      options={options}
      value={currSortBy}
      onChange={handleChange}
    />
  );
}

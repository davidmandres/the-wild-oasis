import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";
import {
  OperationOptionObj,
  URLCabinFilters,
  URLCabinSorters,
} from "../../utils/config";

export default function CabinTableOperations() {
  const filterOptions: OperationOptionObj<URLCabinFilters>[] = [
    { value: "all", label: "All" },
    { value: "no-discount", label: "No discount" },
    { value: "with-discount", label: "With discount" },
  ];
  const sortOptions: OperationOptionObj<URLCabinSorters>[] = [
    { value: "name-asc", label: "Sort by name (A-Z)" },
    { value: "name-desc", label: "Sort by name (Z-A)" },
    { value: "regPrice-asc", label: "Sort by price (low first)" },
    { value: "regPrice-desc", label: "Sort by price (high first)" },
    { value: "maxCapacity-asc", label: "Sort by capacity (low first)" },
    { value: "maxCapacity-desc", label: "Sort by capacity (high first)" },
  ];

  return (
    <TableOperations>
      <Filter<URLCabinFilters> filterField="discount" options={filterOptions} />
      <SortBy<URLCabinSorters> options={sortOptions} />
    </TableOperations>
  );
}

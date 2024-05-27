import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import {
  OperationOptionObj,
  URLBookingFilters,
  URLBookingSorters,
} from "../../utils/config";

export default function BookingTableOperations() {
  const filterOptions: OperationOptionObj<URLBookingFilters>[] = [
    { value: "all", label: "All" },
    { value: "checked-out", label: "Checked out" },
    { value: "checked-in", label: "Checked in" },
    { value: "unconfirmed", label: "Unconfirmed" },
  ];
  const sortOptions: OperationOptionObj<URLBookingSorters>[] = [
    { value: "startDate-desc", label: "Sort by date (recent first)" },
    { value: "startDate-asc", label: "Sort by date (earlier first)" },
    {
      value: "totalPrice-desc",
      label: "Sort by amount (high first)",
    },
    { value: "totalPrice-asc", label: "Sort by amount (low first)" },
  ];

  return (
    <TableOperations>
      <Filter filterField="status" options={filterOptions} />
      <SortBy options={sortOptions} />
    </TableOperations>
  );
}

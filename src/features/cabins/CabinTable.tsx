import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import useCabins from "./useCabins.hooks";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import { CabinObj, URLCabinFilters, URLCabinSorters } from "../../utils/config";
import Empty from "../../ui/Empty";

export default function CabinTable() {
  const [cabins, isLoading] = useCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!cabins?.length) return <Empty resourceName="cabins" />;

  const filterValue: URLCabinFilters =
    (searchParams.get("discount") as URLCabinFilters | null) || "all";

  let filteredCabins: CabinObj[] | undefined;
  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabins?.filter((cabin) => cabin.discount !== 0);

  const sortBy: URLCabinSorters | "startDate-asc" =
    (searchParams.get("sortBy") as URLCabinSorters | null) || "startDate-asc";
  const [sortField, direction]: [keyof CabinObj, "asc" | "desc"] = sortBy.split(
    "-"
  ) as [keyof CabinObj, "asc" | "desc"];
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = filteredCabins?.sort(
    (a, b) => (Number(a[sortField]) - Number(b[sortField])) * modifier
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body<CabinObj>
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

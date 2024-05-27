import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import {
  PAGE_SIZE,
  URLBookingFilters,
  URLBookingSorterFields,
  URLBookingSorters,
  URLSortingDirections,
} from "../../utils/config";

export default function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get("status") as URLBookingFilters | null;
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  const sortByRaw = searchParams.get("sortBy") as URLBookingSorters | null;
  let sortBy: {
      field: URLBookingSorterFields;
      direction: URLSortingDirections;
    } | null,
    field: URLBookingSorterFields | "startDate" | "totalPrice" | undefined,
    direction;

  const currPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  if (!sortByRaw) sortBy = { field: "start_date", direction: "asc" };
  else {
    [field, direction] = sortByRaw.split("-") as [
      "startDate" | "totalPrice",
      URLSortingDirections
    ];
    field = field === "startDate" ? "start_date" : "total_price";
    sortBy = { field, direction };
  }

  const { isLoading, data, error } = useQuery({
    queryKey: ["bookings", filter, sortBy, currPage],
    queryFn: () => getBookings({ filter, sortBy, currPage }),
  });

  const [bookings, numOfResults] = data ?? [];

  const numOfPages = numOfResults ? Math.ceil(numOfResults / PAGE_SIZE) : 0;

  if (currPage < numOfPages)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, currPage + 1],
      queryFn: () => getBookings({ filter, sortBy, currPage: currPage + 1 }),
    });

  if (currPage > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, currPage - 1],
      queryFn: () => getBookings({ filter, sortBy, currPage: currPage - 1 }),
    });

  return [bookings, numOfResults, isLoading, error] as const;
}

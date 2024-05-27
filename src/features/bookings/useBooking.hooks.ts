import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export default function useBooking() {
  const { bookingID } = useParams();

  const {
    isLoading,
    data: booking,
    error,
  } = useQuery({
    queryKey: ["booking", bookingID],
    queryFn: () => getBooking(Number(bookingID)),
    retry: false,
  });

  return [booking, isLoading, error] as const;
}

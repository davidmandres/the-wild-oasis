import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BreakfastObj } from "../../utils/config";

export function useCheckIn() {
  interface MutationCheckInParameters {
    bookingID: number;
    breakfast?: BreakfastObj;
  }

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: mutateCheckIn, isPending: isCheckingIn } = useMutation({
    mutationFn: ({ bookingID, breakfast }: MutationCheckInParameters) =>
      updateBooking(bookingID, {
        status: "checked-in",
        is_paid: true,
        ...breakfast,
      }),
    onSuccess(data) {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      navigate("/");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return [mutateCheckIn, isCheckingIn] as const;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBooking } from "../../services/apiBookings";

export default function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: mutateDeleteBooking } = useMutation({
    mutationFn: deleteBooking,
    onSuccess() {
      toast.success("Successfully deleted the cabin!");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError(error) {
      toast.error(error.message + ":(");
    },
  });

  return [mutateDeleteBooking, isDeleting] as const;
}

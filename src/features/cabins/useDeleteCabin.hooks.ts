import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin } from "../../services/apiCabins";

export default function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: mutateDeleteCabin } = useMutation({
    mutationFn: deleteCabin,
    onSuccess() {
      toast.success("Successfully deleted the cabin!");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError(error) {
      toast.error(error.message + ":(");
    },
  });

  return [isDeleting, mutateDeleteCabin] as const;
}

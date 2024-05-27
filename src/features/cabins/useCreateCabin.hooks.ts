import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCabin } from "../../services/apiCabins";

export default function useCreateCabin() {
  const queryClient = useQueryClient();
  const { mutate: mutateCreateCabin, isPending: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: onSuccessToast,
    onError(error) {
      toast.error(error.message);
    },
  });

  function onSuccessToast() {
    const successMsg = "New cabin successfully created";

    toast.success(successMsg);
    queryClient.invalidateQueries({
      queryKey: ["cabins"],
    });
  }

  return [isCreating, mutateCreateCabin] as const;
}

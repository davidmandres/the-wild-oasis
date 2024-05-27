import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCabin } from "../../services/apiCabins";
import { APICabinObj } from "../../utils/config";

export default function useEditCabin() {
  const queryClient = useQueryClient();
  const { mutate: mutateEditCabin, isPending: isEditing } = useMutation({
    mutationFn({
      newCabinData,
      id,
    }: {
      newCabinData: APICabinObj;
      id: number;
    }) {
      return createCabin(newCabinData, id);
    },
    onSuccess: onSuccessToast,
    onError(error) {
      toast.error(error.message);
    },
  });

  function onSuccessToast() {
    const successMsg = "Cabin successfully edited";

    toast.success(successMsg);
    queryClient.invalidateQueries({
      queryKey: ["cabins"],
    });
  }

  return [isEditing, mutateEditCabin] as const;
}

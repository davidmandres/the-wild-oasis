import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting } from "../../services/apiSettings";

export default function useUpdateSetting() {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateSetting, isPending: isUpdating } = useMutation({
    mutationFn: updateSetting,
    onSuccess: onSuccessToast,
    onError(error) {
      toast.error(error.message);
    },
  });

  function onSuccessToast() {
    const successMsg = "Setting successfully updated";

    toast.success(successMsg);
    queryClient.invalidateQueries({
      queryKey: ["settings"],
    });
  }

  return [isUpdating, mutateUpdateSetting] as const;
}

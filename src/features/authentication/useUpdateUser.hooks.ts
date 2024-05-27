import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrUser } from "../../services/apiAuth";

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateCurrUser,
    onSuccess(data) {
      toast.success("User account successfully updated");
      queryClient.setQueryData(["user"], data?.user);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return [mutateUpdateUser, isUpdating] as const;
}

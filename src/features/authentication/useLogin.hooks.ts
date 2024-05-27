import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../services/apiAuth";
import { AuthUserObj } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: mutateLogin, isPending } = useMutation({
    mutationFn: ({ email, password }: AuthUserObj) =>
      login({ email, password }),
    onSuccess(data) {
      queryClient.setQueryData(["user"], data.user);
      navigate("/dashboard", { replace: true });
    },
    onError(error) {
      console.log("ERROR", error);
      toast.error("Provided email and/or password are/is incorrect");
    },
  });

  return [mutateLogin, isPending] as const;
}

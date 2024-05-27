import { useMutation } from "@tanstack/react-query";
import { signUp } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useSignUp() {
  const { mutate: mutateSignUp, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess() {
      toast.success(
        "Account succesfully created. Please verify the new account from the user's email address."
      );
    },
  });

  return [mutateSignUp, isPending] as const;
}

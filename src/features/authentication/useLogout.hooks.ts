import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: mutateLogout, isPending } = useMutation({
    mutationFn: logout,
    onSuccess() {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
  });

  return [mutateLogout, isPending] as const;
}

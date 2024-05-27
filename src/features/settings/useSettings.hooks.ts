import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

export default function useSettings() {
  const {
    isLoading,
    error,
    data: settings,
  } = useQuery({
    queryKey: ["settings"], // unique key to this particular request (url)
    queryFn: getSettings,
  });

  return [settings, isLoading, error] as const;
}

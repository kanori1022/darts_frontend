import useSWR from "swr";
import { useAxios } from "../axios/useAxios";

export const useFetch = <T>(url: string | null) => {
  const axios = useAxios();
  const { data, error, isLoading } = useSWR<T>(
    url,
    url ? () => axios.get(url).then(({ data }) => data as T) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return { data, error, isLoading };
};

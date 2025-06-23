import useSWR from "swr";
import { useAxios } from "../axios/useAxios";

export const useFetch = <T>(url: string) => {
  const axios = useAxios();
  const { data, error, isLoading } = useSWR<T>(url, () =>
    axios.get(url).then(({ data }) => data as T)
  );

  return { data, error, isLoading };
};



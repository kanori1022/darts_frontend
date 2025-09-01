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
      // エラー時の再試行設定を改善
      errorRetryCount: 3, // 3回まで再試行
      errorRetryInterval: 1000, // 1秒間隔で再試行
      // 認証エラー（401, 403）の場合は再試行しない
      shouldRetryOnError: (error) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return true;
      },
    }
  );

  return { data, error, isLoading };
};

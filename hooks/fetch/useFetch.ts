import useSWR from "swr";
import { useAxios } from "../axios/useAxios";

export const useFetch = <T>(url: string | null) => {
  const axios = useAxios();

  // デバッグ情報を追加
  if (url) {
    console.log("useFetch Debug Info:", {
      url,
      baseURL: axios.defaults.baseURL,
      fullURL: `${axios.defaults.baseURL}${url}`,
      headers: axios.defaults.headers,
    });
  }

  const { data, error, isLoading } = useSWR<T>(
    url,
    url
      ? () => {
          console.log(
            "Making API request to:",
            `${axios.defaults.baseURL}${url}`
          );
          return axios
            .get(url)
            .then(({ data }) => {
              console.log("API response received:", data);
              return data as T;
            })
            .catch((error) => {
              console.error("API request failed:", error);
              throw error;
            });
        }
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // エラー時の再試行設定を改善
      errorRetryCount: 3, // 3回まで再試行
      errorRetryInterval: 1000, // 1秒間隔で再試行
      // 404エラーと認証エラー（401, 403）の場合は再試行しない
      shouldRetryOnError: (error) => {
        const status = error?.response?.status;
        if (
          status === 401 ||
          status === 403 ||
          status === 404 // 404エラーは再試行しない
        ) {
          return false;
        }
        return true;
      },
    }
  );

  return { data, error, isLoading };
};

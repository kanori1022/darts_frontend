import axios from "axios";
import useSWR from "swr";

export const useFetchPublic = <T>(url: string | null) => {
  // 認証不要のaxiosインスタンスを作成
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // デバッグ情報を追加
  if (url) {
    console.log("useFetchPublic Debug Info:", {
      url,
      baseURL: axiosInstance.defaults.baseURL,
      fullURL: `${axiosInstance.defaults.baseURL}${url}`,
      headers: axiosInstance.defaults.headers,
    });
  }

  const { data, error, isLoading } = useSWR<T>(
    url,
    url
      ? () => {
          console.log(
            "Making public API request to:",
            `${axiosInstance.defaults.baseURL}${url}`
          );
          return axiosInstance
            .get(url)
            .then(({ data }) => {
              console.log("Public API response received:", data);
              return data as T;
            })
            .catch((error) => {
              console.error("Public API request failed:", error);
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

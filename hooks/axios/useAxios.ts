"use client";

import axios from "axios";
import { useMemo } from "react";
import useAuth from "../auth/useAuth";

export const useAxios = () => {
  const { token } = useAuth();
  const instance = useMemo(() => {
    // デバッグ情報を追加
    console.log("useAxios Debug Info:", {
      token: token ? "has token" : "no token",
      tokenLength: token?.length || 0,
      baseURL: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000",
    });

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000",
      headers: {
        "Content-Type": "application/json",
        // トークンが存在する場合のみAuthorizationヘッダーを追加
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      // withCredentials: true,
    });
  }, [token]);

  return instance;
};

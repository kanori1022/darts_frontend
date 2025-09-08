"use client";

import axios from "axios";
import { useMemo } from "react";
import useAuth from "../auth/useAuth";

export const useAxios = () => {
  const { token } = useAuth();
  const instance = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_HOST,
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

"use client";

import axios from "axios";
import useAuth from "../auth/useAuth";

export const useAxios = () => {
  const { token } = useAuth();
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
    },
    // withCredentials: true,
  });

  return instance;
};

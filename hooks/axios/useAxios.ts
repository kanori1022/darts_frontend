"use client";

import axios from 'axios';

export const useAxios = () => {
  const token = localStorage.getItem("token");
  const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_HOST,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // withCredentials: true,
      })
  
      return instance
}
 
"use client";

import axios from 'axios';

export const useAxios = () => {
  const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_HOST,
        headers: {
          'Content-Type': 'application/json',
        },
        // withCredentials: true,
  })

      return instance
}
 
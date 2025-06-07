import axios from 'axios'

export const useAxios = () => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      })

      return instance
}
 
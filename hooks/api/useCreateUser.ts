
import { UserParams } from "@/types/user";
import { useAxios } from "../axios/useAxios";

type UserRequest = {
  user: UserParams;
};

export const useCreateUser = () => {
  const axios = useAxios();

  const createUser = async (UserRequest: UserRequest) => {
    const response = await axios.postForm("/users", UserRequest);
    return response.data;
  };

  return { createUser };
};

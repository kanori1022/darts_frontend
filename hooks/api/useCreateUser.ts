import { UserParams } from "@/types/user";
import useAuth from "../auth/useAuth";
import { useAxios } from "../axios/useAxios";

type UserRequest = {
  user: UserParams;
  firebase_uid?: string;
};

export const useCreateUser = () => {
  const axios = useAxios();
  const { loginUser } = useAuth();

  const createUser = async (request: UserRequest) => {
    // Firebase UIDを追加
    const requestData = {
      ...request,
      firebase_uid: loginUser?.uid || request.firebase_uid,
    };

    const response = await axios.postForm("/users", requestData);
    return response.data;
  };

  return { createUser };
};

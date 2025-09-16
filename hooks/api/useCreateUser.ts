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
    // Firebase UIDを追加（新規登録時はrequest.firebase_uidを使用）
    const requestData = {
      ...request,
      firebase_uid: request.firebase_uid || loginUser?.uid,
    };

    console.log("API送信データ:", requestData); // デバッグ用

    const response = await axios.postForm("/users", requestData);
    return response.data;
  };

  return { createUser };
};

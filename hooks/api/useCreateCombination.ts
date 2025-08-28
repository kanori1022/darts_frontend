import { CombinationParams } from "@/types/combination";
import useAuth from "../auth/useAuth";
import { useAxios } from "../axios/useAxios";

type CombinationRequest = {
  combination: CombinationParams;
  firebase_uid?: string;
};

export const useCreateCombination = () => {
  const axios = useAxios();
  const { loginUser } = useAuth();

  const createCombination = async (request: CombinationRequest) => {
    // Firebase UIDを追加
    const requestData = {
      ...request,
      firebase_uid: loginUser?.uid,
    };

    const response = await axios.postForm("/combinations", requestData);
    return response.data;
  };

  return { createCombination };
};

import { Combination } from "@/app/post/page";
import { useAxios } from "../axios/useAxios";

type CombinationRequest = {
  combination: Combination;
};

export const useCreateCombination = () => {
  const axios = useAxios();

  const createCombination = async (CombinationRequest: CombinationRequest) => {
    const response = await axios.post("/combinations", CombinationRequest);
    return response.data;
  };

  return { createCombination };
};

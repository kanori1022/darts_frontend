
import { CombinationParms } from "@/types/combination";
import { useAxios } from "../axios/useAxios";

type CombinationRequest = {
  combination: CombinationParms;
};

export const useCreateCombination = () => {
  const axios = useAxios();

  const createCombination = async (CombinationRequest: CombinationRequest) => {
    const response = await axios.postForm("/combinations", CombinationRequest);
    return response.data;
  };

  return { createCombination };
};

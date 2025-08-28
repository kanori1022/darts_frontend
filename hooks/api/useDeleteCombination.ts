import useAuth from "@/hooks/auth/useAuth";
import { useState } from "react";

export const useDeleteCombination = () => {
  const { loginUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const deleteCombination = async (combinationId: string) => {
    if (!loginUser) {
      throw new Error("ログインが必要です");
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/combinations/${combinationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await loginUser.getIdToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "削除に失敗しました");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("削除エラー:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteCombination, isLoading };
};

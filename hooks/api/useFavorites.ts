import { useEffect, useState } from "react";
import useAuth from "../auth/useAuth";
import { useAxios } from "../axios/useAxios";

interface FavoritesResponse {
  favorite_combination_ids: string[];
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const axios = useAxios();
  const { loginUser, isWaiting } = useAuth();

  // お気に入りに追加（内部処理用）
  const addFavorite = async (combinationId: string) => {
    if (!loginUser) return false;

    console.log(
      "🔍 addFavorite が呼び出されました - combinationId:",
      combinationId
    );

    try {
      await axios.post("/favorites", {
        combination_id: combinationId,
      });
      console.log("✅ お気に入り追加成功");
      return true;
    } catch (error) {
      console.error("❌ Failed to add favorite:", error);
      return false;
    }
  };

  // お気に入りから削除（内部処理用）
  const removeFavorite = async (combinationId: string) => {
    if (!loginUser) return false;

    try {
      await axios.delete(`/favorites/${combinationId}`);
      return true;
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      return false;
    }
  };

  // お気に入りのトグル（楽観的更新）
  const toggleFavorite = async (
    combinationId: string,
    combinationUserId?: string | number,
    combinationFirebaseUid?: string
  ) => {
    if (!loginUser) return false;

    // 自分の投稿の場合はお気に入りに追加できない
    console.log("=== デバッグ情報 ===");
    console.log("combinationUserId:", combinationUserId);
    console.log("loginUser.uid:", loginUser.uid);
    console.log("combinationUserId の型:", typeof combinationUserId);
    console.log("loginUser.uid の型:", typeof loginUser.uid);
    console.log("文字列変換後 - combinationUserId:", String(combinationUserId));
    console.log("文字列変換後 - loginUser.uid:", String(loginUser.uid));
    console.log("厳密等価比較:", combinationUserId === loginUser.uid);
    console.log(
      "文字列比較:",
      String(combinationUserId) === String(loginUser.uid)
    );
    console.log(
      "比較結果:",
      String(combinationUserId) === String(loginUser.uid)
    );
    console.log("==================");

    // より詳細な比較情報を出力
    // firebase_uidが利用可能な場合はそれを使用、そうでなければ従来のuser_idを使用
    const isOwnPost = combinationFirebaseUid
      ? combinationFirebaseUid === loginUser.uid
      : combinationUserId &&
        String(combinationUserId) === String(loginUser.uid);

    console.log("最終判定結果:", isOwnPost);
    console.log("combinationFirebaseUid:", combinationFirebaseUid);
    console.log("firebase_uid比較:", combinationFirebaseUid === loginUser.uid);
    console.log(
      "従来のuser_id比較:",
      combinationUserId && String(combinationUserId) === String(loginUser.uid)
    );

    if (isOwnPost) {
      console.log("✅ 自分の投稿を検出！お気に入りに追加できません");
      return false;
    } else {
      console.log("❌ 自分の投稿ではありません。お気に入りに追加可能");
      console.log(
        "理由:",
        !combinationFirebaseUid && !combinationUserId
          ? "両方のIDが undefined/null"
          : "値が一致しない"
      );
    }

    const currentlyFavorite = favorites.includes(combinationId);

    // 楽観的更新：APIレスポンスを待たずにUIを即座に更新
    if (currentlyFavorite) {
      setFavorites((prev) => prev.filter((id) => id !== combinationId));
    } else {
      setFavorites((prev) => [...prev, combinationId]);
    }

    try {
      let result;
      if (currentlyFavorite) {
        result = await removeFavorite(combinationId);
      } else {
        result = await addFavorite(combinationId);
      }

      // APIが失敗した場合は元に戻す
      if (!result) {
        if (currentlyFavorite) {
          setFavorites((prev) => [...prev, combinationId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== combinationId));
        }
      }

      return result;
    } catch (error) {
      // エラーが発生した場合も元に戻す
      if (currentlyFavorite) {
        setFavorites((prev) => [...prev, combinationId]);
      } else {
        setFavorites((prev) => prev.filter((id) => id !== combinationId));
      }
      console.error("Failed to toggle favorite:", error);
      return false;
    }
  };

  // お気に入りかどうかを判定
  const isFavorite = (combinationId: string) => {
    return favorites.includes(combinationId);
  };

  // 手動でお気に入りを再取得
  const refetch = async () => {
    if (!loginUser) {
      setFavorites([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get<FavoritesResponse>("/favorites");
      setFavorites(response.data.favorite_combination_ids);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 認証状態が確定してからお気に入りを取得（1回のみ）
  useEffect(() => {
    if (hasInitialized || isWaiting) return;

    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<FavoritesResponse>("/favorites");
        setFavorites(response.data.favorite_combination_ids);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    if (loginUser) {
      fetchFavorites();
    } else {
      // ログインしていない場合は空の配列をセット
      setFavorites([]);
      setHasInitialized(true);
    }
  }, [isWaiting, loginUser, hasInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refetch,
  };
};

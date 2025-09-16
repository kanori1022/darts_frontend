import { UserParams } from "@/types/user";
import useAuth from "../auth/useAuth";
import { useAxios } from "../axios/useAxios";

type UserRequest = {
  user: UserParams;
  firebase_uid: string;
};

export const useCreateUser = () => {
  const axios = useAxios();
  const { loginUser } = useAuth();

  const createUser = async (request: UserRequest) => {
    // Firebase UIDを追加（新規登録時はrequest.firebase_uidを使用）
    const firebaseUid = request.firebase_uid;
    const requestData = {
      ...request,
      firebase_uid: firebaseUid,
    };

    console.log("=== API送信データ詳細 ===");
    console.log("request.firebase_uid:", request.firebase_uid);
    console.log("loginUser?.uid:", loginUser?.uid);
    console.log("最終的なfirebase_uid:", firebaseUid);
    console.log("firebase_uidの型:", typeof firebaseUid);
    console.log("firebase_uidが存在するか:", !!firebaseUid);
    console.log("送信するデータ全体:", requestData);
    console.log("=========================");

    // FormDataを作成（Railsのネストしたパラメータ形式）
    const formData = new FormData();
    formData.append("user[name]", request.user.name);
    formData.append("user[introduction]", request.user.introduction || "");
    if (request.user.image) {
      formData.append("user[image]", request.user.image);
    }

    // Firebase UIDが存在する場合のみ追加（userオブジェクト内に配置）
    if (firebaseUid) {
      formData.append("user[firebase_uid]", firebaseUid);
      console.log("FormDataにuser[firebase_uid]を追加:", firebaseUid);
    } else {
      console.error("Firebase UIDが存在しません！");
    }

    console.log("FormData内容:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // まずJSON形式で送信（より確実）
    try {
      // Railsのネストしたパラメータ形式に合わせる
      const jsonData = {
        user: {
          name: request.user.name,
          introduction: request.user.introduction || "",
          image: request.user.image,
          firebase_uid: firebaseUid, // userオブジェクト内にfirebase_uidを配置
        },
      };

      console.log("JSON送信データ:", jsonData);

      const response = await axios.post("/users", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
        // リクエストの詳細をログ出力
        transformRequest: [
          (data) => {
            console.log("実際に送信されるデータ:", data);
            return JSON.stringify(data);
          },
        ],
      });
      console.log("API応答 (JSON):", response.data);
      console.log("レスポンスステータス:", response.status);
      return response.data;
    } catch (error) {
      console.log("JSON送信失敗、FormData形式で再試行...");
      console.error("JSON送信エラー:", error);

      // JSONが失敗した場合、FormDataで再試行
      const response = await axios.post("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API応答 (FormData):", response.data);
      return response.data;
    }
  };

  return { createUser };
};

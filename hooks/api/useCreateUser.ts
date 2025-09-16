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

    console.log("=== API送信データ詳細 ===");
    console.log("request.firebase_uid:", request.firebase_uid);
    console.log("loginUser?.uid:", loginUser?.uid);
    console.log("最終的なfirebase_uid:", requestData.firebase_uid);
    console.log("送信するデータ全体:", requestData);
    console.log("=========================");

    // FormDataを作成
    const formData = new FormData();
    formData.append("user[name]", request.user.name);
    formData.append("user[introduction]", request.user.introduction || "");
    if (request.user.image) {
      formData.append("user[image]", request.user.image);
    }
    formData.append("firebase_uid", requestData.firebase_uid || "");

    console.log("FormData内容:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await axios.post("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("API応答:", response.data);
    return response.data;
  };

  return { createUser };
};

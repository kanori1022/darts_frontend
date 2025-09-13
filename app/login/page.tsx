"use client";

import { Button } from "@/components/Button/Button";
import { InputLong } from "@/components/Input/Input";
import useAuth from "@/hooks/auth/useAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ここから検索
// https://fontawesome.com/icons?t=packs#packs

// 横並びは
// flexを使います
// https://tailwindcss.com/docs/flex
type Login = {
  email: string;
  pass: string;
};
export default function Login() {
  const [login, setLogin] = useState<Login>({
    email: "",
    pass: "",
  });
  console.log(login);
  const { auth, loginUser: currentUser, handleSignOut } = useAuth();
  const router = useRouter();
  const loginUser = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        login.email,
        login.pass
      );
      alert("ログインしました");
      console.log("ログイン成功:", user.user);
      const token = await user.user.getIdToken();
      console.log("トークン:", token);
      // await router.push('/home');
      router.push("/home");
    } catch (error) {
      alert("ログインに失敗しました");
      console.error("ログインエラー:", error);
      // await router.push('/login');
    }
  };

  const handleLogout = () => {
    handleSignOut();
    router.push("/login");
  };

  // すでにログイン済みの場合の表示
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            すでにログインしています。
          </h1>
          <p className="mb-6 text-gray-600">
            ログアウトしますか？Homeに画面に戻りますか？
          </p>
          <div className="space-y-4">
            <Button
              color="bg-blue-400 hover:bg-blue-500"
              onClick={() => router.push("/home")}
            >
              Homeに戻る
            </Button>
            <Button color="bg-red-400 hover:bg-red-500" onClick={handleLogout}>
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="">
        <p className="py-10 text-3xl font-bold font-Noto Sans text-center">
          ログイン
        </p>
        <div className="pl-10 pr-10 pt-10 pb-10 bg-white">
          <div>
            <InputLong
              placeholder="メールアドレス"
              onChange={(e) => {
                setLogin({ ...login, email: e.target.value });
              }}
            >
              メールアドレス
            </InputLong>

            <InputLong
              placeholder="パスワード"
              onChange={(e) => {
                setLogin({ ...login, pass: e.target.value });
              }}
            >
              パスワード
            </InputLong>
          </div>
          <Button
            color="bg-[#3B82F6]"
            onClick={() => {
              loginUser();
            }}
          >
            ログイン
          </Button>

          {/* <div className="text-center pt-6">※新規登録の方はコチラから</div> */}
          <Button
            color="bg-[#393939]"
            onClick={() => router.push("/newprofile")}
          >
            ※新規登録の方はコチラから
          </Button>
        </div>
        <div className="bg-neutral-100"></div>
      </div>
      <div></div>
    </div>
  );
}

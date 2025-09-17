"use client";

import { Button } from "@/components/Button/Button";
import { InputLong } from "@/components/Input/Input";
import useAuth from "@/hooks/auth/useAuth";
import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
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
  const [showPassword, setShowPassword] = useState(false);
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

  const handleGuestLogin = async () => {
    try {
      const result = await signInAnonymously(auth);
      console.log("ゲストログイン成功:", result);
      alert("ゲストユーザーとしてログインしました");
      router.push("/home");
    } catch (error) {
      console.error("ゲストログインエラー:", error);
      alert(
        "ゲストログインに失敗しました。しばらくしてから再度お試しください。"
      );
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
              type={showPassword ? "text" : "password"}
              placeholder="パスワード"
              onChange={(e) => {
                setLogin({ ...login, pass: e.target.value });
              }}
            >
              パスワード
            </InputLong>

            {/* パスワード表示切り替えチェックボックス */}
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="showPassword"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                パスワードを表示する
              </label>
            </div>
          </div>
          <div className="space-y-6">
            <Button
              color="bg-[#3B82F6]"
              onClick={() => {
                loginUser();
              }}
            >
              ログイン
            </Button>

            {/* 区切り線 */}
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500 bg-white">
                または
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGuestLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer border border-slate-500 hover:border-slate-400 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-lg">🎯</span>
                <span>ゲストユーザーでログイン</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </button>

            {/* <div className="text-center pt-6">※新規登録の方はコチラから</div> */}
            <Button
              color="bg-[#393939]"
              onClick={() => router.push("/newprofile")}
            >
              ※新規登録の方はコチラから
            </Button>
          </div>
        </div>
        <div className="bg-neutral-100"></div>
      </div>
      <div></div>
    </div>
  );
}

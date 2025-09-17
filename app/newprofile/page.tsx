"use client";

import { Button } from "@/components/Button/Button";
import { InputLong } from "@/components/Input/Input";
import { useCreateUser } from "@/hooks/api/useCreateUser";
import { FirebaseError, getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

// Firebase 初期化
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Newprofile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { createUser } = useCreateUser();
  const router = useRouter();

  const handleRegister = useCallback(async () => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    // バリデーション
    if (!email || !password || !name) {
      setError("すべての項目を入力してください。");
      setIsLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません。");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください。");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Firebase認証でユーザーを作成
      console.log("Firebase認証開始...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      console.log("Firebase認証成功:", firebaseUser.uid);

      // 2. API側にユーザー情報を登録
      console.log("API側登録開始...");
      console.log("送信するFirebase UID:", firebaseUser.uid);
      console.log("送信するユーザー名:", name);

      await createUser({
        user: {
          name: name,
          image: null,
          introduction: "",
        },
        firebase_uid: firebaseUser.uid,
      });
      console.log("API側登録成功");

      setSuccess(true);

      // 登録成功後、ホームページにリダイレクト
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (err: unknown) {
      console.error("登録エラー:", err);

      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("このメールアドレスは既に使用されています。");
            break;
          case "auth/invalid-email":
            setError("有効なメールアドレスを入力してください。");
            break;
          case "auth/weak-password":
            setError("パスワードが弱すぎます。");
            break;
          default:
            setError(`Firebase認証エラー: ${err.message}`);
        }
      } else {
        // API側のエラーの可能性
        const errorMessage =
          err instanceof Error
            ? err.message
            : "予期しないエラーが発生しました。";
        setError(`API登録エラー: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, passwordConfirm, name, createUser, router]);

  const handleGuestLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        "gest@1.com",
        "33443344"
      );
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

  return (
    <div>
      <div>
        <p className="py-10 text-3xl font-bold font-Noto Sans text-center">
          新規登録画面
        </p>
        <div className="pl-10 pr-10 pt-10 pb-10 bg-white space-y-6">
          <div>
            <InputLong
              placeholder="名前"
              onChange={(e) => setName(e.target.value)}
              value={name}
            >
              名前
            </InputLong>

            <InputLong
              placeholder="メールアドレス"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            >
              メールアドレス
            </InputLong>

            <InputLong
              placeholder="パスワード"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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

            <InputLong
              placeholder="パスワード（確認）"
              type={showPasswordConfirm ? "text" : "password"}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              value={passwordConfirm}
            >
              パスワード（確認）
            </InputLong>

            {/* パスワード確認表示切り替えチェックボックス */}
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showPasswordConfirm"
                checked={showPasswordConfirm}
                onChange={(e) => setShowPasswordConfirm(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="showPasswordConfirm"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                パスワード（確認）を表示する
              </label>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && (
            <div className="text-green-500">
              <p>登録に成功しました！</p>
              <p className="text-sm">ホームページに移動します...</p>
            </div>
          )}

          <div className="space-y-4">
            <Button color="bg-[#3B82F6]" onClick={handleRegister}>
              {isLoading ? "登録中..." : "登録"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <button
              onClick={handleGuestLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer border border-slate-500 hover:border-slate-400 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span>ゲストユーザーでログイン</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </button>

            <Button color="bg-[#393939]" onClick={() => router.back()}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

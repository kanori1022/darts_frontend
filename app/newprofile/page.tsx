"use client";

import { Button } from "@/components/Button/Button";
import { InputLong } from "@/components/Input/Input";
import { useCreateUser } from "@/hooks/api/useCreateUser";
import { FirebaseError, getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
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
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            >
              パスワード
            </InputLong>

            <InputLong
              placeholder="パスワード（確認）"
              type="password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              value={passwordConfirm}
            >
              パスワード（確認）
            </InputLong>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && (
            <div className="text-green-500">
              <p>登録に成功しました！</p>
              <p className="text-sm">ホームページに移動します...</p>
            </div>
          )}

          <div className="space-y-3">
            <Button color="bg-[#3B82F6]" onClick={handleRegister}>
              {isLoading ? "登録中..." : "登録"}
            </Button>

            <Button color="bg-[#393939]" onClick={() => router.back()}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

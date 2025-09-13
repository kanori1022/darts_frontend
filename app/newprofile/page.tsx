"use client";

import { Button } from "@/components/Button/Button";
import { InputLong } from "@/components/Input/Input";
import { FirebaseError, getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setSuccess(false);

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("予期しないエラーが発生しました。");
      }
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
              placeholder="メールアドレス"
              onChange={(e) => setEmail(e.target.value)}
            >
              メールアドレス
            </InputLong>

            <InputLong
              placeholder="パスワード"
              onChange={(e) => setPassword(e.target.value)}
            >
              パスワード
            </InputLong>

            <InputLong
              placeholder="パスワード（確認）"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            >
              パスワード（確認）
            </InputLong>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">登録に成功しました！</p>}

          <Button color="bg-[#3B82F6]" onClick={handleRegister}>
            登録
          </Button>
          <Button color="bg-[#393939]">キャンセル</Button>
        </div>
      </div>
    </div>
  );
}

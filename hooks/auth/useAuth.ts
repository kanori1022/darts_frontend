"use client";

import { FirebaseError, getApps, initializeApp } from "firebase/app"; // Firebaseアプリの初期化を行うためのinitializeApp関数を'firebase/app'からインポート
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth"; // Firebase Authenticationを使用するためのgetAuth関数を'firebase/auth'からインポート
import { useEffect, useMemo, useState } from "react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const useAuth = () => {
  // authインスタンスをメモ化して毎回同じインスタンスを使用
  const auth = useMemo(() => getAuth(), []);

  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState<boolean>(true); // 初期値をtrueに変更

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error("Sign out error:", e.message);
      }
    }
  };

  // 認証状態の監視とトークン取得を1つのuseEffectで統合
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoginUser(user);

      // ユーザーがログインしている場合のみトークンを取得
      if (user) {
        try {
          const idToken = await user.getIdToken(false);
          setToken(idToken);
        } catch (error) {
          console.error("Failed to get ID token:", error);
          setToken(null);
        }
      } else {
        setToken(null);
      }

      setIsWaiting(false);
    });

    // クリーンアップ関数でリスナーを解除
    return () => unsubscribe();
  }, [auth]);

  return { auth, loginUser, token, isWaiting, handleSignOut };
};

export default useAuth;

// https://zenn.dev/hisho/books/617d8f9d6bd78b/viewer/chapter8#firebase-authentication%E3%81%A8%E3%82%B5%E3%82%A4%E3%83%B3%E3%82%A2%E3%82%A6%E3%83%88%E3%82%92%E7%B4%90%E4%BB%98%E3%81%91%E3%82%88%E3%81%86

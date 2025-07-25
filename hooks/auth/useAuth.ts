"use client";

import { FirebaseError, getApps, initializeApp } from "firebase/app"; // Firebaseアプリの初期化を行うためのinitializeApp関数を'firebase/app'からインポート
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth"; // Firebase Authenticationを使用するためのgetAuth関数を'firebase/auth'からインポート
import { useEffect, useState } from "react";

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
  const app = initializeApp(firebaseConfig); // Firebaseアプリの初期化
  const auth = getAuth(app); // Firebase Authenticationの認証オブジェクトを取得

  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // トークンを保持するための変数を定義し、初期値をnullに設定
  const [isWaiting, setIsWaiting] = useState<boolean>(false); // ログイン状態の変化を監視するための変数を定義し、初期値をtrueに設定

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error("Sign out error:", e.message);
      }
    }
  };

  // ※ログインのセットより初期描画の方が早いため、
  // これをしないと、初期描画時にログイン状態がセットされず、
  // 初期描画時にログインが必要なページを表示できない。
  useEffect(() => {
    setIsWaiting(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginUser(user);
      }
      setIsWaiting(false);
    });
  }, [auth]);

  useEffect(() => {
    if (loginUser) {
      loginUser.getIdToken(true).then((idToken) => {
        setToken(idToken);
      });
    }
  }, [loginUser]);

  return { auth, loginUser, token, isWaiting, handleSignOut };
};

export default useAuth;

// https://zenn.dev/hisho/books/617d8f9d6bd78b/viewer/chapter8#firebase-authentication%E3%81%A8%E3%82%B5%E3%82%A4%E3%83%B3%E3%82%A2%E3%82%A6%E3%83%88%E3%82%92%E7%B4%90%E4%BB%98%E3%81%91%E3%82%88%E3%81%86

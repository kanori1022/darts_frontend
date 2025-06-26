"use client";
// import axios from 'axios';

import { FirebaseError, getApps, initializeApp } from 'firebase/app'; // Firebaseアプリの初期化を行うためのinitializeApp関数を'firebase/app'からインポート
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth'; // Firebase Authenticationを使用するためのgetAuth関数を'firebase/auth'からインポート
import { useEffect, useState } from 'react';
import { useAxios } from '../axios/useAxios';

const firebaseConfig = {
  // Firebaseアプリの設定情報を変数に代入
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
  // useAuthという名前の関数を定義する
  const app = initializeApp(firebaseConfig); // Firebaseアプリの初期化
  const auth = getAuth(app); // Firebase Authenticationの認証オブジェクトを取得
  const axios = useAxios(); // axiosのインスタンスを取得
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // トークンを保持するための変数を定義し、初期値をnullに設定
  const [isWaiting, setIsWaiting] = useState<boolean>(false); // ログイン状態の変化を監視するための変数を定義し、初期値をtrueに設定
  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    }
  }

  // ログイン状態の変化を監視する（初期描画のタイミングで、ログイン状態をセットする）

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
      console.log('loginUser', loginUser);
      loginUser.getIdToken(true).then((idToken) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        setToken(idToken);
      });
    }
  }, [loginUser, axios]);
  return { auth, loginUser, token, isWaiting, handleSignOut }; // 認証オブジェクトを返す
};

export default useAuth;

// https://zenn.dev/hisho/books/617d8f9d6bd78b/viewer/chapter8#firebase-authentication%E3%81%A8%E3%82%B5%E3%82%A4%E3%83%B3%E3%82%A2%E3%82%A6%E3%83%88%E3%82%92%E7%B4%90%E4%BB%98%E3%81%91%E3%82%88%E3%81%86
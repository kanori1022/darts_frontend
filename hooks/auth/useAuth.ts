"use client";

import {
  FirebaseError,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useAxios } from "../axios/useAxios";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ✅ Firebase アプリを安全に初期化（重複防止）
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const useAuth = () => {
  const axios = useAxios();
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error("Sign out error:", e.message);
      }
    }
  };

  useEffect(() => {
    setIsWaiting(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoginUser(user);
      setIsWaiting(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loginUser) {
      loginUser.getIdToken(true).then((idToken) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
        setToken(idToken);
      });
    }
  }, [loginUser, axios]);

  return { auth, loginUser, token, isWaiting, handleSignOut };
};

export default useAuth;


// https://zenn.dev/hisho/books/617d8f9d6bd78b/viewer/chapter8#firebase-authentication%E3%81%A8%E3%82%B5%E3%82%A4%E3%83%B3%E3%82%A2%E3%82%A6%E3%83%88%E3%82%92%E7%B4%90%E4%BB%98%E3%81%91%E3%82%88%E3%81%86
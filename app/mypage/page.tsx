"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Mypage() {
  const { loginUser } = useAuth();
  const [bio, setBio] = useState("");
  useEffect(() => {
    if (loginUser) {
      const savedBio = localStorage.getItem(`bio_${loginUser.uid}`);
      if (savedBio) {
        setBio(savedBio);
      }
    }
  }, [loginUser]);

  if (!loginUser) {
    return (
      <div className="pl-10 pr-10 pt-10 pb-10 bg-white mb-10 text-center">
        <p className="mb-3">
          その他の機能を利用するには新規登録をしてください。
        </p>
        <Link href="/login">
          <Button color="bg-[#3B82F6]">新規登録はコチラ</Button>
        </Link>
        <div className="pt-3">
          ※登録済みの方はメニューよりログインをしてください。
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">マイページ</h1>

      {/* プロフィール画像 */}
      <div className="flex justify-center mb-4">
        {loginUser.photoURL ? (
          <img
            src={loginUser.photoURL}
            alt="プロフィール画像"
            className="w-24 h-24 rounded-full object-cover shadow"
          />
        ) : (
          <FontAwesomeIcon
            icon={faCircleUser}
            size="4x"
            className="text-gray-400 w-24 h-24"
          />
        )}
      </div>

      <div className="text-left space-y-4">
        <p>
          <span className="font-semibold">ユーザー名：</span>
          {loginUser.displayName ?? "未設定"}
        </p>
        {bio && (
          <p>
            <span className="font-semibold">自己紹介：</span>
            {bio}
          </p>
        )}
      </div>

      <Link href="/profile">
        <Button color="bg-[#3B82F6]">プロフィール編集</Button>
      </Link>
    </div>
  );
}

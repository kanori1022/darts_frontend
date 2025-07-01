"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import Link from "next/link";

export default function Mypage() {
  const { loginUser } = useAuth();

  if (!loginUser) {
    // ログイン前の表示
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

      <div className="text-left space-y-4">
        <p>
          <span className="font-semibold">ユーザー名：</span>
          {loginUser.displayName ?? "未設定"}
        </p>
        {/* <p> */}
        {/* <span className="font-semibold">メールアドレス：</span>
          {loginUser.email}
        </p> */}

        {/* 追加したいプロフィール情報があればここに追加 */}
      </div>

      <Link href="/profile">
        <Button color="bg-[#3B82F6]">プロフィール編集</Button>
      </Link>
    </div>
  );
}

"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { User } from "@/types/user";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Mypage() {
  const { loginUser } = useAuth();
  const { data, isLoading } = useFetch<User>(loginUser ? "/users" : null);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 font-medium">読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">マイページ</h1>

      {/* プロフィール画像 */}
      <div className="flex justify-center mb-4">
        {data ? (
          <img
            src={data.image}
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

          {data?.name ?? "未設定"}
        </p>
      </div>

      <div className="flex flex-col space-y-3">
        <Link href="/profile">
          <Button color="bg-[#3B82F6]">プロフィール編集</Button>
        </Link>

        <Link href="/myposts">
          <Button color="bg-green-600 hover:bg-green-700">投稿一覧</Button>
        </Link>
      </div>
    </div>
  );
}

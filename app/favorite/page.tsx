"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import Link from "next/link";

export default function Favorite() {
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
    <div>
      <div className="p-3 font-bold bg-white"></div>

      {/* <div className="flame p-3  bg-white"> */}
      <div className="pt-5 pl-10 pr-10 text-center rounded-sm w-full bg-white placeholder-[#000000]">
        その他の機能を利用するには新規登録をしてください。
        {/* <div> */}
        <Link href="/login">
          <Button color="bg-[#3B82F6]">新規登録はコチラ</Button>
        </Link>
        {/* </div> */}
        <div className="text-center pt-3 pb-3">
          ※登録済みの方はメニューよりログインをしてください。
        </div>
      </div>
    </div>
  );
}

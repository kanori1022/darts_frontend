"use client";

import { Button } from "@/components/Button/Button";
import { InputLong } from "@/components/Input/Input";
import { useState } from "react";
// ここから検索
// https://fontawesome.com/icons?t=packs#packs

// 横並びは
// flexを使います
// https://tailwindcss.com/docs/flex
type Login = {
  email: string;
  pass: string;
};
export default function Login() {
  const [login, setLogin] = useState<Login>({
    email: "",
    pass: "",
  });
  console.log(login);
  return (
    <div>
      <div className="">
        <p className="py-10 text-3xl font-bold font-Noto Sans text-center">
          ログイン
        </p>
        <div className="pl-10 pr-10 pt-10 pb-10 bg-white">
          <div>
            <InputLong
              placeholder="メールアドレス"
              onChange={(e) => {
                setLogin({ ...login, email: e.target.value });
              }}
            >
              メールアドレス
            </InputLong>

            <InputLong
              placeholder="パスワード"
              onChange={(e) => {
                setLogin({ ...login, pass: e.target.value });
              }}
            >
              パスワード
            </InputLong>
          </div>
          <Button color="bg-[#3B82F6]">ログイン</Button>
        </div>
        <div className="bg-neutral-100"></div>
      </div>
      <div></div>
    </div>
  );
}


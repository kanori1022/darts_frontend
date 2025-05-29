import { Button } from "@/components/Button/page";
import { InputLong } from "@/components/Input/page";
// ここから検索
// https://fontawesome.com/icons?t=packs#packs

// 横並びは
// flexを使います
// https://tailwindcss.com/docs/flex

export default function Login() {
  return (
    <div>
      <div className="">
        <p className="py-10 text-3xl font-bold font-Noto Sans text-center">
          ログイン
        </p>
        <div className="pl-10 pr-10 pt-10 pb-10 bg-white">
          <div>
            <InputLong placeholder="メールアドレス">メールアドレス</InputLong>

            {/* https://v1.tailwindcss.com/docs/placeholder-color */}
            <InputLong placeholder="パスワード">パスワード</InputLong>
          </div>
          <Button color="bg-[#3B82F6]">ログイン</Button>
        </div>
        <div className="bg-neutral-100"></div>
      </div>
      <div></div>
    </div>
  );
}

// https://nextjs-ja-translation-docs.vercel.app/docs/api-reference/next/link

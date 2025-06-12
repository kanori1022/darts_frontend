import { Button } from "@/components/Button/Button";
import { Card } from "@/components/card/card";
import Link from "next/link";

export default function home() {
  const array = [
    { src: "sampl1.png", title: "サンプル1" },
    { src: "sampl2.jpg", title: "サンプル2" },
    { src: "sampl3.jpg", title: "サンプル3" },
    { src: "sampl4.jpg", title: "サンプル4" },
    { src: "sampl5.jpg", title: "サンプル5" },
  ];

  const arr = [
    { src: "sampl6.jpeg", title: "サンプル6" },
    { src: "sampl7.jpeg", title: "サンプル7" },
    { src: "sampl8.jpg", title: "サンプル8" },
    { src: "sampl9.jpg", title: "サンプル9" },
    { src: "sampl10.jpg", title: "サンプル10" },
  ];

  return (
    <div>
      <div className="p-3 font-bold bg-white">人気ランキング</div>
      <div className="flex overflow-scroll gap-3 pt-3 mx-3">
        {array.map((image, index) => (
          <Card src={image.src} title={image.title} key={index} />
        ))}
      </div>
      <div className="pb-3">
        <div className="p-3 mt-3 font-bold  bg-white">新着一覧</div>
        <div className="flex overflow-scroll gap-3 pt-3 mx-3">
          {arr.map((image, index) => (
            <Card src={image.src} title={image.title} key={index} />
          ))}
        </div>
      </div>
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

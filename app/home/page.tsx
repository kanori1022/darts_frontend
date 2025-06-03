import { Button } from "@/components/Button/Button";

export default function home() {
  return (
    <div>
      <div className="pb-3">
        <div className="p-3 font-bold bg-white">人気ランキング</div>
        <div className="flex overflow-scroll gap-3 pt-3">
          <img
            className="w-50 h-30 shadow-sm border rounded-lg"
            src="sampl1.png"
          />
          <img
            className="w-50 h-30 shadow-sm border rounded-lg"
            src="sampl2.jpg"
          />
          <img
            className="w-50 h-30 shadow-sm border rounded-lg"
            src="sampl3.jpg"
          />
          <img
            className="w-50 h-30 shadow-sm border rounded-lg"
            src="sampl4.jpg"
          />
          <img
            className="w-50 h-30 shadow-sm border rounded-lg"
            src="sampl5.jpg"
          />
        </div>
        <div className="pb-3">
          <div className="p-3 mt-3 font-bold  bg-white">新着一覧</div>
          <div className="flex overflow-scroll gap-3 pt-3">
            <img
              className="w-50 h-30 shadow-sm border rounded-lg"
              src="sampl6.jpeg"
            />
            <img
              className="w-50 h-30 shadow-sm border rounded-lg"
              src="sampl7.jpeg"
            />
            <img
              className="w-50 h-30 shadow-sm border rounded-lg"
              src="sampl8.jpg"
            />
            <img
              className="w-50 h-30 shadow-sm border rounded-lg"
              src="sampl9.jpg"
            />
            <img
              className="w-50 h-30 shadow-sm border rounded-lg"
              src="sampl10.jpg"
            />
          </div>
        </div>
        {/* <div className="flame p-3  bg-white"> */}
        <div className="pt-5 pl-10 pr-10 text-center rounded-sm w-full bg-white placeholder-[#000000]">
          その他の機能を利用するには新規登録をしてください。
          {/* <div> */}
          <Button color="bg-[#3B82F6]">新規登録はコチラ</Button>
          {/* </div> */}
          <div className="text-center pt-3 pb-3">
            ※登録済みの方はメニューよりログインをしてください
          </div>
        </div>
      </div>
    </div>
  );
}

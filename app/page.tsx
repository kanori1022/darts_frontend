export default function Home() {
  return (
    <div>
      <div className="h-screen">
        <p className="text-3xl font-serif bg-[#333333] text-[#CCCCCC] p-2 text-center">
          SakoDax Darts
        </p>
        <p className="my-10 text-3xl font-bold font-Noto Sans text-center">
          ログイン
        </p>
        <div className="pl-10 pr-10 pt-10 pb-10 bg-white">
          <div>
            <p className="text-left">メールアドレス</p>
            <input
              className="border-2 rounded-sm w-full placeholder-[#A39C9C] border-[#E0E0E0]"
              type="text"
              placeholder="メールアドレス"
            ></input>
            {/* https://v1.tailwindcss.com/docs/placeholder-color */}
            <p className="mt-10 text-left">パスワード</p>
            <input
              className="border-2 rounded-sm w-full placeholder-[#A39C9C] border-[#E0E0E0]"
              type="text"
              placeholder="パスワード"
            ></input>
          </div>
          <button className="bg-[#3B82F6] mt-10 py-4 w-full whitespace-nowrap rounded-sm text-[#FFFFFF]">
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
}

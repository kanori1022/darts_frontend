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
      </div>
      {/* 横スクロールをできる処理を追加 */}

      <div className="pb-3">
        <div className="p-3 font-bold  bg-white">新着一覧</div>
      </div>
      <div className="bg-neutral-100"></div>
    </div>
  );
}

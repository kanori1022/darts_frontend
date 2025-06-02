import { Button } from "@/components/Button/Button";
import { InputLong, InputShort } from "@/components/Input/Input";

export default function post() {
  return (
    <div>
      <div>
        <div className="pl-10 pr-10 pt-10 pb-10 bg-white mb-70">
          <div>
            <InputLong placeholder="タイトル">タイトル</InputLong>
          </div>
        </div>
        {/* ここにファイルインポートの処理 */}

        <div className="pl-10 pr-10 pt-10 pb-10 bg-white">
          <div>
            <InputShort placeholder="フライト">フライト</InputShort>
            <InputShort placeholder="シャフト">シャフト</InputShort>
            <InputShort placeholder="バレル">バレル</InputShort>
            <InputShort placeholder="チップ">チップ</InputShort>
          </div>

          <p className="text-left pt-10">説明</p>
          <textarea
            className="border-2 rounded-sm w-full pb-70 placeholder-[#A39C9C] border-[#E0E0E0]"
            placeholder="例：バレルの重心を感じやすく、初心者におすすめな組み合わせになっている。"
          ></textarea>
          <InputLong placeholder="タグ">タグ</InputLong>
          <Button color="bg-[#3B82F6]">投稿</Button>
          <Button color="bg-[#BEBEBE]">キャンセル</Button>
        </div>
        <div className="bg-neutral-100"></div>
      </div>
    </div>
  );
}

import {
  faBars,
  faHeart,
  faHouse,
  faMagnifyingGlass,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ここから検索
// https://fontawesome.com/icons?t=packs#packs

// 横並びは
// flexを使います
// https://tailwindcss.com/docs/flex

export default function Home() {
  return (
    <div>
      <div className="h-screen">
        <p className="bg-[#333333] p-5 flex justify-between">
          <div className="text-3xl font-serif text-[#CCCCCC] pl-20">
            Combine Darts
          </div>
          <div className="h-8 w-8 text-[#CCCCCC]">
            <FontAwesomeIcon icon={faBars} />
          </div>
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
        <div className="bg-neutral-100">
          <div className="py-43"></div>
          <div className="bg-[#333333] px-8 py-6 ">
            <div className="text-[#828282] flex gap-10 bg-[#333333]">
              <FontAwesomeIcon icon={faHouse} />
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <FontAwesomeIcon icon={faPlus} />
              <FontAwesomeIcon icon={faHeart} />
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

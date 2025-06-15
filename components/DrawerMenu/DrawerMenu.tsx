import Link from "next/link";

type DrawerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // 表示されていないときは何も描画しない

  return (
    // https://tailwindcss.com/docs/z-index 奥行き
    // https://tailwindcss.com/docs/opacity 透明度
    <div className="absolute top-0 right-0 w-1/2 h-screen bg-[#333333] opacity-95 z-50">
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-[#FFFFFF] p-4 text-right w-1/2"
      ></button>

      {/* メニューアイテム */}
      <div className="text-[#CCCCCC] text-xl pt-20 p-4">
        <Link href="/login">
          <p className="mb-5">ログイン</p>
        </Link>
        <Link href="">
          <p className="mb-5">設定</p>
        </Link>
        <Link href="">
          <p className="mb-5">お問い合わせ</p>
        </Link>
      </div>
    </div>
  );
};

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type DrawerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
};

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  onLogout,
  isLoggedIn,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleGuestLogin = async () => {
    try {
      const { getAuth, signInWithEmailAndPassword } = await import(
        "firebase/auth"
      );
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(
        auth,
        "gest@1.com",
        "33443344"
      );
      console.log("ゲストログイン成功:", result);
      alert("ゲストユーザーとしてログインしました");
      onClose();
      router.push("/home");
    } catch (error) {
      console.error("ゲストログインエラー:", error);
      alert(
        "ゲストログインに失敗しました。しばらくしてから再度お試しください。"
      );
    }
  };

  // メニュー外をクリックしたときに閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // メニューボタンまたはその子要素がクリックされた場合は何もしない
      if (target.closest('[data-menu-button="true"]')) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null; // 表示されていないときは何も描画しない

  return (
    // https://tailwindcss.com/docs/z-index 奥行き
    // https://tailwindcss.com/docs/opacity 透明度
    <div
      ref={menuRef}
      className="absolute top-0 right-0 w-1/2 h-screen bg-[#333333] opacity-95 z-50"
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-[#FFFFFF] p-4 text-right w-1/2"
      ></button>

      {/* メニューアイテム */}
      <div className="text-[#CCCCCC] text-xl pt-20 p-4">
        {/* ログインしていない場合のみ表示 */}
        {!isLoggedIn && (
          <>
            <Link href="/login">
              <p className="mb-5">ログイン</p>
            </Link>
            <button
              onClick={handleGuestLogin}
              className="mb-5 text-left w-full hover:bg-gray-700 p-2 rounded"
              type="button"
            >
              ゲストログイン
            </button>
          </>
        )}

        {/* ログインしている場合のみ表示 */}
        {isLoggedIn && (
          <Link href="/mypage">
            <p className="mb-5">設定</p>
          </Link>
        )}

        {/* 常に表示 */}
        <Link href="">
          <p className="mb-5">お問い合わせ</p>
        </Link>

        {/* ログインしている場合のみ表示（最下部） */}
        {isLoggedIn && (
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="mb-5 text-left w-full text-red-500 hover:bg-gray-700 p-2 rounded"
            type="button"
          >
            ログアウト
          </button>
        )}
      </div>
    </div>
  );
};

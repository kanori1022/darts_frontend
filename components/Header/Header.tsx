"use client";

import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import useAuth from "@/hooks/auth/useAuth";
import { DrawerMenu } from "../DrawerMenu/DrawerMenu";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { handleSignOut, loginUser } = useAuth();
  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    handleSignOut();
    router.push("/login");
  };

  const handleGoBack = () => {
    // ホームページの場合は何もしない
    if (pathname === "/home") {
      return;
    }

    // URLパラメータを確認
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get("from");
    const page = urlParams.get("page");

    // 閲覧履歴ページから来た場合
    if (from === "history") {
      const historyUrl = page ? `/history?page=${page}` : "/history";
      router.push(historyUrl);
      return;
    }

    // 新着一覧ページから来た場合
    if (from === "newest") {
      const newestUrl = page ? `/newest?page=${page}` : "/newest";
      router.push(newestUrl);
      return;
    }

    // 人気ランキングページから来た場合
    if (from === "popular") {
      const popularUrl = page ? `/popular?page=${page}` : "/popular";
      router.push(popularUrl);
      return;
    }

    // 検索結果ページから来た場合
    if (from === "search") {
      router.push("/search/result");
      return;
    }

    // リファラーを確認して適切なページに戻る（フォールバック）
    const referrer = document.referrer;

    if (referrer.includes("/history")) {
      router.push("/history");
      return;
    }

    if (referrer.includes("/newest")) {
      router.push("/newest");
      return;
    }

    if (referrer.includes("/popular")) {
      router.push("/popular");
      return;
    }

    if (referrer.includes("/search/result")) {
      router.push("/search/result");
      return;
    }

    // その他の場合はブラウザの履歴に従う
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/home");
    }
  };

  return (
    <>
      <DrawerMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLogout={handleLogout}
        isLoggedIn={!!loginUser}
      />

      <div className="bg-[#333333] p-5 flex justify-between items-center relative z-50">
        {/* 戻るボタン */}
        <button
          type="button"
          className={`h-8 w-8 transition-colors duration-200 ${
            pathname === "/home"
              ? "text-gray-500 cursor-not-allowed"
              : "text-[#CCCCCC] hover:text-white cursor-pointer"
          }`}
          onClick={handleGoBack}
          disabled={pathname === "/home"}
          aria-label="前のページに戻る"
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size="lg"
            className={
              pathname === "/home" ? "cursor-not-allowed" : "cursor-pointer"
            }
          />
        </button>

        {/* タイトル */}
        <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#CCCCCC] absolute left-1/2 transform -translate-x-1/2 cursor-pointer whitespace-nowrap">
          <Link
            href="/home"
            className="hover:text-white transition-colors duration-200"
          >
            Combines Darts
          </Link>
        </p>

        {/* メニューボタン */}
        <button
          type="button"
          className="h-8 w-8 z-50 text-[#CCCCCC] hover:text-white transition-colors duration-200"
          onClick={toggleDrawer}
          aria-label="メニューを開く"
          data-menu-button="true"
        >
          <FontAwesomeIcon icon={faBars} size="lg" className="cursor-pointer" />
        </button>
      </div>
    </>
  );
};

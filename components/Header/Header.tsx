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

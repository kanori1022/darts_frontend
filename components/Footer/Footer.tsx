"use client";

import {
  faHeart,
  faHouse,
  faMagnifyingGlass,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname(); // 現在のURLパスを取得

  // ${pathname === '/home' ? 'text-orange-400' : 'text-black'}
  // + (pathname === '/home' ? ' text-orange-400' : ' text-black')

  // 1. これと
  // pathname === "/home" ? '水色' : 'グレー'

  // 2. これが同じ
  // if (pathname === "/home") {
  //   return "水色";
  // } else {
  //   return "グレー";
  // }

  return (
    <div>
      <div className="bg-[#333333] text-[#828282] flex justify-between px-10 pt-5 pb-5">
        <Link href="/home">
          {/* <p>Home</p> */}
          <FontAwesomeIcon
            icon={faHouse}
            size="2x"
            className={
              "hover:text-[#6DDDFF] cursor-pointer pt-2 " +
              (pathname === "/home" ? "text-[#6DDDFF]" : "text-[#828282]")
            }
          />
        </Link>
        <Link href="/search">
          {/* <p>Search</p> */}
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="2x"
            className={
              "hover:text-[#6DDDFF] cursor-pointer pt-2 " +
              (pathname === "/search" ? "text-[#6DDDFF]" : "text-[#828282]")
            }
          />
        </Link>
        <Link href="/post">
          {/* <p>Post</p> */}
          <FontAwesomeIcon
            icon={faPlus}
            size="3x"
            className={
              "hover:text-[#6DDDFF] text-center cursor-pointer " +
              (pathname === "/post" ? "text-[#6DDDFF]" : "text-[#828282]")
            }
          />
        </Link>
        <Link href="/favorite">
          {/* <p>favorite</p> */}
          <FontAwesomeIcon
            icon={faHeart}
            size="2x"
            className={
              "hover:text-[#6DDDFF] cursor-pointer pt-2 " +
              (pathname === "/favorite" ? "text-[#6DDDFF]" : "text-[#828282]")
            }
          />
        </Link>
        <Link href="/mypage">
          {/* <p>profile</p> */}
          <FontAwesomeIcon
            icon={faUser}
            size="2x"
            className={
              "hover:text-[#6DDDFF] cursor-pointer pt-2 " +
              (pathname === "/mypage" ? "text-[#6DDDFF]" : "text-[#828282]")
            }
          />
        </Link>
      </div>
    </div>
  );
};

import {
  faHeart,
  faHouse,
  faMagnifyingGlass,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="bg-[#333333] px-8 p-5 ">
      <div className="text-[#828282] flex justify-between bg-[#333333]">
        <Link href="/">
          {/* <p>Home</p> */}
          <FontAwesomeIcon
            icon={faHouse}
            className="hover:text-[#6DDDFF] cursor-pointer h-14 w-14"
          />
        </Link>
        <Link href="/">
          {/* <p>Search</p> */}
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="hover:text-[#6DDDFF] cursor-pointer h-14 w-14"
          />
        </Link>
        <Link href="/post">
          {/* <p>Post</p> */}
          <FontAwesomeIcon
            icon={faPlus}
            className="hover:text-[#6DDDFF] cursor-pointer h-15 w-15"
          />
        </Link>
        <Link href="/">
          {/* <p>favorite</p> */}
          <FontAwesomeIcon
            icon={faHeart}
            className="hover:text-[#6DDDFF] cursor-pointer h-14 w-14"
          />
        </Link>
        <Link href="/">
          {/* <p>profile</p> */}
          <FontAwesomeIcon
            icon={faUser}
            className="hover:text-[#6DDDFF] cursor-pointer h-14 w-14"
          />
        </Link>
      </div>
    </div>
  );
};

// https://qiita.com/naoyuki2/items/7ae311f790b637ce40fd#justify-between

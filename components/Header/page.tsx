import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="bg-[#333333] p-5 flex justify-between">
      <p className="text-3xl font-serif text-[#CCCCCC] pl-23">Combines Darts</p>
      <button type="button" className="h-8 w-8 text-[#CCCCCC]">
        <Link href="/login">
          <FontAwesomeIcon icon={faBars} className="cursor-pointer" />
        </Link>
      </button>
    </div>
  );
};

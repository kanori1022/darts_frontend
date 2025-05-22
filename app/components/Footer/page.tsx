import {
  faHeart,
  faHouse,
  faMagnifyingGlass,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Footer = () => {
  return (
    <div className="bg-[#333333] px-8 py-6 ">
      <div className="text-[#828282] flex gap-10 bg-[#333333]">
        <FontAwesomeIcon
          icon={faHouse}
          className="hover:text-[#6DDDFF] cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="hover:text-[#6DDDFF] cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faPlus}
          className="hover:text-[#6DDDFF] cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faHeart}
          className="hover:text-[#6DDDFF] cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faUser}
          className="hover:text-[#6DDDFF] cursor-pointer"
        />
      </div>
    </div>
  );
};

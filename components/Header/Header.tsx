import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { DrawerMenu } from "../DrawerMenu/DrawerMenu";

export const Header = () => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <DrawerMenu />
      <div className="bg-[#333333] p-5 flex justify-between">
        <p className="text-3xl font-serif text-[#CCCCCC] mx-auto text-center cursor-pointer">
          <Link href="/home">Combines Darts</Link>
        </p>
        <button type="button" className="h-8 w-8 text-[#CCCCCC]">
          <FontAwesomeIcon icon={faBars} size="2x" className="cursor-pointer" />
        </button>
      </div>
    </>
  );
};

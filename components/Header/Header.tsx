"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { DrawerMenu } from "../DrawerMenu/DrawerMenu";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <DrawerMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="bg-[#333333] p-5 flex justify-between items-center relative">
        <p className="text-3xl font-serif text-[#CCCCCC] mx-auto text-center cursor-pointer">
          <Link href="/home">Combines Darts</Link>
        </p>
        <button
          type="button"
          className="h-8 w-8 z-50 text-[#CCCCCC]"
          onClick={toggleDrawer}
        >
          <FontAwesomeIcon icon={faBars} size="2x" className="cursor-pointer" />
        </button>
      </div>
    </>
  );
};

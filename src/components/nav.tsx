"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import BtnLogout from "./btn-logout";

const Nav = () => {
  const segment = useSelectedLayoutSegment();

  return (
    <nav className="flex gap-2 items-center justify-between p-2">
      <p className="italic text-blue-500">Task App</p>
      <ul className="flex gap-2">
        <li
          className={`p-2 ${
            segment === null ? " text-blue-400 border-b-2 border-blue-600" : ""
          }`}
        >
          <Link href="/">Inicio</Link>
        </li>
        <li
          className={`p-2 ${
            segment === "tasks"
              ? " text-blue-400 border-b-2 border-blue-600"
              : ""
          }`}
        >
          <Link href="/tasks">Tarefas</Link>
        </li>
        <li className="flex items-center justify-center hover:cursor-pointer">
          <BtnLogout />
        </li>
      </ul>
    </nav>
  );
};

export default Nav;

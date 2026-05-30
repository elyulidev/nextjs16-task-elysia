import { LogOut } from "lucide-react";
import { logout } from "@/actions";

const BtnLogout = () => {
  return <LogOut size={20} className="" onClick={logout} />;
};

export default BtnLogout;

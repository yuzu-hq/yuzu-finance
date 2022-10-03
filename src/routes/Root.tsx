import { MarketHeader, YuzuHeader } from "../components";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-screen min-h-screen bg-slate-50 flex flex-col">
      <YuzuHeader />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

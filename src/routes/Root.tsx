import { MarketHeader, YuzuHeader } from "../components";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-screen min-h-screen bg-slate-50 flex flex-col">
      <YuzuHeader />
      <div className="flex grow container mx-auto mt-16 flex-col w-full py-12 items-center">
        <MarketHeader prices={{}} />
        <Outlet />
      </div>
    </div>
  );
}

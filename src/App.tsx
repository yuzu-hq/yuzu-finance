import { Routes, Route, Link, useParams, Outlet } from "react-router-dom";
import { YuzuHeader, YuzuHome } from "./components";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<YuzuHome />} />
        <Route path=":tickerId" element={<Details />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div className="w-screen min-h-screen bg-slate-50 flex flex-col">
      <YuzuHeader />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

function Details() {
  let params = useParams();
  return (
    <>
      <main>
        <div className="flex bg-red-600 grow container mx-auto mt-16 flex-col w-full py-12 items-center">
          Ticker {params.tickerId}
        </div>
      </main>
    </>
  );
}

export default App;

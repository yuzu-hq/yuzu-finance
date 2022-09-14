import { Routes, Route, Link, useParams } from "react-router-dom";
import { YuzuHeader, YuzuHome } from "./components";

function App() {
  return (
    <div className="w-screen min-h-screen bg-slate-50 flex flex-col">
      <YuzuHeader />
      <Routes>
        <Route path="finance" element={<YuzuHome />} />
        <Route path="quote/:tickerId" element={<Details />} />
      </Routes>
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
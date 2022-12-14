import { Route, Routes } from "react-router-dom";

import { Details, Home, Root } from "./routes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path=":streamType::tickerId" element={<Details />} />
      </Route>
    </Routes>
  );
}

export default App;

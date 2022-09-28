import { Link } from "react-router-dom";

const YuzuHeader = () => {
  return (
    <div className="navigation flex-shrink fixed w-full">
      <nav>
        <Link to="finance">
          <h2>
            🍋 <span className="">Yuzu</span>{" "}
            <span className="text-amber-600 font-sans font-normal text-xl">
              Finance
            </span>
          </h2>
        </Link>
      </nav>
    </div>
  );
};

export default YuzuHeader;
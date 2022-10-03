import { useParams } from "react-router-dom";

export default function Details() {
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

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="grid place-items-center w-screen h-screen">
      <div>
        <h1 className="text-4xl font-bold">Welcome to Llama a la Vida</h1>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

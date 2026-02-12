import { useContext } from "react";
import AuthContext from "./AuthContext";

const Header = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="min-w-screen bg-gray-800 text-white p-4 mb-6">
      <div className="">
        <h1 className="text-center text-3xl font-bold mt-6">
          WELCOME TO THE VEHICLE MAINTENANCE TRACKER!
        </h1>
      </div>
      <div className="flex justify-end mr-4">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition"
          >
            Logout
          </button>
      </div>
    </header>
  );
};

export default Header;

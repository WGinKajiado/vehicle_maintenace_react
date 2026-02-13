import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import Header from "./Header";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            setError("");
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        }
    }

    return (
      <div>
        {/* <Header /> */}
        <h1 className="bg-black/40 p-8 text-5xl font-bold text-center mb-6 text-white">
          WELCOME TO THE VEHICLE MAINTENANCE TRACKER!
        </h1>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-300">
          Keep track of your vehicle's maintenance records
        </h2>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 hover:border-gray-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 hover:border-gray-400"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Login
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Don't have an account? Register
              </Link>
            </div>
            {error && (
              <p className="mt-4 text-center text-red-600 font-medium">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
};

export default Login;
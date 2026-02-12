import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "./AuthContext";

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
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <Link to="/register">Don't have an account? Register</Link>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
};

export default Login;
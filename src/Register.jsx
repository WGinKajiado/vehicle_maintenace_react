import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";

const Register = ({ register }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        register(email, password);
        navigate("/login");
    }

    return (
        <div> 
            <h2>Register</h2>
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
                <button type="submit">Register</button>
            </form>
            <Link to="/login">Already have an account? Login</Link>
        </div>
    )
};

export default Register;
import { createContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { auth } from "./firebase";

// create a context
const AuthContext = createContext();

//create a Provider component


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    const register = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const login = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, authReady, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthContext;
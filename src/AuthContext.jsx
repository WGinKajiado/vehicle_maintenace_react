import { createContext, useEffect, useState } from "react"

// create a context
const AuthContext = createContext();

//create a Provider component


export const AuthProvider = ({ children }) => {
    const [data, setData] = useState(() => {
        const storedData = localStorage.getItem("data");
        return storedData ? JSON.parse(storedData) : [];
    });

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    } );

    useEffect(() => { // sync user state with localStorage
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }

    }, [user]);

    const addItem = (item) => {
        const updatedData = [...data, item];
        setData(updatedData);
        localStorage.setItem("data", JSON.stringify(updatedData));
    };

    const updateItem = (updatedItem) => {
        const updatedData = data.map((item) => {item.id === updatedItem.id ? updatedItem : item});
        setData(updatedData);
        localStorage.setItem("data", JSON.stringify(updatedData));
    };

    const deleteItem = (id) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        localStorage.setItem("data", JSON.stringify(updatedData));
    };

    const register = (email, password) => {
        const newUser = { email, password };
        setUser(newUser);
        console.log("Registered user:", newUser);
    }

    const login = (email, password) => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.email === email && storedUser.password === password) {
            setUser(storedUser);
            return true;
        } else {
            return false;
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ data, addItem, updateItem, deleteItem, user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthContext;
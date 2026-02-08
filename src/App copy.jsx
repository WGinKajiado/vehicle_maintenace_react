import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './AuthContext';
import Dashboard from './VehicleDashboard';
import Register from './Register';
import Login from './Login';

function App() {
  const {
    data,
    addItem,
    updateItem,
    deleteItem,
    user,
    register,
    login,
    logout,
  } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route 
          path = "/" 
          element={ <Navigate to={ user ? "/dashboard" : "/login"} /> } 
        />

        <Route 
          path = "/Dashboard" 
          element={ user ? <Dashboard 
            data={data} addItem={addItem} updateItem={updateItem} deleteItem={deleteItem} logout={logout} /> : <Navigate to="/login" /> } 
        />

        <Route 
          path = "/login" 
          element={ user ? <Navigate to="/dashboard" /> : <Login login={login} /> } 
        />

        <Route 
          path = "/register" 
          element={ user ? <Navigate to="/dashboard" /> : <Register register={register} /> } 
        />

      </Routes>
    </Router>
  )
}

export default App

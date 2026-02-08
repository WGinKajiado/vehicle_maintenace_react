import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VehicleDashboard from "./VehicleDashboard";
import Service from "./Service";

function App() {
  const [vehicles, setVehicles] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("vehicles")) || [];
    setVehicles(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, vehicle]);
    localStorage.setItem(`services_${vehicle.id}`, JSON.stringify([])); // Initialize empty services for the new vehicle
  };

  const updateVehicle = (updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)),
    );
  };

  const deleteVehicle = (id) => { 
    if (!confirm("Delete this vehicle and all its service records?")) return;

    setVehicles(vehicles.filter((v) => v.id !== id)); // Delete vehicle and its services
    localStorage.removeItem(`services_${id}`); // Remove associated services from localStorage
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <VehicleDashboard
              data={vehicles}
              addItem={addVehicle}
              updateItem={updateVehicle}
              deleteItem={deleteVehicle}
            />
          }
        />
        <Route path="/service/:id" element={<Service />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import VehicleDashboard from "./VehicleDashboard";
import Service from "./Service";
import Login from "./Login";
import Register from "./Register";
import AuthContext from "./AuthContext";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import image from "./assets/Dashboard.jpg";

function App() {
  const { user, authReady } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (!user) {
      setVehicles([]);
      return;
    }

    const vehiclesRef = collection(db, "users", user.uid, "vehicles");
    const q = query(vehiclesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setVehicles(items);
    });

    return () => unsubscribe();
  }, [user]);

  // Don't render routes until auth is ready
  if (!authReady) {
    return <div>Loading...</div>;
  }

  const addVehicle = async (vehicle) => {
    if (!user) return;
    const vehiclesRef = collection(db, "users", user.uid, "vehicles");
    await addDoc(vehiclesRef, {
      ...vehicle,
      createdAt: serverTimestamp(),
      lastServiceDate: "-",
      lastServiceMileage: "-",
      upcomingServiceDate: "-",
      upcomingServiceMileage: "-",
    });
  };

  const updateVehicle = async (updatedVehicle) => {
    if (!user) return;
    const { id, createdAt, lastServiceDate, lastServiceMileage, upcomingServiceDate, upcomingServiceMileage, ...payload } = updatedVehicle;
    await updateDoc(doc(db, "users", user.uid, "vehicles", id), payload);
  };

  const deleteVehicle = async (id) => { 
    if (!confirm("Delete this vehicle and all its service records?")) return;
    if (!user) return;

    const batch = writeBatch(db);
    const servicesRef = collection(db, "users", user.uid, "vehicles", id, "services");
    const servicesSnap = await getDocs(servicesRef);
    servicesSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    batch.delete(doc(db, "users", user.uid, "vehicles", id));
    await batch.commit();
  };

  return (
    <div style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${image})`, backgroundSize: "cover", minHeight: "100vh" }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={authReady ? (user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />) : null} // Redirect based on auth state once ready
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <VehicleDashboard
                data={vehicles}
                addItem={addVehicle}
                updateItem={updateVehicle}
                deleteItem={deleteVehicle}
              />
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not authenticated
            )
          }
        />
        <Route
          path="/service/:id"
          element={user ? <Service /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import AuthContext from "./AuthContext";
import Header from "./Header";

const Service = () => {

  const { id: vehicleId } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [service, setService] = useState({
    date: "",
    mileage: "",
    cost: "",
    workDone: "",
    nextServiceDate: "",
    nextServiceMileage: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user || !vehicleId) {
      setLoading(false);
      return;
    }

    console.log("Loading vehicle with ID:", vehicleId, "for user:", user.uid);
    const vehicleRef = doc(db, "users", user.uid, "vehicles", vehicleId);
    const unsubscribe = onSnapshot(vehicleRef, (snapshot) => {
      console.log("Vehicle snapshot exists:", snapshot.exists(), snapshot.data());
      if (!snapshot.exists()) {
        setVehicle(undefined);
        setLoading(false);
        return;
      }
      setVehicle({ id: snapshot.id, ...snapshot.data() });
      setLoading(false);
    }, (error) => {
      console.error("Error loading vehicle:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, vehicleId]);

  useEffect(() => {
    if (!user || !vehicleId) return;

    const servicesRef = collection(db, "users", user.uid, "vehicles", vehicleId, "services");
    const q = query(servicesRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    });

    return () => unsubscribe();
  }, [user, vehicleId]);

  useEffect(() => {
    if (!user || !vehicleId || !vehicle) return;

    let lastServiceDate = "-";
    let lastServiceMileage = "-";
    if (services.length > 0) {
      const latest = services
        .filter((s) => s.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      if (latest?.date) lastServiceDate = latest.date;
      if (latest?.mileage) lastServiceMileage = latest.mileage;
    }

    let upcomingServiceDate = "-";
    let upcomingServiceMileage = "-";

    const withNextDate = services
      .filter((s) => s.nextServiceDate)
      .sort((a, b) => new Date(a.nextServiceDate) - new Date(b.nextServiceDate));

    if (withNextDate.length > 0) {
      upcomingServiceDate = withNextDate[0].nextServiceDate || "-";
      upcomingServiceMileage = withNextDate[0].nextServiceMileage || "-";
    } else {
      const withNextMileage = services
        .filter((s) => s.nextServiceMileage)
        .sort((a, b) => Number(a.nextServiceMileage) - Number(b.nextServiceMileage));
      if (withNextMileage.length > 0) {
        upcomingServiceMileage = withNextMileage[0].nextServiceMileage || "-";
      }
    }

    const vehicleRef = doc(db, "users", user.uid, "vehicles", vehicleId);
    updateDoc(vehicleRef, {
      lastServiceDate,
      lastServiceMileage,
      upcomingServiceDate,
      upcomingServiceMileage,
    });
  }, [services, user, vehicleId, vehicle]);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!user) return;

    const servicesRef = collection(db, "users", user.uid, "vehicles", vehicleId, "services");
    await addDoc(servicesRef, service);
    setService({
      date: "",
      mileage: "",
      cost: "",
      workDone: "",
      nextServiceDate: "",
      nextServiceMileage: "",
      notes: "",
    });
  };

  const handleEdit = (s) => {
    setService({
      date: s.date || "",
      mileage: s.mileage || "",
      cost: s.cost || "",
      workDone: s.workDone || "",
      nextServiceDate: s.nextServiceDate || "",
      nextServiceMileage: s.nextServiceMileage || "",
      notes: s.notes || "",
    });
    setEditingId(s.id);
  };

  const handleUpdate = async () => {
    if (!user || !editingId) return;

    const serviceRef = doc(db, "users", user.uid, "vehicles", vehicleId, "services", editingId);
    await updateDoc(serviceRef, service);
    setEditingId(null);
    setService({
      date: "",
      mileage: "",
      cost: "",
      workDone: "",
      nextServiceDate: "",
      nextServiceMileage: "",
      notes: "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service record?")) return;
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "vehicles", vehicleId, "services", id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setService({
      date: "",
      mileage: "",
      cost: "",
      workDone: "",
      nextServiceDate: "",
      nextServiceMileage: "",
      notes: "",
    });
  };

  return (
    <div>
      <Header />

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Back to Vehicles
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold ml-4 mb-4">Vehicle Details</h2>

          <div className="p-4 mb-2 text-lg font-bold text-red-700 border border-red-300 bg-red-100 rounded">
            {loading ? (
              <p>Loading vehicle...</p>
            ) : vehicle ? (
              <p>
                <strong>{vehicle.name}</strong> - {vehicle.make} {vehicle.model}{" "}
                ({vehicle.year})
                {vehicle.registrationNumber &&
                  ` | ${vehicle.registrationNumber}`}
              </p>
            ) : (
              <p>Vehicle not found</p>
            )}
          </div>

          <div className="pt-4 mb-2">
            <h3 className="ml-2 text-lg font-semibold">Service</h3>
            <input
              type="date"
              name="date"
              value={service.date}
              onChange={handleChange}
              required
              className="border border-gray-400 hover:border-black m-2 px-2"
            />
            <input
              type="number"
              name="mileage"
              placeholder={
                services.length > 0 && services[0]?.mileage 
                  ? `Last mileage: ${Number(services[0].mileage).toLocaleString()}km` 
                  : "Mileage"
              }
              value={service.mileage}
              onChange={handleChange}
              required
              className="border border-gray-400 hover:border-black m-2 px-4"
            />
            <input
              type="number"
              name="cost"
              placeholder="Cost"
              value={service.cost}
              onChange={handleChange}
              required
              className="border border-gray-400 hover:border-black m-2 px-2"
            />

            <h3 className="mt-2 ml-2 text-lg font-semibold">Work Done</h3>
            <textarea
              name="workDone"
              placeholder="Work Done / Parts Replaced"
              value={service.workDone}
              onChange={handleChange}
              required
              rows="3"
              className="border border-gray-400 hover:border-black m-2 px-2 w-full box-border"
            />

            <h3 className="mt-2 ml-2 text-lg font-semibold">Next Service Due</h3>
            <input
              type="date"
              name="nextServiceDate"
              value={service.nextServiceDate}
              onChange={handleChange}
              required
              className="border border-gray-400 hover:border-black m-2 px-2"
            />
            <input
              type="number"
              name="nextServiceMileage"
              placeholder="Next Service Mileage"
              value={service.nextServiceMileage}
              onChange={handleChange}
              required
              className="border border-gray-400 hover:border-black m-2 px-2"
            />

            <h3 className="mt-2 ml-2 text-lg font-semibold">Notes</h3>
            <textarea
              name="notes"
              placeholder="Notes"
              value={service.notes}
              onChange={handleChange}
              rows="3"
              className="border border-gray-400 hover:border-black m-2 px-2 w-full box-border"
            />
          </div>

          <div className="p-4 flex gap-2">
            {editingId ? (
              <>
                <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                  Update Service Record
                </button>
                <button onClick={handleCancel} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                Add Service Record
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 mt-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold ml-4 mb-4">Service Records</h2>

        <table border="1" cellPadding="5" className="w-full text-center border-collapse-separate" style={{ borderCollapse: "separate", borderSpacing: "0 0.75rem" }}>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border border-gray-400">Date</th>
            <th className="px-4 py-2 border border-gray-400">Mileage KM</th>
            <th className="px-4 py-2 border border-gray-400">Cost KSh</th>
            <th className="px-4 py-2 border border-gray-400">Work Done</th>
            <th className="px-4 py-2 border border-gray-400">Next Service</th>
            <th className="px-4 py-2 border border-gray-400">Notes</th>
            {/* <th className="px-4 py-2 border border-gray-400">Actions</th> */}
          </tr>

          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="7">No service records yet.</td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s.id}>
                  <td>{s.date}</td>
                  <td>
                    {s.mileage ? Number(s.mileage).toLocaleString() : "-"}
                  </td>
                  <td>{s.cost}</td>
                  <td>{s.workDone || "-"}</td>
                  <td>
                    {s.nextServiceDate || "-"}
                    {s.nextServiceMileage
                      ? ` / ${Number(s.nextServiceMileage).toLocaleString()}`
                      : ""}
                  </td>
                  <td>{s.notes}</td>
                  <td>
                    <button onClick={() => handleEdit(s)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Service;

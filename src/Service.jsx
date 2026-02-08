import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Service = () => {

  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [service, setService] = useState({
    date: "",
    mileage: "",
    cost: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  const storageKey = `services_${vehicleId}`;

  // Load vehicle details from localStorage on mount
useEffect(() => {
  const savedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

  const foundVehicle = savedVehicles.find(
    (v) => String(v.id) === String(vehicleId),
  );

  setVehicle(foundVehicle || undefined);
}, [vehicleId]);

  // Load services from localStorage whenever vehicleId changes
  useEffect(() => {
    setServices(JSON.parse(localStorage.getItem(storageKey)) || []);
  }, [storageKey]);

  // Save services to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(services));
  }, [services, storageKey]);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setServices([...services, { ...service, id: Date.now() }]);
    setService({ date: "", mileage: "", cost: "", notes: "" });
  };

  const handleEdit = (s) => {
    setService(s);
    setEditingId(s.id);
  };

  const handleUpdate = () => {
    setServices(services.map((s) => (s.id === editingId ? service : s)));
    setEditingId(null);
    setService({ date: "", mileage: "", cost: "", notes: "" });
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this service record?")) return;
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Vehicles</button>

      <div>
        <h2>Vehicle Details</h2>

        {vehicle ? (
          <p>
            <strong>{vehicle.name}</strong> — {vehicle.make} {vehicle.model} ({vehicle.year})
            {vehicle.registrationNumber && ` | Reg: ${vehicle.registrationNumber}`}
          </p>
        ) : (
          <p>Vehicle not found.</p>
        )}

        <input
          type="date"
          name="date"
          value={service.date}
          onChange={handleChange}
        />
        <input
          type="number"
          name="mileage"
          placeholder="Mileage"
          value={service.mileage}
          onChange={handleChange}
        />
        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={service.cost}
          onChange={handleChange}
        />
        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={service.notes}
          onChange={handleChange}
        />

        {editingId ? (
          <button onClick={handleUpdate}>Update Service</button>
        ) : (
          <button onClick={handleAdd}>Add Service</button>
        )}
      </div>

      <h2>Service Records</h2>

      <table>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>Service Date: {s.date}</td>
              <td>Mileage: {s.mileage}</td>
              <td>Cost: {s.cost}</td>
              <td>Notes: {s.notes}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Service;

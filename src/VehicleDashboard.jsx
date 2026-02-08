import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VehicleDashboard = ({ data, addItem, updateItem, deleteItem }) => {
  const navigate = useNavigate();

  const emptyVehicle = {
    name: "",
    make: "",
    model: "",
    year: "",
    registrationNumber: "",
  };

  const [vehicle, setVehicle] = useState(emptyVehicle);
  const [isEditing, setIsEditing] = useState(false);
  // const [currentVehicle, setCurrentVehicle] = useState(null);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!vehicle.name.trim()) return;

    addItem({ ...vehicle, id: Date.now() });
    setVehicle(emptyVehicle);
  };

  const handleEdit = (v) => {
    setVehicle(v);
    // setCurrentVehicle(v);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    updateItem(vehicle);
    setVehicle(emptyVehicle);
    setIsEditing(false);
    // setCurrentVehicle(null);
  };

  return (
    <div>
      <h2>Your Vehicles</h2>

      <div>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Year</th>
              <th>Make</th>
              <th>Model</th>
              <th>Registration No.</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.year}</td>
                <td>{v.make}</td>
                <td>{v.model}</td>
                <td>{v.registrationNumber || "-"}</td>
                <td>
                  <button onClick={() => navigate(`/service/${v.id}`)}>Service</button>
                  <button onClick={() => handleEdit(v)}>Edit</button>
                  <button onClick={() => deleteItem(v.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2> Add / Edit Vehicle </h2>
        <input
          name="name"
          placeholder="Name"
          value={vehicle.name}
          onChange={handleChange}
        />
        <input
          name="make"
          placeholder="Make"
          value={vehicle.make}
          onChange={handleChange}
        />
        <input
          name="model"
          placeholder="Model"
          value={vehicle.model}
          onChange={handleChange}
        />
        <input
          name="year"
          placeholder="Year"
          value={vehicle.year}
          onChange={handleChange}
        />
        <input
          name="registrationNumber"
          placeholder="Registration"
          value={vehicle.registrationNumber}
          onChange={handleChange}
        />

        {isEditing ? (
          <button onClick={handleUpdate}>Update Vehicle</button>
        ) : (
          <button onClick={handleAdd}>Add Vehicle</button>
        )}
      </div>
    </div>
  );
};

export default VehicleDashboard;

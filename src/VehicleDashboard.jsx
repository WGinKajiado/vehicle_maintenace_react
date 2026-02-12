import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import Header from "./Header";

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

    addItem({ ...vehicle });
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

  const handleCancel = () => {
    setVehicle(emptyVehicle);
    setIsEditing(false);
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold ml-4 mb-4">Your Vehicles</h2>

        <table
          border="1"
          cellPadding="5"
          cellSpacing="0"
          className="w-full mb-6"
        >
          <thead className="bg-gray-200">
            <tr className="text-center">
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Year</th>
              <th className="px-4 py-2 border border-gray-300">Make</th>
              <th className="px-4 py-2 border border-gray-300">Model</th>
              <th className="px-4 py-2 border border-gray-300">
                Registration No.
              </th>
              <th className="px-4 py-2 border border-gray-300">
                Last Service Date
              </th>
              <th className="px-4 py-2 border border-gray-300">Last Mileage</th>
              <th className="px-4 py-2 border border-gray-300">
                Upcoming Service Date
              </th>
              <th className="px-4 py-2 border border-gray-300">
                Upcoming Service Mileage
              </th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {data.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2 border border-gray-300">{v.name}</td>
                <td className="px-4 py-2 border border-gray-300">{v.year}</td>
                <td className="px-4 py-2 border border-gray-300">{v.make}</td>
                <td className="px-4 py-2 border border-gray-300">{v.model}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {v.registrationNumber || "-"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {v.lastServiceDate || "-"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {v.lastServiceMileage && v.lastServiceMileage !== "-"
                    ? Number(v.lastServiceMileage).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {v.upcomingServiceDate || "-"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {v.upcomingServiceMileage && v.upcomingServiceMileage !== "-"
                    ? Number(v.upcomingServiceMileage).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/service/${v.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Service
                    </button>
                    <button
                      onClick={() => handleEdit(v)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(v.id)}
                      className="bg-red-500 hover:bg-red-800 text-white font-semibold py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 mt-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold ml-4 mb-4"> Add / Edit Vehicle </h2>
        <input
          name="name"
          placeholder="Name"
          value={vehicle.name}
          onChange={handleChange}
          className="border border-gray-300 hover:border-black m-2 px-2"
        />
        <input
          name="make"
          placeholder="Make"
          value={vehicle.make}
          onChange={handleChange}
          className="border border-gray-300 hover:border-black m-2 px-2"
        />
        <input
          name="model"
          placeholder="Model"
          value={vehicle.model}
          onChange={handleChange}
          className="border border-gray-300 hover:border-black m-2 px-2"
        />
        <input
          name="year"
          placeholder="Year of manufacture"
          value={vehicle.year}
          onChange={handleChange}
          className="border border-gray-300 hover:border-black m-2 px-2"
        />
        <input
          name="registrationNumber"
          placeholder="Registration"
          value={vehicle.registrationNumber}
          onChange={handleChange}
          className="border border-gray-300 hover:border-black m-2 px-2"
        />

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded"
              >
                Update Vehicle
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded"
            >
              Add Vehicle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDashboard;

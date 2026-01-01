import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Details = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/user/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">
          User Details
        </h2>

        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Mobile:</strong> {user.mobile}
        </p>
        <p>
          <strong>NIC:</strong> {user.nic}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender}
        </p>
      </div>
    </div>
  );
};

export default Details;

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

interface TeslaCar {
  id: string;
  model: string;
  serialNumber: string;
  location: string;
}

const TeslaCars: React.FC = () => {
  const [teslaCars, setTeslaCars] = useState<TeslaCar[]>([]);
  const currentURL = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;

  const fetchData = async () => {
    try {
      const response = await fetch(currentURL + "/api/teslacar");
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeslaCars(data);
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTable = () => {
    return teslaCars.map((car: TeslaCar, index: number) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/tesla-cars/${car.id}`}>{car.id}</Link>
          </td>
          <td>{car.model}</td>
          <td>{car.serialNumber}</td>
          <td>{car.location}</td>
        </tr>
      );
    });
  };

  return (
    <div className="appContainer">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Model</th>
            <th>SerialNumber</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>{renderTable()}</tbody>
      </table>
      <Outlet />
    </div>
  );
};

export default TeslaCars;

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const TeslaCars = () => {
  const [teslaCars, setTeslaCars] = useState([]);
  const localURL = "http://localhost:5052/api/teslacar";
  const azureURL = "https://app-lts.azurewebsites.net/api/teslacar";

  const fetchData = async () => {
    try {
      const response = await fetch(azureURL);
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

  function printHello(index) {
    console.log("Hello " + index);
  }

  const renderTable = () => {
    return teslaCars.map((car, index) => {
      return (
        <tr key={index} onClick={() => printHello(car.id)}>
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

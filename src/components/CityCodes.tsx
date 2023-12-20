import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const cityCodes = () => {
  const [cityCodes, setcityCodes] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://app-lts.azurewebsites.net/api/citycode"
      );
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data = await response.json();
      setcityCodes(data);
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
    return cityCodes.map((item, index) => {
      return (
        <tr key={index} onClick={() => printHello(item.id)}>
          <td>
            <Link to={`/cityitems/${item.id}`}>{item.id}</Link>
          </td>
          <td>{item.code}</td>
          <td>{item.city}</td>
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
            <th>Code</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>{renderTable()}</tbody>
      </table>
      <Outlet />
    </div>
  );
};

export default cityCodes;

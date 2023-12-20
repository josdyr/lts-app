import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

interface CityCode {
  id: string;
  code: string;
  city: string;
}

const cityCodes: React.FC = () => {
  const [cityCodes, setCityCodes] = useState<CityCode[]>([]);
  const currentURL: string = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch(currentURL + "/api/citycode");
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data: CityCode[] = await response.json();
      setCityCodes(data);
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTable = (): JSX.Element[] => {
    return cityCodes.map((item: CityCode, index: number) => {
      return (
        <tr key={index}>
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

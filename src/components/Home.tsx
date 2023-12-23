import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";

interface TeslaCar {
  id: string;
  model: string;
  serialNumber: string;
  location: string;
}

export const Home = () => {
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
      console.log(data);
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const containerStyle = {
    width: "100%",
    height: "750px",
  };

  // Coordinates for the cities
  const stavanger = { lat: 58.969975, lng: 5.733107 };
  const bergen = { lat: 60.391263, lng: 5.322054 };
  const oslo = { lat: 59.913869, lng: 10.752245 };
  // const kristiansand = { lat: 59.913869, lng: 10.752245 };

  // make all consts in a map
  const cities = {
    Stavanger: { lat: 58.969975, lng: 5.733107 },
    Bergen: { lat: 60.391263, lng: 5.322054 },
    Oslo: { lat: 59.913869, lng: 10.752245 },
    Kristiansand: { lat: 58.154966, lng: 8.018261 },
  };

  // Center the map around southern Norway
  const center = {
    lat: (stavanger.lat + bergen.lat + oslo.lat) / 3,
    lng: (stavanger.lng + bergen.lng + oslo.lng) / 3,
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMapLoad = useCallback(
    (map: any) => {
      teslaCars.forEach((car) => {
        const location = car.location as keyof typeof cities;
        new window.google.maps.Marker({
          position: cities[location],
          map: map, // make sure to use the 'map' variable passed into the function
          title: car.model,
        });
      });
    },
    [teslaCars, cities]
  ); // Correctly placed dependencies array

  return (
    <div className="appContainer">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={(map) => handleMapLoad(map)}
        />
      </LoadScript>
    </div>
  );
};

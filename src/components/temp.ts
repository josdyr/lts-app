import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export const Home = () => {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  // Coordinates for the cities
  const stavanger = { lat: 58.969975, lng: 5.733107 };
  const bergen = { lat: 60.391263, lng: 5.322054 };
  const oslo = { lat: 59.913869, lng: 10.752245 };

  // Center the map around southern Norway
  const center = {
    lat: (stavanger.lat + bergen.lat + oslo.lat) / 3,
    lng: (stavanger.lng + bergen.lng + oslo.lng) / 3,
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="appContainer">
      <div>Home</div>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
          <Marker position={stavanger} />
          <Marker position={bergen} />
          <Marker position={oslo} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export const Home = () => {
  const containerStyle = {
    width: "100%",
    height: "750px",
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

  const handleMapLoad = (map: any) => {
    // The map instance is fully loaded.
    // You can use this callback to perform additional operations on the map if needed.
    console.log(map);

    // Add a marker to the map
    // add url on each marker and take user to the city page
    const markers = [
      {
        position: stavanger,
        title: "Stavanger",
        label: "5",
        url: "/stavanger",
      },
      {
        position: bergen,
        title: "Bergen",
        label: "2",
      },
      {
        position: oslo,
        title: "Oslo",
        label: "24",
      },
    ];

    markers.forEach((marker) => {
      new window.google.maps.Marker({
        position: marker.position,
        map,
        title: marker.title,
        label: marker.label,
      });
    });
  };

  return (
    <div className="appContainer">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={handleMapLoad}
        />
      </LoadScript>
    </div>
  );
};

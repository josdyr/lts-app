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
  const [isLoading, setIsLoading] = useState(true);
  const currentURL = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;

  const fetchData = async () => {
    try {
      const response = await fetch(currentURL + "/api/teslacar");
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeslaCars(data);
      setIsLoading(false);
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

  // make all consts in a map of norways biggest cities
  const cities = {
    Stavanger: { lat: 58.969975, lng: 5.733107 },
    Bergen: { lat: 60.391263, lng: 5.322054 },
    Oslo: { lat: 59.913869, lng: 10.752245 },
    Kristiansand: { lat: 58.154966, lng: 8.018261 },
    Trondheim: { lat: 63.430515, lng: 10.395053 },
    Tromsø: { lat: 69.649205, lng: 18.955324 },
    Bodø: { lat: 67.280356, lng: 14.404916 },
    Ålesund: { lat: 62.472228, lng: 6.149482 },
    Larvik: { lat: 59.053952, lng: 10.035511 },
    Fredrikstad: { lat: 59.2181, lng: 10.9298 },
    Drammen: { lat: 59.7425, lng: 10.2045 },
    Sandnes: { lat: 58.8521, lng: 5.735 },
    Sarpsborg: { lat: 59.2833, lng: 11.1167 },
    Skien: { lat: 59.2, lng: 9.6 },
    Ås: { lat: 59.6667, lng: 10.8 },
    Haugesund: { lat: 59.4133, lng: 5.268 },
    Tønsberg: { lat: 59.267, lng: 10.407 },
    Moss: { lat: 59.4333, lng: 10.6667 },
    Porsgrunn: { lat: 59.1333, lng: 9.6667 },
    Sandefjord: { lat: 59.1333, lng: 10.2167 },
    Arendal: { lat: 58.4619, lng: 8.772 },
    Bærum: { lat: 59.89, lng: 10.52 },
    Hamar: { lat: 60.7944, lng: 11.0678 },
    Gjøvik: { lat: 60.795, lng: 10.691 },
    Molde: { lat: 62.7375, lng: 7.159 },
    Harstad: { lat: 68.798, lng: 16.541 },
    Lillehammer: { lat: 61.115, lng: 10.466 },
    Halden: { lat: 59.15, lng: 11.3833 },
    Horten: { lat: 59.4167, lng: 10.4833 },
    Kongsvinger: { lat: 60.2, lng: 12.0333 },
    Jessheim: { lat: 60.15, lng: 11.1833 },
    Moelv: { lat: 60.8833, lng: 10.7 },
    Ski: { lat: 59.7333, lng: 10.95 },
    Askim: { lat: 59.5833, lng: 11.1667 },
    Drøbak: { lat: 59.6667, lng: 10.6333 },
    Elverum: { lat: 60.8833, lng: 11.5667 },
    Råholt: { lat: 60.2333, lng: 11.2333 },
    Lillestrøm: { lat: 59.95, lng: 11.0833 },
    Levanger: { lat: 63.75, lng: 11.3 },
    Alta: { lat: 69.9667, lng: 23.2417 },
  };

  // Center the map around southern Norway
  const center = {
    lat:
      (cities.Stavanger.lat +
        cities.Bergen.lat +
        cities.Oslo.lat +
        cities.Kristiansand.lat) /
      4,
    lng:
      (cities.Stavanger.lng +
        cities.Bergen.lng +
        cities.Oslo.lng +
        cities.Kristiansand.lng) /
      4,
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMapLoad = useCallback(
    (map: any) => {
      if (!isLoading) {
        console.log(teslaCars);
        teslaCars.forEach((car) => {
          const location = car.location as keyof typeof cities;
          const marker = new window.google.maps.Marker({
            position: cities[location],
            map: map,
            title: car.model,
          });

          // Add a click event listener to the marker
          marker.addListener("click", () => {
            // Redirect to the Tesla car's page using the car's id
            window.location.href = `/tesla-cars/${car.id}`;
          });
        });
      }
    },
    [teslaCars, cities]
  );

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading state or a spinner
  }

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

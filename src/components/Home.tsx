import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";
import { WebPubSubClient } from "@azure/web-pubsub-client";
import useGlobal from "../context/globalContextProvider";

interface TeslaCar {
  id: string;
  model: string;
  serialNumber: string;
  location: string;
}

export const Home = () => {
  const [teslaCars, setTeslaCars] = useState<TeslaCar[]>([]);
  const [isMapLoading, setisMapLoading] = useState(true);
  const currentURL = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;
  const { pubSubToken } = useGlobal();

  useEffect(() => {
    const pubSubClient = new WebPubSubClient(pubSubToken);
    console.log("pubSubToken: ", pubSubToken);

    pubSubClient?.on("server-message", (e) => {
      let data = e.message.data;

      if (typeof data === "string") {
        let deserializedData = JSON.parse(data);
        let camelCaseJson = toLowerCamelCase(deserializedData);

        // setTeslaCars once and only once
        setTeslaCars((prev) => {
          return [...prev, camelCaseJson];
        });
        // re-render the map
        setisMapLoading(true);
        fetchData();
      } else {
        console.error("Received data is not a string:", data);
      }
    });

    pubSubClient?.on("connected", (e) => {
      console.log(`Connection ${e.connectionId} is connected.`);
    });

    pubSubClient?.on("disconnected", (e) => {
      console.log(`Connection disconnected: ${e.message}`);
    });

    pubSubClient?.start();

    return () => {
      pubSubClient?.off("server-message", () => {});
      pubSubClient?.stop();
    };
  }, [pubSubToken]);

  function toLowerCamelCase(obj: any): any {
    let newObj: any = {};
    for (let key in obj) {
      let newKey = key.charAt(0).toLowerCase() + key.slice(1);
      newObj[newKey] = obj[key];
    }
    return newObj;
  }

  const fetchData = async () => {
    try {
      const response = await fetch(currentURL + "/api/teslacar");
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeslaCars(data);
      setisMapLoading(false);
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
    Arendal: { lat: 58.4619, lng: 8.772 },
    Farsund: { lat: 58.1, lng: 6.8 },
    Flekkefjord: { lat: 58.3, lng: 6.65 },
    Grimstad: { lat: 58.35, lng: 8.6 },
    Kristiansand: { lat: 58.154966, lng: 8.018261 },
    Lillesand: { lat: 58.25, lng: 8.3833 },
    Risør: { lat: 58.7167, lng: 9.2333 },
    Tvedestrand: { lat: 58.6167, lng: 8.9333 },
    Gjøvik: { lat: 60.8, lng: 10.7 },
    Hamar: { lat: 60.8, lng: 11.0667 },
    Kongsvinger: { lat: 60.2, lng: 12.0 },
    Lillehammer: { lat: 61.1167, lng: 10.4667 },
    Kristiansund: { lat: 63.1167, lng: 7.7333 },
    Molde: { lat: 62.7333, lng: 7.1833 },
    Ålesund: { lat: 62.472228, lng: 6.149482 },
    Bodø: { lat: 67.2833, lng: 14.3833 },
    Brønnøy: { lat: 65.4667, lng: 12.2167 },
    Rana: { lat: 66.3167, lng: 14.1667 },
    Narvik: { lat: 68.4167, lng: 17.4333 },
    Oslo: { lat: 59.911491, lng: 10.757933 },
    Haugesund: { lat: 59.413333, lng: 5.2675 },
    Sandnes: { lat: 58.85, lng: 5.7333 },
    Stavanger: { lat: 58.966667, lng: 5.75 },
    Hammerfest: { lat: 70.6667, lng: 23.6667 },
    Harstad: { lat: 68.8, lng: 16.55 },
    Tromsø: { lat: 69.6667, lng: 18.9667 },
    Vadsø: { lat: 70.0833, lng: 29.7667 },
    Vardø: { lat: 70.3667, lng: 31.1 },
    Levanger: { lat: 63.75, lng: 11.3 },
    Namsos: { lat: 64.4833, lng: 11.5 },
    Røros: { lat: 62.5667, lng: 11.3833 },
    Steinkjer: { lat: 64.0167, lng: 11.5 },
    Trondheim: { lat: 63.430565, lng: 10.395052 },
    Holmestrand: { lat: 59.4833, lng: 10.3167 },
    Horten: { lat: 59.4167, lng: 10.4833 },
    Kragerø: { lat: 58.8833, lng: 9.4 },
    Larvik: { lat: 59.05, lng: 10.0167 },
    Notodden: { lat: 59.5667, lng: 9.25 },
    Porsgrunn: { lat: 59.1333, lng: 9.6667 },
    Sandefjord: { lat: 59.1333, lng: 10.2167 },
    Skien: { lat: 59.2, lng: 9.6 },
    Tønsberg: { lat: 59.2667, lng: 10.4 },
    Bergen: { lat: 60.391262, lng: 5.322054 },
    Drammen: { lat: 59.7425, lng: 10.204444 },
    Fredrikstad: { lat: 59.216667, lng: 10.933333 },
    Halden: { lat: 59.15, lng: 11.3833 },
    Kongsberg: { lat: 59.6667, lng: 9.6667 },
    Moss: { lat: 59.4333, lng: 10.6667 },
    Sarpsborg: { lat: 59.2833, lng: 11.1167 },
  };

  let cityCountMap = new Map();

  teslaCars.forEach((car) => {
    let city = car.location;
    if (cityCountMap.has(city)) {
      cityCountMap.set(city, cityCountMap.get(city) + 1);
    } else {
      cityCountMap.set(city, 1);
    }
  });

  console.log("cityCountMap: ", cityCountMap);

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
      if (!isMapLoading) {
        teslaCars.forEach((car) => {
          const location = car.location as keyof typeof cities;
          const locationCount = cityCountMap.get(car.location);
          const marker = new window.google.maps.Marker({
            position: cities[location],
            map: map,
            label: locationCount.toString(),
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

  if (isMapLoading) {
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

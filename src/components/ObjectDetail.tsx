import { GoogleMap, LoadScript } from "@react-google-maps/api";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import jsonQuery from "../../public/query.json";
import TeslaComment from "./TeslaComment";

interface TeslaCar {
  teslaCarGuid: string;
  id: number;
  model: string;
  location: string;
  serialNumber: string;
}

interface CityCode {
  city: string;
  code: string;
}

interface NorwegianCity {
  label: string;
}

export const ObjectDetail = () => {
  const [wasValidated, setWasValidated] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [teslaCar, setTeslaCar] = useState<TeslaCar>({
    teslaCarGuid: "",
    id: 0,
    model: "",
    location: "",
    serialNumber: "",
  });
  const [isMapLoading, setisMapLoading] = useState(true);
  const [cityCode, setCityCode] = useState<CityCode[]>([]);
  const [norwegianCities, setNorwegianCities] = useState<NorwegianCity[]>([]);
  const [mergedCityWithCode, setMergedCityWithCode] = useState<CityCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitState, setSubmitState] = useState("Submit");
  const [shouldDelete, setShouldDelete] = useState(false);
  const currentURL = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
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

  const fetchData = async () => {
    try {
      const response = await fetch(currentURL + `/api/teslacar/${params.id}`);
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeslaCar(data);
      setisMapLoading(false);
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (shouldDelete) {
      handleSubmit();
      setShouldDelete(false);
    }
  }, [teslaCar, shouldDelete]);

  useEffect(() => {
    fetchData();
    fetchCityCode();
    fetchNorwegianCities();
  }, []);

  useEffect(() => {
    if (
      Object.keys(cityCode).length > 0 &&
      Object.keys(norwegianCities).length > 0
    ) {
      mergeCityWithCode(cityCode, norwegianCities);
    }
  }, [cityCode, norwegianCities]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const updatedTeslaCar = { ...teslaCar, [e.target.name]: e.target.value };

    // Generate serialNumber when model or location changes
    if (e.target.name === "model" || e.target.name === "location") {
      const modelPrefix = updatedTeslaCar.model
        ? `T${updatedTeslaCar.model}`
        : "T";
      const locationSuffix = updatedTeslaCar.location
        ? updatedTeslaCar.location.toUpperCase().substring(0, 2)
        : "";
      updatedTeslaCar.serialNumber = `${modelPrefix}-00001-${locationSuffix}`;
    }

    setTeslaCar(updatedTeslaCar);
  };

  console.log(teslaCar);

  function mergeCityWithCode(
    cityCode: CityCode[],
    norwegianCities: NorwegianCity[]
  ) {
    const mergedArray = cityCode.map((code) => {
      norwegianCities.find((city) => city.label === code.city);
      return { ...code };
    });
    setMergedCityWithCode(mergedArray);
  }

  const fetchCityCode = async () => {
    try {
      const response = await fetch(currentURL + "/api/citycode");
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data = await response.json();
      setCityCode(data);
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  };

  function processData(data: any) {
    const values = data.value;
    const labels = data.dimension.Region.category.label;

    const mappedValues: { label: string; value: number }[] = [];

    values.forEach((value: number, index: number) => {
      const labelKey = Object.keys(labels)[index];
      const label = labels[labelKey];
      mappedValues.push({ label, value });
    });

    mappedValues.sort((a, b) => b.value - a.value);

    const top100 = mappedValues.slice(0, 100);

    return top100;
  }

  const fetchNorwegianCities = async () => {
    const url = "https://data.ssb.no/api/v0/no/table/07459/";
    const query = jsonQuery;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const top100 = processData(data);
      setNorwegianCities(top100);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    setIsLoading(true);
    setSubmitState("Loading");
    document.querySelector(".btn-primary")!.classList.add("btn-secondary");
    document.querySelector(".btn-primary")!.classList.remove("btn-primary");

    const payload = { ...teslaCar };

    try {
      let response = null;
      if (Object.values(teslaCar).every((x) => x === "" || x === 0)) {
        response = await fetch(currentURL + `/api/teslacar/${params.id}`, {
          method: "DELETE",
        });
        console.log("Delete");
        return;
      }
      if (teslaCar.id) {
        response = await fetch(currentURL + `/api/teslacar/${teslaCar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log("Update");
      } else {
        payload.id = 0;
        response = await fetch(currentURL + "/api/teslacar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          alert(`Message from backend: ${await response.text()}`);
          throw new Error(`HTTPS error! Status: ${response.status}`);
        } else {
          console.log("Create");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    setTimeout(function () {
      setIsLoading(false);
      setSubmitState("Submitted");
      document.querySelector(".btn-secondary")!.classList.add("btn-success");
      document
        .querySelector(".btn-secondary")!
        .classList.remove("btn-secondary");
    }, 500);

    setTimeout(function () {
      setIsLoading(false);
      setSubmitState("Submit");
      document.querySelector(".btn-success")!.classList.add("btn-primary");
      document.querySelector(".btn-success")!.classList.remove("btn-success");
    }, 2000);
    setWasValidated(true);
  };

  const handleMapLoad = useCallback(
    (map: any) => {
      if (!isMapLoading) {
        console.log(teslaCar);
        const location = teslaCar.location as keyof typeof cities;
        const marker = new window.google.maps.Marker({
          position: cities[location],
          map: map,
          title: teslaCar.model,
        });

        // Add a click event listener to the marker
        marker.addListener("click", () => {
          // Redirect to the Tesla car's page using the car's id
          window.location.href = `/tesla-cars/${teslaCar.id}`;
        });
      }
    },
    [teslaCar, cities]
  );

  if (isMapLoading) {
    return <div>Loading...</div>;
  }

  function handleDeleteObject(event: any): void {
    event.preventDefault();
    if (window.confirm("Are you sure you want to delete this object?")) {
      setTeslaCar({
        teslaCarGuid: "",
        id: 0,
        model: "",
        location: "",
        serialNumber: "",
      });
      setShouldDelete(true);
    }
  }

  return (
    <div className="appContainer">
      <form
        onSubmit={handleSubmit}
        className={wasValidated ? "was-validated" : ""}
        noValidate
      >
        <div className="mb-3">
          <label className="form-label">GUID:</label>
          <input
            type="text"
            name="teslaCarGuid"
            value={teslaCar.teslaCarGuid}
            className="form-control"
            onChange={handleChange}
            required
            readOnly
          />
          <div className="valid-feedback"></div>
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">ID:</label>
          <input
            type="number"
            name="id"
            value={teslaCar.id}
            className="form-control"
            onChange={handleChange}
          />
          <div className="valid-feedback"></div>
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Model:</label>
          <select
            name="model"
            value={teslaCar.model}
            className="form-select"
            onChange={handleChange}
            required
          >
            <option key={"empty"} value=""></option>
            <option key={"S"} value="S">
              Model S
            </option>
            <option key={"3"} value="3">
              Model 3
            </option>
            <option key={"X"} value="X">
              Model X
            </option>
            <option key={"Y"} value="Y">
              Model Y
            </option>
            <option key={"C"} value="C">
              Cyber Truck
            </option>
          </select>
          <div className="valid-feedback"></div>
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Location:</label>
          <select
            name="location"
            value={teslaCar.location}
            className="form-select"
            onChange={handleChange}
            required
          >
            <option key={"empty"} value=""></option>
            {Object.values(mergedCityWithCode).map((item) => (
              <option key={item.city} value={item.city}>
                {item.city} - {item.code}
              </option>
            ))}
          </select>
          <div className="valid-feedback"></div>
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Serial Number:</label>
          <input
            type="text"
            name="serialNumber"
            value={teslaCar.serialNumber}
            className="form-control"
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteObject}
        >
          Delete
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {submitState}
        </button>
      </form>
      <TeslaComment />
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

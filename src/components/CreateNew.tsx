import React, { useState, useEffect } from "react";
import jsonQuery from "../../public/query.json";

interface TeslaCar {
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

export const CreateNew = () => {
  const [teslaCar, setTeslaCar] = useState<TeslaCar>({
    model: "",
    location: "",
    serialNumber: "",
  });
  const [cityCode, setCityCode] = useState<CityCode[]>([]);
  const [norwegianCities, setNorwegianCities] = useState<NorwegianCity[]>([]);
  const [mergedCityWithCode, setMergedCityWithCode] = useState<CityCode[]>([]);
  const [wasValidated, setWasValidated] = useState<boolean>(false);
  const [model, setModel] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("TX-00001-RG");
  const currentURL: string = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;

  useEffect(() => {
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
    const { name, value } = e.target;

    if (name === "model") {
      setModel(value);
    } else if (name === "location") {
      setLocation(value);
    }

    setTeslaCar({
      ...teslaCar,
      [name]: value,
    });
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    const payload = { ...teslaCar };

    try {
      let response = null;

      response = await fetch(currentURL + "/api/teslacar", {
        method: "POST", // Use POST for create
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        alert(
          `Serial number is not valid. Correct format could be: TC-00001-RG`
        );
        throw new Error(`HTTPS error! Status: ${response.status}`);
      } else {
        console.log("Create");
      }

      if (!response.ok) {
        // const errorData = await response.json();
        alert(
          `Serial number is not valid. Correct format could be: TC-00001-RG`
        );
        throw new Error(`HTTPS error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setWasValidated(true);
  };

  return (
    <div className="appContainer">
      <form
        onSubmit={handleSubmit}
        className={wasValidated ? "was-validated" : ""}
        noValidate
      >
        <div className="mb-3">
          <label className="form-label">Model:</label>
          <select
            name="model"
            value={teslaCar.model}
            className="form-select"
            onChange={handleChange}
            required
          >
            <option key="empty" value="empty"></option>
            <option key={"S"} value="Model S">
              Model S
            </option>
            <option key={"3"} value="Model 3">
              Model 3
            </option>
            <option key={"X"} value="Model X">
              Model X
            </option>
            <option key={"Y"} value="Model Y">
              Model Y
            </option>
            <option key={"C"} value="Cyber Truck">
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
            <option key="empty" value="empty"></option>
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

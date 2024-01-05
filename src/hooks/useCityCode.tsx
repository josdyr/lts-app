import { useEffect, useState } from "react";

export const useCityCode = (url: unknown) => {
  const [cityCode, setCityCode] = useState([]);

  useEffect(() => {
    const fetchCityCode = async () => {
      try {
        const response = await fetch(url + "/api/citycode");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCityCode(data);
      } catch (error) {
        console.error("error fetching data: ", error);
      }
    };

    fetchCityCode();
  }, [url]);

  return [cityCode, setCityCode];
};

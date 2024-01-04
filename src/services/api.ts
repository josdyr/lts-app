import { pubSubToken } from "./apiTypes";

const apiService = () => {
  const getByFetch = async (url: string): Promise<any> => {
    return async () => {
      const getOperation = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/${url}`,
        getOperation
      );
      if (res.ok) {
        const jsonResult = await res.json();
        const resultObj = jsonResult;
        return resultObj;
      } else {
        console.error("Get by fetch failed. Url=" + url, res);
      }
    };
  };

  const getPubSubAccessToken = async (): Promise<pubSubToken> => {
    const data = await getByFetch("GetPubSubAccessToken");
    return data;
  };

  return {
    getPubSubAccessToken,
  };
};

export type ApiService = ReturnType<typeof apiService>;

export default apiService;

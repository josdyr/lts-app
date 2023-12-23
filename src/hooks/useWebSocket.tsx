import { useEffect } from "react";
import { WebPubSubClient } from "@azure/web-pubsub-client";

export const useWebSocket = () => {
  useEffect(() => {
    // Instantiates the client object
    const client = new WebPubSubClient(import.meta.env.VITE_WPS_CONNECTION);

    (async () => {
      // Starts the client connection with your Web PubSub resource
      await client.start();

      client.on("server-message", (e) => {
        console.log(`Received message: ${e.message.data}`);
        // fetch or receive a JSON and add dynamically to table
      });

      client.on("connected", (e) => {
        console.log(`Connection ${e.connectionId} is connected.`);
      });

      client.on("disconnected", (e) => {
        console.log(`Connection disconnected: ${e.message}`);
      });
    })();
  }, []);

  return () => {
    // client.stop();
  };
};

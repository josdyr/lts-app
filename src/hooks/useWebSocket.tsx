import { useEffect } from "react";
import { WebPubSubClient } from "@azure/web-pubsub-client";

export const useWebSocket = () => {
  useEffect(() => {
    // Instantiates the client object
    const client = new WebPubSubClient(
      "wss://wps-communication.webpubsub.azure.com/client/hubs/Hub?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3c3M6Ly93cHMtY29tbXVuaWNhdGlvbi53ZWJwdWJzdWIuYXp1cmUuY29tL2NsaWVudC9odWJzL0h1YiIsImlhdCI6MTcwMzA4MTU5MywiZXhwIjoxNzAzMTY3OTkzfQ.m7xzW8ImuEPV5IfmYu0eo6NjDsEO-FADEnfkukWUw7Y"
    );

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
    client.stop();
  };
};

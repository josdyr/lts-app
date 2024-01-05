import { useEffect } from "react";
import { WebPubSubClient } from "@azure/web-pubsub-client";
import useGlobal from "../context/globalContextProvider";

export const useWebSocket = () => {
  const { pubSubToken } = useGlobal();

  useEffect(() => {
    const pubSubClient = new WebPubSubClient(pubSubToken);

    pubSubClient?.on("server-message", (e) => {
      let data = e.message.data;

      if (typeof data === "string") {
        // let deserializedData = JSON.parse(data);
        // setAllComments((prev) => {
        //   return [...prev, deserializedData];
        // });
      } else {
        console.error("Received data is not a string:", data);
      }
    });

    pubSubClient?.on("connected", (e) => {
      console.log(`WebSocket connection ${e.connectionId} is connected.`);
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
};

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
// import { WebPubSubClient } from "@azure/web-pubsub-client";
import { WebPubSubServiceClient } from "@azure/web-pubsub";
import WebSocket from "ws";

interface Comment {
  id: string;
  carId: string;
  commentDescription: string;
  user: string;
}

const AllComments: React.FC = () => {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const currentURL: string = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;

  function toLowerCamelCase(obj: any): any {
    let newObj: any = {};
    for (let key in obj) {
      let newKey = key.charAt(0).toLowerCase() + key.slice(1);
      newObj[newKey] = obj[key];
    }
    return newObj;
  }

  useEffect(() => {
    // Instantiates the client object
    const client = new WebPubSubClient(
      "wss://wps-communication.webpubsub.azure.com/client/hubs/Hub?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3c3M6Ly93cHMtY29tbXVuaWNhdGlvbi53ZWJwdWJzdWIuYXp1cmUuY29tL2NsaWVudC9odWJzL0h1YiIsImlhdCI6MTcwMzI4MjUwMywiZXhwIjoxNzAzMzY4OTAzfQ.6ralcj0w8Dv5MrJTvppOIhtes2YZxiUPCoJ_QhkhYq4"
    );

    (async () => {
      // Starts the client connection with your Web PubSub resource
      await client.start();

      client.on("server-message", (e) => {
        let data = e.message.data;

        // // Check if the data is an instance of ArrayBuffer
        // if (data instanceof ArrayBuffer) {
        //   // Convert ArrayBuffer to string
        //   const decoder = new TextDecoder();
        //   data = decoder.decode(data);
        // }

        // Check if data is a string before parsing
        if (typeof data === "string") {
          console.log(`Received message: ${data}`);
          let deserializedData = JSON.parse(data); // data is confirmed to be a string
          let camelCaseJson = toLowerCamelCase(deserializedData);

          // setAllComments once and only once
          setAllComments((prev) => {
            return [...prev, camelCaseJson];
          });
        } else {
          // Handle the case where data is not a string
          console.error("Received data is not a string:", data);
        }
      });

      client.on("connected", (e) => {
        console.log(`Connection ${e.connectionId} is connected.`);
      });

      client.on("disconnected", (e) => {
        console.log(`Connection disconnected: ${e.message}`);
      });
    })();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(currentURL + "/api/comment");
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data: Comment[] = await response.json();
      setAllComments(data);
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTable = () => {
    return allComments.map((item, index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/comment/${item.id}`}>{item.id}</Link>
          </td>
          <td>{item.carId}</td>
          <td>{item.commentDescription}</td>
          <td>{item.user}</td>
        </tr>
      );
    });
  };

  return (
    <div className="appContainer">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>CarId</th>
            <th>CommentDescription</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>{renderTable()}</tbody>
      </table>
      <Outlet />
    </div>
  );
};

export default AllComments;

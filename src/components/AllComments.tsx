import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { WebPubSubClient } from "@azure/web-pubsub-client";

const AllComments = () => {
  const [allComments, setAllComments] = useState([]);
  const localURL = "http://localhost:5052/api/comment";
  const azureURL = "https://app-lts.azurewebsites.net/api/comment";

  function toLowerCamelCase(obj) {
    let newObj = {};
    for (let key in obj) {
      let newKey = key.charAt(0).toLowerCase() + key.slice(1);
      newObj[newKey] = obj[key];
    }
    return newObj;
  }

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
        let deserializedData = JSON.parse(e.message.data);
        let camelCaseJson = toLowerCamelCase(deserializedData);
        // setAllComments once and only once
        setAllComments((prev) => {
          return [...prev, camelCaseJson];
        });
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
      const response = await fetch(azureURL);
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      const data = await response.json();
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

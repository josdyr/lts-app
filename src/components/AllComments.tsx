import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { WebPubSubClient } from "@azure/web-pubsub-client";
import useGlobal from "../context/globalContextProvider";

interface Comment {
  id: string;
  carId: string;
  commentDescription: string;
  user: string;
}

const AllComments: React.FC = () => {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const currentURL: string = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;
  const { pubSubToken } = useGlobal();

  useEffect(() => {
    const pubSubClient = new WebPubSubClient(pubSubToken);
    console.log("pubSubToken: ", pubSubToken);

    pubSubClient?.on("server-message", (e) => {
      let data = e.message.data;

      if (typeof data === "string") {
        let deserializedData = JSON.parse(data);
        let camelCaseJson = toLowerCamelCase(deserializedData);

        setAllComments((prev) => {
          return [...prev, camelCaseJson];
        });
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

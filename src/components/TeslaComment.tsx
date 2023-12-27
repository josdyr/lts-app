import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { WebPubSubClient } from "@azure/web-pubsub-client";

interface CommentItem {
  id: number;
  carId: number;
  commentDescription: string;
  user: string;
}

const Comment: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [comment, setComment] = useState<CommentItem[]>([]);
  const currentURL = import.meta.env.VITE_AZURE_REACT_APP_BACKEND_URL;

  function toLowerCamelCase(obj: any): any {
    let newObj: any = {};
    for (let key in obj) {
      let newKey = key.charAt(0).toLowerCase() + key.slice(1);
      newObj[newKey] = obj[key];
    }
    return newObj;
  }

  useEffect(() => {
    const client = new WebPubSubClient(import.meta.env.VITE_WPS_CONNECTION);

    (async () => {
      await client.start();

      client.on("server-message", (e) => {
        let data = e.message.data;

        // Check if data is a string before parsing
        if (typeof data === "string") {
          console.log(`Received message: ${data}`);
          let deserializedData = JSON.parse(data); // data is confirmed to be a string
          let camelCaseJson = toLowerCamelCase(deserializedData);

          // setComment once and only once
          setComment((prev) => {
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
      const data = await response.json();
      setComment(data);
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTable = (): JSX.Element[] => {
    const filteredComments = comment.filter(
      (item) => params.id == item.carId.toString()
    );

    const tableRows = filteredComments.map((item, index) => (
      <tr key={index}>
        <td>
          <Link to={`/comment/${item.id}`}>{item.id}</Link>
        </td>
        <td>{item.carId}</td>
        <td>{item.commentDescription}</td>
        <td>{item.user}</td>
      </tr>
    ));

    // // Add a new empty row at the end
    // tableRows.push(
    //   <tr key={"newRow"}>
    //     <td>
    //       <input type="number" />
    //     </td>
    //     <td>
    //       <input type="number" />
    //     </td>
    //     <td>
    //       <input type="text" />
    //     </td>
    //     <td>
    //       <input type="text" />
    //     </td>
    //   </tr>
    // );

    return tableRows;
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

export default Comment;

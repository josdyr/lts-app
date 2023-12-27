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
  const params = useParams<{ id: any }>();
  const [allComments, setAllComments] = useState<CommentItem[]>([]);
  const [currentComment, setCurrentComment] = useState<CommentItem>({
    id: 0,
    carId: parseInt(params.id),
    commentDescription: "",
    user: "",
  });
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

          // setallComments once and only once
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
      const data = await response.json();
      setAllComments(data);
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { ...currentComment };

    try {
      let response = null;
      response = await fetch(currentURL + "/api/comment", {
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
  };

  const renderTable = (): JSX.Element[] => {
    const filteredComments = allComments.filter(
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

    return tableRows;
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentComment((prev) => {
      return {
        ...prev,
        [name]: value,
      };
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
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        New Comment
      </button>
      <Outlet />

      <div
        className="modal fade"
        id="exampleModal"
        // tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                New Comment
              </h5>
            </div>
            <div className="modal-body">
              <form
                onSubmit={handleSubmit}
                // className={wasValidated ? "was-validated" : ""}
                noValidate
              >
                <div className="mb-3">
                  <label className="form-label">Car ID:</label>
                  <input
                    name="commentDescription"
                    value={params.id}
                    className="form-control"
                    onChange={handleChange}
                    required
                    readOnly
                  ></input>
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">
                    Please fill out this field.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comment Description:</label>
                  <input
                    name="commentDescription"
                    // value={teslaCar.commentDescription}
                    className="form-control"
                    onChange={handleChange}
                    required
                  ></input>
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">
                    Please fill out this field.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">User:</label>
                  <input
                    name="user"
                    // value={teslaCar.user}
                    className="form-control"
                    onChange={handleChange}
                    required
                  ></input>
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">
                    Please fill out this field.
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  // disabled={isLoading}
                >
                  Submit
                </button>
              </form>
            </div>
            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Submit
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;

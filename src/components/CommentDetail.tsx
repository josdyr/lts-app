import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsonQuery from "../../public/query.json";

export const CommentDetail = () => {
  const params = useParams();
  const [comment, setComment] = useState({
    id: "",
    carId: "",
    commentDescription: "",
    user: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitState, setSubmitState] = useState("Submit");

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://app-lts.azurewebsites.net/api/comment/${params.id}`
      );
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

  const handleChange = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    setIsLoading(true);
    setSubmitState("Loading");
    document.querySelector(".btn-primary").classList.add("btn-secondary");
    document.querySelector(".btn-primary").classList.remove("btn-primary");

    const payload = { ...comment };

    try {
      let response = null;
      if (Object.values(comment).every((x) => x === "")) {
        response = await fetch(
          `https://app-lts.azurewebsites.net/api/comment/${params.id}`,
          {
            method: "DELETE",
          }
        );
        console.log("Delete");
        return;
      }
      if (comment.id !== "") {
        response = await fetch(
          `https://app-lts.azurewebsites.net/api/comment/${comment.id}`,
          {
            method: "PUT", // Use PUT for update
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        console.log("Update");
      } else {
        payload.id = 0;
        response = await fetch(
          "https://app-lts.azurewebsites.net/api/comment",
          {
            method: "POST", // Use POST for create
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTPS error! Status: ${response.status}`);
        } else {
          console.log("Create");
        }
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

    setTimeout(function () {
      setIsLoading(false);
      setSubmitState("Submitted");
      document.querySelector(".btn-secondary").classList.add("btn-success");
      document
        .querySelector(".btn-secondary")
        .classList.remove("btn-secondary");
    }, 500);

    setTimeout(function () {
      setIsLoading(false);
      setSubmitState("Submit");
      document.querySelector(".btn-success").classList.add("btn-primary");
      document.querySelector(".btn-success").classList.remove("btn-success");
    }, 2000);
  };

  return (
    <div className="appContainer">
      <form onSubmit={handleSubmit} className="was-validated" noValidate>
        <div className="mb-3">
          <label className="form-label">ID:</label>
          <input
            type="number"
            name="id"
            value={comment.id}
            className="form-control"
            onChange={handleChange}
          />
          <div className="valid-feedback"></div>
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Car ID:</label>
          <input
            type="text"
            name="carId"
            value={comment.carId}
            className="form-select"
            onChange={handleChange}
            required
          ></input>
          <div className="valid-feedback"></div>
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Comment Description:</label>
          <input
            type="text"
            name="commentDescription"
            value={comment.commentDescription}
            className="form-select"
            onChange={handleChange}
            required
          ></input>
          <div className="valid-feedback"></div>
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">User:</label>
          <input
            type="text"
            name="user"
            value={comment.user}
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {submitState}
        </button>
      </form>
    </div>
  );
};

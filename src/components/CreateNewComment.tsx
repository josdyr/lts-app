import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsonQuery from "../../public/query.json";

export const CreateNewComment = () => {
  const params = useParams();
  const [newComment, setNewComment] = useState({});
  const [wasValidated, setWasValidated] = useState(false);

  const handleChange = (e) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const payload = { ...newComment };

    try {
      let response = null;

      payload.id = 0;
      response = await fetch("https://app-lts.azurewebsites.net/api/comment", {
        method: "POST", // Use POST for create
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        // alert(
        //   `Serial number is not valid. Correct format could be: TC-00001-RG`
        // );
        throw new Error(`HTTPS error! Status: ${response.status}`);
      } else {
        console.log("Create");
      }

      if (!response.ok) {
        // const errorData = await response.json();
        // alert(
        //   `Serial number is not valid. Correct format could be: TC-00001-RG`
        // );
        throw new Error(`HTTPS error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setWasValidated(true);
  };

  return (
    <div className="appContainer">
      <form
        onSubmit={handleSubmit}
        className={wasValidated ? "was-validated" : ""}
        noValidate
      >
        <div className="mb-3">
          <label className="form-label">Car Id:</label>
          <input
            type="text"
            name="carId"
            className="form-control"
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
            className="form-control"
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
            className="form-control"
            onChange={handleChange}
            required
            // readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const history = useHistory();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  async function populateQuote() {
    const req = await fetch("http://localhost:8080/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        history.replace("/login");
      } else {
        populateQuote();
      }
    }
  }, []);

  async function updateQuote(event) {
    event.preventDefault();
    const req = await fetch("http://localhost:8080/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  }

  return (
    <div>
      <h1>Your Quote: {quote || "No quote"}</h1>
      <form onSubmit={updateQuote}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        ></input>
        <input type="submit" value="Update" />
      </form>
    </div>
  );
};

export default Dashboard;

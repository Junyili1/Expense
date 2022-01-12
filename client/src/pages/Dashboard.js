import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const history = useHistory();

  async function populateQuote() {
    await fetch("/api/quote");
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
  return <h1>Hello World</h1>;
};

export default Dashboard;

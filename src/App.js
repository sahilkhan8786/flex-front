import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
function App() {


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const FetchOrders = async () => {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_BASE_URL + "/api/orders/tryorders", {
          pass: process.env.REACT_APP_PASSWORD,
        })
        .then((response) => {
          // console.log(response.data.filter(el => el.fulfilled !== null))
          console.log(response.data)
          response.data.forEach((elem) => console.log(
            // elem,
            elem.paid_amount,
            elem.payments[0].total_paid_amount,
            elem.order_items[0].full_unit_price
          ))

          setData(response.data)
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    };

    localStorage.getItem("pass") === process.env.REACT_APP_PASSWORD &&
      FetchOrders();
  }, []);

  // console.log(data);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard orders={data} setData={setData} loading={loading} />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

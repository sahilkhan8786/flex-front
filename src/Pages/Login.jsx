import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const [pass, setpass] = useState("");
  const navigate = useNavigate();


  const handleLogin = () => {
    if (pass === '123456789') {
      localStorage.setItem("pass", pass)
      window.location.reload()
    } else {
      alert("Wrong Password")
    }
  };

  if (localStorage.getItem("pass") === '123456789')
    return <Navigate to={"/"} />;

  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-center align-items-center w-100"
    >
      <div>
        <h1>Enter password below</h1>
        <input
          className="form-control mt-2"
          type="password"
          onChange={(e) => setpass(e.target.value)}
        />
        <button
          className="btn btn-primary mt-2 mx-auto d-block"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

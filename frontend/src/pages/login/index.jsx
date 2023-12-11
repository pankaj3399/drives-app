import React, { useEffect, useState } from "react";
import "./index.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "state/api";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [callLoginAPI, { data, error, isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleFromData = async (e) => {
    e.preventDefault();
    await callLoginAPI(formData);
  }

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.data?.message)
    } else if (data) {
      localStorage.setItem('token', data?.data);
      window.location.href = '/';
    }
  }, [data, error, navigate]);

  return (
    <>
      <div className="signup-form">
        <form method="post" onSubmit={handleFromData}>
          <h2>Login Portal</h2>
          <p className="err-text">
            {errorMessage}
          </p>

          <div className="form-group">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              required="required"
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value, });
                setErrorMessage('');
              }}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              required="required"
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrorMessage('');
              }}
            />
          </div>

          <div className="form-group text-center">
            {isLoading ?
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-75">
                <div className="animate-spin rounded-full border-t-2 border-b-2 border-blue-600 h-6 w-6"></div>
              </div> :
              <button type="submit" className="btn btn-success btn-lg btn-block">
                Log in{" "}
              </button>}
          </div>
        </form>
        <div className="text-center" style={{ color: 'black' }}>
          Don't have an account?{" "}
          <NavLink to="/signup">
            <b className="hint-text">Sign Up</b>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Login;

import React, { useEffect, useState } from "react";
import "./index.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useSignupMutation } from "state/api";

const Signup = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [callSignupAPI, { data, error, isLoading }] = useSignupMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage('')
  };

  const PostData = async (e) => {
    e.preventDefault();
    await callSignupAPI(formData);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.data?.message)
    } else if (data) {
      navigate('/login');
    }
  }, [data, error, navigate]);

  return (
    <>
      <div className="signup-form">
        <form method="post" onSubmit={PostData}>
          <h2>Create your account</h2>
          <p className="err-text">
            {errorMessage}
          </p>
          <div className="form-group">
            <input
              type="email"
              class="form-control"
              name="email"
              value={formData.email}
              onChange={handleInput}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              class="form-control"
              name="password"
              value={formData.password}
              onChange={handleInput}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group text-center">
            {isLoading ?
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-75">
                <div className="animate-spin rounded-full border-t-2 border-b-2 border-blue-600 h-6 w-6"></div>
              </div> : <button
                type="submit"
                name="signup"
                id="signup"
                class="btn btn-success btn-lg btn-block"
                value="register"
              >
                Register Now
              </button>
            }
          </div>
        </form>
        <div className="text-center" style={{ color: 'black' }} y>
          Already have an account?{" "}
          <NavLink to="/login">
            <b className="hint-text">Login</b>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Signup;

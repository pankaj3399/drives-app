import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddCustomerMutation } from "state/api";

const AddCustomer = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    address: "",
    email: "",
  });

  const [callAddCustomerAPI, { data, error, isLoading }] = useAddCustomerMutation();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await callAddCustomerAPI(formData);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.data?.message)
    } else if (data) {
      navigate('/customers');
    }
  }, [data, error, navigate]);

  return (
    <div className="container m-2">
      <form className="row g-3" onSubmit={handleFormSubmit}>
        {errorMessage && (
          <div className="mt-2 text-center">
            <div style={{ color: 'red', marginTop: '20px' }} role="alert">
              {errorMessage || "An error occurred while adding the customer."}
            </div>
          </div>
        )}
        <div style={{ padding: '1%', width: '50%' }}>
          <label htmlFor="company" className="form-label">
            Company
          </label>
          <input
            type="text"
            className="form-control"
            id="company"
            placeholder="Company"
            style={{ padding: '25px 10px' }}
            required
            value={formData.company}
            onChange={(e) => {
              setFormData({ ...formData, company: e.target.value });
              setErrorMessage('');
            }
            }
          />
        </div>

        <div style={{ padding: '1%', width: '50%' }}>
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Name"
            style={{ padding: '25px 10px' }}
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrorMessage('');
            }}
          />
        </div>

        <div style={{ padding: '1%', width: '50%' }}>
          <label htmlFor="inputAddress" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            style={{ padding: '25px 10px' }}
            required
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => {
              setFormData({ ...formData, address: e.target.value });
              setErrorMessage('');
            }
            }
          />
        </div>

        <div style={{ padding: '1%', width: '50%' }}>
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail4"
            required
            placeholder="Enter your email"
            style={{ padding: '25px 10px' }}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrorMessage('');
            }
            }
          />
        </div>

        <div className="text-center" style={{ marginTop: '50px' }}>
          <button type="submit" className="btn" style={{ backgroundColor: '#3498db', padding: '12px 20px' }} disabled={isLoading} >
            {isLoading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Add new customer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;

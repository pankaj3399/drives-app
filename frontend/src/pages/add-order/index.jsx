import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCustomersQuery, useAddOrderMutation } from "state/api";

const AddCustomer = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    devices: "",
    collectionDate: "",
  });

  const [callAddOrderAPI, { data, error, isLoading }] = useAddOrderMutation();
  const { data: customersData, isLoading: customersLoading } = useGetCustomersQuery({
    page: 1,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await callAddOrderAPI({ ...formData, customerId });
  };

  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const currentDateFormatted = `${year}-${month}-${day}`;
    setCurrentDate(currentDateFormatted);
  }, []);

  useEffect(() => {
    if (customersData?.data?.customers) {
      setCustomers(customersData.data.customers);
    }
  }, [customersData])

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.data?.message)
    } else if (data) {
      navigate('/orders');
    }
  }, [data, error, navigate]);

  return (
    <div className="container m-2">
      <form className="row g-3" onSubmit={handleFormSubmit}>
        {errorMessage && (
          <div className="mt-2 text-center">
            <div style={{ color: 'red', marginTop: '20px' }} role="alert">
              {errorMessage || "An error occurred while adding the order."}
            </div>
          </div>
        )}

        <div className="col-lg-6 col-md-9 col-sm-12 form-input-responsive">
          <label htmlFor="customer" className="form-label" style={{ marginBottom: '0px', marginTop: '5px' }}>
            Customer
          </label>
          <Autocomplete
            id="customer"
            options={customers || []}
            loading={customersLoading}
            getOptionLabel={(option) => option.email || option.name}
            value={formData.customer}
            onChange={(event, newValue) => {
              setCustomerId(newValue?._id || '')
              setErrorMessage('');
            }}
            renderInput={(params) => <TextField {...params} margin="normal" variant="outlined" />}
          />
        </div>

        <div className="col-lg-6 col-md-9 col-sm-12 form-input-responsive">
          <label htmlFor="devices" className="form-label">
            Devices
          </label>
          <input
            type="number"
            className="form-control"
            id="devices"
            style={{ padding: '25px 10px', marginTop: '5px' }}
            placeholder="Devices"
            required
            value={formData.devices}
            onChange={(e) => {
              setFormData({ ...formData, devices: e.target.value });
              setErrorMessage('');
            }}
          />
        </div>

        <div className="col-lg-6 col-md-9 col-sm-12 form-input-responsive">
          <label htmlFor="inputAddress" className="form-label">
            Collection Date
          </label>
          <input
            type="date"
            className="form-control"
            id="inputAddress"
            min={currentDate}
            style={{ padding: '25px 10px', marginTop: '2px' }}
            required
            value={formData.collectionDate}
            onChange={(e) => {
              setFormData({ ...formData, collectionDate: e.target.value });
              setErrorMessage('');
            }}
          />
        </div>

        <div className="col-12 text-center" style={{ marginTop: '50px' }}>
          <button type="submit" className="btn" style={{ backgroundColor: '#3498db', padding: '12px 20px' }} disabled={isLoading}>
            {isLoading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Add new order"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;

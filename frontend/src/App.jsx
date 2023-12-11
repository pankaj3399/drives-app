import React, { useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { themeSettings } from 'theme';
import Layout from 'pages/layout';
import Dashboard from 'pages/dashboard';
import Customers from 'pages/customers';
import Orders from 'pages/orders';
import Scans from 'pages/scan';
import Check from 'pages/check';
import AddCustomer from 'pages/add-customer';
import AddOrder from 'pages/add-order';
import CustomerView from 'pages/public';
import Login from 'pages/login';
import Signup from 'pages/signUp';
import Settings from 'pages/settings';

function App() {
  const [validateUser, setValidateUser] = useState(true);
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const token = localStorage?.getItem('token');

  const validateToken = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:3001'}/auth/check-auth`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        setValidateUser(true);
      } else {
        setValidateUser(false);
      }
    } catch (error) {
      console.error('Error token validating token:', error);
      setValidateUser(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setValidateUser(false);
    }
    validateToken();
  }, [])

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={validateUser ? <Layout /> : <Login />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/scans" element={<Scans />} />
              <Route path="/check" element={<Check />} />
              <Route path="/setting" element={<Settings />} />
              <Route path='/add-customer' element={<AddCustomer />} />
              <Route path='/add-order' element={<AddOrder />} />
            </Route>
            <Route path="/public" element={<CustomerView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<Signup />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

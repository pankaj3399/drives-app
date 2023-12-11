import React, { useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useGetCustomersQuery, useUpdateCustomerMutation } from 'state/api';

const Settings = () => {
  const { data: customers, isLoading, refetch } = useGetCustomersQuery({
    page: 1
  });
  const [callUpdateCustomerAPI, { data: updatedData, isLoading: updateDataLoading }] = useUpdateCustomerMutation();

  const handleYes = async (id) => {
    await callUpdateCustomerAPI({ id, emailSendStatus: true });
  }

  const handleNo = async (id) => {
    await callUpdateCustomerAPI({ id, emailSendStatus: false });
  }

  useEffect(() => {
    refetch();
  }, [customers])

  useEffect(() => {
    refetch();
  }, [updatedData])

  return (
    <Box m="1.5rem 2.5rem">
      <div className='mt-4 pt-2 pb-0'>
        <label>Email settings</label>
      </div>

      {isLoading || updateDataLoading ? (
        <CircularProgress />
      ) : (
        <table className="table mt-2">
          <thead>
            <tr>
              <th scope="col">Customer Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers?.data?.customers?.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.email}</td>
                <td>
                  <Button onClick={(e) => {
                    e.preventDefault();
                    handleYes(customer._id);
                  }} variant="contained" color="success" className="me-2" disabled={customer.emailSendStatus ? true : false}>
                    Yes
                  </Button>
                  <Button onClick={(e) => {
                    e.preventDefault();
                    handleNo(customer._id);
                  }} variant="contained" color="error" disabled={customer.emailSendStatus ? false : true}>
                    No
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  );
};

export default Settings;

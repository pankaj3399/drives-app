import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, useTheme } from '@mui/material';
import { useGetCustomersQuery, useUpdateCustomerMutation } from 'state/api';
import Header from 'components/Header';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const { data: customers, isLoading, refetch } = useGetCustomersQuery({
    page: 1,
    email,
  });
  const [callUpdateCustomerAPI, { data, error, isLoading: isUpdateLoading }] = useUpdateCustomerMutation();
  const [formData, setFormData] = useState({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (customer) => {
    setErrorMessage('')
    setFormData(customer);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setFormData(null);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.data?.message)
    } else if (data) {
      refetch();
      handleModalClose();
    }
  }, [error, data]);

  const handleUpdateCustomer = async () => {
    await callUpdateCustomerAPI({
      ...formData,
      id: formData._id,
    });
  };

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 0.5,
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0.4,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.4,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.4,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 0.4,
    },
    {
      field: 'edit',
      headerName: 'Action',
      flex: 0.2,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="success"
          size="medium"
          onClick={() => handleEditClick(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    refetch();
  }, [customers])
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" />
      <div className="row g-3 align-items-center">
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="mt-4 pt-2">
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: '#3498db', padding: '12px 25px' }}
              onClick={() => navigate('/add-customer')}
            >
              Add Customer
            </button>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12">
          <TextField
            label="Email"
            value={email}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
      </div>
      <div className='mt-4 pt-2 pb-0'>
        <label>List of Customers</label>
      </div>
      <Box
        mt="20px"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: 'none',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}>
        <DataGrid
          loading={isLoading || !customers?.data?.customers}
          getRowId={(row) => row._id}
          rows={customers?.data?.customers || []}
          columns={columns}
        />
      </Box>
      <Dialog open={isEditModalOpen} onClose={handleModalClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          {formData && (
            <form>
              {errorMessage && (
                <div className="mt-2 text-center">
                  <div style={{ color: 'red', marginTop: '0px' }} role="alert">
                    {errorMessage || "An error occurred while updating the customer."}
                  </div>
                </div>
              )}
              <TextField
                label="Company"
                value={formData.company}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setFormData({ ...formData, company: e.target.value });
                }}
              />
              <TextField
                label="Name"
                value={formData.name}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
              />
              <TextField
                label="Address"
                value={formData.address}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                }}
              />
              {
                !isUpdateLoading && (<Button variant="contained" color="success" onClick={handleUpdateCustomer}>
                  Update Customer
                </Button>)
              }

            </form>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Customers;
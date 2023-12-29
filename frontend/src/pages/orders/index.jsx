import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, useTheme } from '@mui/material';
import Header from 'components/Header';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery, useUpdateOrderMutation, useSendEmailMutation } from 'state/api';

const Orders = () => {
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [callUpdateOrderAPI, { data: updatedData, error, isLoading: isUpdateLoading }] = useUpdateOrderMutation();
  const [callSendEmailMutation] = useSendEmailMutation();
  const { data, isLoading, refetch } = useGetOrdersQuery({
    page: 1
  });

  const handleUpdateOrder = async () => {
    let data = {
      devices: formData.devices,
      collectionDate: formData.collectionDate,
      id: formData._id,
    };
    if (formData.completionDate) {
      data = {
        ...data,
        completionDate: formData.completionDate,
      }
    }
    await callUpdateOrderAPI(data);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.data?.message)
    } else if (updatedData) {
      refetch();
      handleModalClose();
    }
  }, [error, updatedData]);

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setFormData(null);
  };

  const handleEditClick = (order) => {
    setErrorMessage('')
    setFormData(order);
    setIsEditModalOpen(true);
  };

  const handleMarkCompletedClick = async (order) => {
    await callUpdateOrderAPI({
      id: order._id,
      completionDate: new Date(),
    });
  };

  const handleUnMarkCompletedClick = async (order) => {
    await callUpdateOrderAPI({
      id: order._id,
      completionDate: null,
    });
  };

  const handleSendEmail = async (order) => {
    console.log('hi', order);
    await callSendEmailMutation({orderId: order._id, customerId: order.customer._id});
  };

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 0.5,
    },
    {
      field: 'customerId',
      headerName: 'Customer',
      flex: 0.6,
    },
    {
      field: 'devices',
      headerName: 'Devices',
      flex: 0.2,
    },
    {
      field: 'markCompleted',
      headerName: 'Completed',
      flex: 0.4,
      renderCell: (params) => (
        <>
          {
            params?.row?.completionDate ? <Button
              variant="contained"
              color="warning"
              size="medium"
              onClick={() => handleUnMarkCompletedClick(params.row)}
              // sx={{whiteSpace: 'break-spaces'}}
            >
              Mark as Uncompleted
            </Button> : <Button
              variant="contained"
              color="success"
              size="medium"
              onClick={() => handleMarkCompletedClick(params.row)}
              // sx={{whiteSpace: 'break-spaces'}}
            >
              Mark as Completed
            </Button>
          }
        </>
      ),
    },
    {
      field: 'sendEmail',
      headerName: 'Send Email',
      flex: 0.4,
      renderCell: (params) => (
        <>
          {
             <Button
              variant="contained"
              color="success"
              size="medium"
              onClick={() => handleSendEmail(params.row)}
              disabled={!params?.row?.completionDate}
              // sx={{whiteSpace: 'break-spaces'}}
            >
              Send Email
            </Button>
          }
        </>
      ),
    },
    {
      field: 'collectionDate',
      headerName: 'Collection Date',
      flex: 0.4,
    },
    {
      field: 'authCode',
      headerName: 'Auth Code',
      flex: 0.3,
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

  const onEmailChangeHandler = (e) => {
    const partialEmail = e.target.value.toLowerCase();
    const filteredOrders = orders.filter((order) =>
      order.customerId.toLowerCase().includes(partialEmail)
    );
    setFilteredOrders(filteredOrders);
  };

  useEffect(() => {
    refetch();
    if (data?.data?.orders) {
      const newOrders = [];
      for (let index = 0, len = data?.data?.orders.length; index < len; index++) {
        const order = data?.data?.orders[index];
        const customerId = order?.customer?.email || order?.customer?.name || order?.orderId;
        newOrders.push({
          ...order,
          customerId,
          collectionDate: order?.collectionDate?.split('T')[0],
          completionDate: order?.completionDate?.split('T')[0],
        })
      }
      setOrders(newOrders);
      setFilteredOrders(newOrders);
    }
  }, [data]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Orders" />
      <div className="row g-3 align-items-center">
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="mt-4 pt-2">
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: '#3498db', padding: '12px 25px' }}
              onClick={() => navigate('/add-order')}
            >
              Add Order
            </button>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12">
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={onEmailChangeHandler}
          />
        </div>
      </div>
      <div className='mt-4 pt-2 pb-0'>
        <label>List of Orders</label>
      </div>
      <Box
        mt="10px"
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
          loading={isLoading || !filteredOrders}
          getRowId={(row) => row._id}
          rows={filteredOrders || []}
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
                    {errorMessage || "An error occurred while updating the order."}
                  </div>
                </div>
              )}
              <TextField
                label="Devices"
                value={formData.devices}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setFormData({ ...formData, devices: e.target.value });
                }}
              />
              <TextField
                label="Collection date"
                type="date"
                value={formData.collectionDate}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setFormData({ ...formData, collectionDate: e.target.value });
                }}
              />
              <TextField
                label="Completion date"
                type="date"
                value={formData.completionDate}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setFormData({ ...formData, completionDate: e.target.value });
                }}
              />
              {!isUpdateLoading && (
                <Button variant="contained" color="success" onClick={handleUpdateOrder}>
                  Update Order
                </Button>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default Orders;

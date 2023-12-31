import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, useTheme } from '@mui/material';
import { useCheckScanQuery, useGetScansQuery, useUpdateScanDeletionMutation } from 'state/api';
import Header from 'components/Header';
import { DataGrid } from '@mui/x-data-grid';
import './index.css';
const columns = [
  {
    field: 'serialNumber',
    headerName: 'serialNumber',
    flex: 0.4,
  },
  {
    field: 'orderId',
    headerName: 'orderId',
    flex: 0.5,
  },
  {
    field: 'customer',
    headerName: 'Customer',
    flex: 0.4,
  },
  {
    field: 'deletionStatus',
    headerName: 'Deletion status',
    flex: 0.4,
  },
];

const Check = () => {
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [scanData, setScanData] = useState([]);
  const { error, isLoading, refetch } = useCheckScanQuery({
    serialNumber
  }, {
    enabled: false,
  });
  const [callUpdateScanAPI, { error: updateError, isLoading: updateLoading }] = useUpdateScanDeletionMutation();
  const [scans, setScans] = useState([]);
  const { data: scansData, isLoading: isScansLoading, refetch: refetchScansData } = useGetScansQuery();


  useEffect(() => {
    refetchScansData();
    if (scansData?.data) {
      const newScans = [];
      for (let index = 0, len = scansData?.data.length; index < len; index++) {
        const scan = scansData?.data[index];
        const customer = scan?.customerInfo?.email || scan?.customerInfo?.name;
        newScans.push({
          ...scan,
          customer,
        })
      }
      setScans(newScans);
    }
  }, [scansData]);

  const handleSearch = async () => {
    try {
      const checkResult = await refetch({
        serialNumber
      });
      if (checkResult?.data?.data) {
        setScanData([checkResult?.data?.data]);
      } else {
        setErrorMessage(error?.data?.message);
      }
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(error?.data?.message || 'An error occurred while searching.');
      setScanData([]);
    }
  };

  useEffect(() => {
    if (updateError) {
      setErrorMessage(updateError?.data?.message || 'An error occurred while deleting the scan.');
    }
  }, [updateError])

  const handleDeleteStatus = async (scanId, status) => {
    await callUpdateScanAPI({ id: scanId, status });
    handleSearch();
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Checks" />
      {errorMessage && (
        <div className="mt-2 text-center">
          <div style={{ color: 'red', marginTop: '20px' }} role="alert">
            {errorMessage || "An error occurred."}
          </div>
        </div>
      )}
      <div className="col-lg-6 col-md-9 col-sm-12 form-input-responsive">
        <label htmlFor="serialNumber" className="form-label">
          Serial Number
        </label>
        <input
          type="text"
          className="form-control"
          id="serialNumber"
          placeholder="Serial Number"
          required
          value={serialNumber}
          onChange={(e) => {
            setSerialNumber(e.target.value);
            setErrorMessage('');
            setScanData([]);
          }}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary mt-3 mb-3"
        onClick={handleSearch}
      >
        Search
      </button>
      <table className="table mt-2">
        <thead>
          <tr>
            <th scope="col">Serial Number</th>
            <th scope="col">Deletion Status</th>
            <th scope="col">Customer</th>
            <th scope="col">Order Id</th>
          </tr>
        </thead>
        <tbody>
          {!(isLoading || !scanData || !scanData.length) && (
            <>
              {scanData?.map((scan) => (
                <tr key={scan._id}>
                  <td>{scan.serialNumber}</td>
                  <td>
                    {scan.deletionStatus === 'not started' ? (
                      <>
                        {
                          updateLoading ? <CircularProgress /> : <>
                            <Button onClick={(e) => {
                              e.preventDefault();
                              handleDeleteStatus(scan._id, 'deleted');
                            }} variant="contained" color="warning" className="me-2">
                              Successfully deleted
                            </Button>
                            <Button onClick={(e) => {
                              e.preventDefault();
                              handleDeleteStatus(scan._id, 'failed deletion');
                            }} variant="contained" color="warning" className="me-2">
                              Deletion failed
                            </Button>
                          </>
                        }
                      </>
                    ) : <span style={{ color: scan.deletionStatus === 'deleted' ? 'green' : 'red' }}>
                      {scan.deletionStatus}
                      <span style={{ margin: '0px 10px' }}>
                        {
                          scan.deletionStatus !== 'deleted' ?
                            <Button onClick={(e) => {
                              e.preventDefault();
                              handleDeleteStatus(scan._id, 'deleted');
                            }} variant="contained" color="warning" className="me-2">
                              Successfully deleted
                            </Button>
                            : <Button onClick={(e) => {
                              e.preventDefault();
                              handleDeleteStatus(scan._id, 'failed deletion');
                            }} variant="contained" color="warning" className="me-2">
                              Deletion failed
                            </Button>
                        }
                      </span>
                    </span>
                    }
                  </td>
                  <td>{scan?.customerInfo?.name}</td>
                  <td>{scan.orderId}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      <div className='mt-2 pt-2 pb-0'>
          <label>List of Scans</label>
        </div>
        <Box
          mt="16px"
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
            loading={isLoading || !scans}
            getRowId={(row) => row._id}
            rows={scans || []}
            columns={columns}
          />
        </Box>
    </Box>
  );
};

export default Check;
import React, { useEffect } from "react";
import "./index.css";
import { useGetDashboardDataQuery } from "state/api";

const Dashboard = () => {
  const { data: databaseData, isLoading, refetch } = useGetDashboardDataQuery();

  useEffect(() => {
    console.log(databaseData)
    refetch();
  }, [databaseData]);
  
  return (
    <main className="main-container p-5 container-fluid">
      {
        isLoading ? <div className="text-center">Loading...</div> : <>
          <div className="main-cards row pt-4">
            <div className="card col-lg-3 col-md-4 col-lg-3 mb-3 shadow">
              <div className="card-inner text-center">
                <h3>Registered Customers</h3>
              </div>
              <h1 className="text-center">{databaseData?.data?.customers || 0}</h1>
            </div>
            <div className="card col-lg-3 col-md-4 col-lg-3 mb-3 shadow">
              <div className="card-inner text-center">
                <h3>Drives Scanned</h3>
              </div>
              <h1 className="text-center">{databaseData?.data?.scannedDevices || 0}</h1>
            </div>
            <div className="card col-lg-3 col-md-4 col-lg-3 mb-3 shadow">
              <div className="card-inner text-center">
                <h3>Drives Deleted</h3>
              </div>
              <h1 className="text-center">{databaseData?.data?.deletedDevices || 0}</h1>
            </div>
            <div className="card col-lg-3 col-md-4 col-lg-3 mb-3 shadow">
              <div className="card-inner text-center">
                <h3>Pending Drives</h3>
              </div>
              <h1 className="text-center">{databaseData?.data?.pendingDevices || 0}</h1>
            </div>
            <div className="card col-lg-3 col-md-4 col-lg-3 mb-3 shadow">
              <div className="card-inner text-center">
                <h3>Pending Orders</h3>
              </div>
              <h1 className="text-center">{databaseData?.data?.pendingOrders || 0}</h1>
            </div>
            <div className="card col-lg-3 col-md-4 col-lg-3 mb-3 shadow">
              <div className="card-inner text-center">
                <h3>Completed Orders</h3>
              </div>
              <h1 className="text-center">{databaseData?.data?.completedOrders || 0}</h1>
            </div>
          </div>
        </>
      }

    </main>
  );
};

export default Dashboard;

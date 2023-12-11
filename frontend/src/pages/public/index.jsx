import React, { useEffect, useState } from "react";
import "./index.css";
import html2pdf from "html2pdf.js";
import { useCheckDeviceMutation } from "state/api";

const CustomerView = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    orderId: "",
    authCode: "",
  });
  const [callCheckDeviceAPI, { data: checkData, error, isLoading }] =
    useCheckDeviceMutation();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await callCheckDeviceAPI(formData);
  };

  const handleDownload = () => {
    const content = document.getElementById("pdfContent");

    if (content) {
      const pdfOptions = {
        margin: 10,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(content).set(pdfOptions).save();
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.data?.message);
    }
  }, [checkData, error]);
  return (
    <>
      <div>
        <div className="calc container pb-5 mt-5" >
          <form className="row g-3" onSubmit={handleFormSubmit}>
            {errorMessage && (
              <div className="mt-2 text-center">
                <div style={{ color: "red", marginTop: "20px" }} role="alert">
                  {errorMessage || "An error occurred while adding the order."}
                </div>
              </div>
            )}
            <div className="col-lg-6 col-md-9 col-sm-12 form-input-responsive">
              <label htmlFor="orderId" className="form-label">
                Order ID
              </label>
              <input
                type="text"
                className="form-control"
                id="orderId"
                placeholder="Order Id"
                required
                value={formData.orderId}
                onChange={(e) => {
                  setFormData({ ...formData, orderId: e.target.value });
                  setErrorMessage("");
                }}
              />
            </div>
            <div className="col-lg-6 col-md-9 col-sm-12 form-input-responsive">
              <label htmlFor="authCode" className="form-label">
                Auth Code
              </label>
              <input
                type="number"
                className="form-control"
                id="authCode"
                placeholder="Auth Code"
                required
                value={formData.authCode}
                onChange={(e) => {
                  setFormData({ ...formData, authCode: e.target.value });
                  setErrorMessage("");
                }}
              />
            </div>
            <div className="text-center" style={{ marginTop: "25px" }}>
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "#3498db", width: "350px" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Check Progress and Details"
                )}
              </button>
            </div>
          </form>
          <div className="text-center mt-5">
            Devices Deletion Progress
            <br />
            {checkData?.data && (
              <>
                <progress
                  max="100"
                  value={
                    ((checkData?.data?.deletedDevices /
                      (checkData?.data?.totalDevices || 1)) *
                      100)?.toFixed(2)
                  }
                  style={{ width: "400px", height: "40px" }}
                ></progress>
                <div>
                  {
                    `${((checkData?.data?.deletedDevices /
                      (checkData?.data?.totalDevices || 1)) *
                      100)?.toFixed(2)} %`
                  }
                </div>
              </>
            )}
          </div>
        </div>
        <div className="container pb-4">
          {
            checkData?.data && (
              <>
                <div className="row pb-4">
                  <button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: '#3498db', color: 'white', width: '200px' }}
                    onClick={handleDownload}
                    disabled={isLoading || !checkData?.data}
                  >
                    Download PDF
                  </button>
                </div>
                <span id="pdfContent">
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "auto",
                      color: "white",
                    }}
                  >
                    <table style={{ width: "100%" }}>
                      <thead>
                        <th>Collection Date</th>
                        <th>Completion Date</th>
                        <th>Devices</th>
                      </thead>
                      <tbody style={{
                        color: "black",
                      }}>
                        <td>{checkData?.data?.order?.collectionDate?.split("T")[0]}</td>
                        <td>{checkData?.data?.order?.completionDate?.split("T")[0]}</td>
                        <td>{checkData?.data?.order?.devices}</td>
                      </tbody>
                    </table>
                  </div>

                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "auto",
                      color: "white",
                    }}
                  >
                    <table style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Serial Number</th>
                          <th>Deletion Status</th>
                          <th>Deletion Date</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: "black" }}>
                        {checkData?.data?.drives?.map((drive) => (
                          <tr key={drive?._id}>
                            <td>{drive?.serialNumber}</td>
                            <td>{drive?.deletionStatus}</td>
                            <td>{drive?.deletionDate?.split("T")[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </span>
              </>
            )
          }

        </div>
      </div>
    </>
  );
};

export default CustomerView;

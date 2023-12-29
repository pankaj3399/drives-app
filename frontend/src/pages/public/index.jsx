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
  const [
    callCheckDeviceAPI,
    { data: checkData, error, isLoading },
  ] = useCheckDeviceMutation();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await callCheckDeviceAPI(formData);
    console.log(checkData);
  };

  const handleDownload = async () => {
    const visibleContent = document.getElementById("pdfContent");
    const hiddenContent = document.getElementById("hiddenPdfContent");
    const hiddenContent2 = document.getElementById("hiddenPdfContent2");
    const mergeContent = `
      ${hiddenContent.innerHTML}
      ${visibleContent.innerHTML}
      ${hiddenContent2.innerHTML}
    `;

    if (visibleContent && hiddenContent) {
      const pdfOptions = {
        margin: 10,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(mergeContent).set(pdfOptions).save();
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.data?.message);
    }
  }, [checkData, error]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#87CEEB",
          padding: "10px 20px",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <img src="logo.png" width={"60px"} height={"60px"} alt="Logo" />
        </div>
      </header>
      <div>
        <p style={{ margin: "50px" }}>
          <strong style={{ textAlign: "center" }}>
            Willkommen bei WipeTrace von Gull-IT
          </strong>
          <br />
          Geben Sie bitte die von Gull-IT Order-ID und Auth Code ein, um den
          aktuellen Status Ihrer Löschbeauftragung einzusehen. Mit Abschluss des
          Auftrags erhalten Sie die Möglichkeit, eine Übersicht der gelöschten
          Seriennummern herunterzuladen.
        </p>
        <div className="calc container pb-5 mt-5">
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
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
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
                  value={(
                    (checkData?.data?.deletedDevices /
                      (checkData?.data?.totalDevices || 1)) *
                    100
                  )?.toFixed(2)}
                  style={{ width: "400px", height: "40px" }}
                ></progress>
                <div>
                  {`${(
                    (checkData?.data?.deletedDevices /
                      (checkData?.data?.totalDevices || 1)) *
                    100
                  )?.toFixed(2)} %`}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="container pb-4">
          {checkData?.data && (
            <>
              <div className="row pb-4">
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: "#3498db",
                    color: "white",
                    width: "200px",
                  }}
                  onClick={handleDownload}
                  disabled={isLoading || !checkData?.data}
                >
                  Download PDF
                </button>
              </div>
              {/* Hidden content for additional columns */}
              <div
                id="hiddenPdfContent"
                style={{
                  borderRadius: "8px",
                  overflow: "auto",
                  color: "white",
                  display: "none",
                }}
              >
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ color: "white" }}>Order ID</th>
                      <th style={{ color: "white" }}>Auth Code</th>
                      <th style={{ color: "white" }}>Progress</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "black" }}>
                    <tr>
                      <td>{checkData?.data?.order?._id}</td>
                      <td>{checkData?.data?.order?.authCode}</td>
                      <td>{`${(
                        (checkData?.data?.deletedDevices /
                          (checkData?.data?.totalDevices || 1)) *
                        100
                      )?.toFixed(2)} %`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <span id="pdfContent">
                <div
                  style={{
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
                    <tbody
                      style={{
                        color: "black",
                      }}
                    >
                      <td>
                        {checkData?.data?.order?.collectionDate?.split("T")[0]}
                      </td>
                      <td>
                        {checkData?.data?.order?.completionDate?.split("T")[0]}
                      </td>
                      <td>{checkData?.data?.order?.devices}</td>
                    </tbody>
                  </table>
                </div>

                <div
                  style={{
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
                          <td>
                            {drive?.datetime
                              ? new Date(drive.datetime).toDateString()
                              : drive?.deletionDate
                              ? new Date(drive?.deletionDate).toDateString()
                              : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div id="hiddenPdfContent2">
                  {checkData?.data?.drives?.map((drive) => (
                    <div key={drive?._id}>
                      <p> Serial Number: {drive?.serialNumber}</p>
                      <p>Info :{drive?.info}</p>
                      <p style={{fontSize: '14px'}}>
                        {drive?.fingerprint}
                      </p>
                    </div>
                  ))}
                </div>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "black",
          padding: "2px",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <p style={{ color: "white", marginTop: "5px" }}>
          <a
            href="https://gull-it.de"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", marginRight: "10px" }}
          >
            Link to gull-it.de
          </a>
          <a
            href="https://shop.gull-it.de"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", marginRight: "10px" }}
          >
            Link to shop.gull-it.de
          </a>
          <a
            href="https://gull-it.de/impressum/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white" }}
          >
            Impressum
          </a>
        </p>
      </footer>
    </div>
  );
};

export default CustomerView;

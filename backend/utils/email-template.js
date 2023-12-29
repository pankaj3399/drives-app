const completeOrderEmailTemplate = ({
  customerName,
  orderId,
  totalDrives,
  drivesDeleted,
  failedDeletion,
}) => {
  return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Completion</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #3498db;
          }
          p {
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Order Completion</h1>
          <p>Hi ${customerName},</p>
          <p>Your order with Order ID: ${orderId} has been successfully completed.</p>
          <p>Total drives: ${totalDrives}</p>
          <p>Succesfully Deleted:${drivesDeleted} </p>
          <p>Failed Deletion:${failedDeletion}</p>
        </div>
      </body>
    </html>
   `;
};
module.exports = completeOrderEmailTemplate;

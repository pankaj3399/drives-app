import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const token = localStorage?.getItem("token");

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:3001",
    headers: {
      Authorization: token ? token : undefined,
      "Content-Type": "application/json",
    },
  }),
  reducerPath: "adminApi",
  tagTypes: ["User", "Customers", "Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page, customerId }) => ({
        url: customerId
          ? `/admin/get-all-orders?page=${page || 1}&customerId=${customerId}`
          : `/admin/get-all-orders?page=${page || 1}`,
        method: "GET",
      }),
    }),
    addOrder: builder.mutation({
      query: (data) => ({
        url: `/admin/create-order`,
        method: "POST",
        body: data,
      }),
    }),
    getScans: builder.query({
      query: () => ({
        url: `/admin/get-all-scans`,
        method: "GET",
      }),
    }),
    getCustomers: builder.query({
      query: ({ page, email }) => ({
        url:
          email && email !== ""
            ? `/admin/get-all-customers?page=${page || 1}&email=${email}`
            : `/admin/get-all-customers?page=${page || 1}`,
        method: "GET",
      }),
    }),
    getDashboardData: builder.query({
      query: () => ({
        url: `/admin/dashboard-data`,
        method: "GET",
      }),
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/admin/update-customer/${id}`,
        method: "PATCH",
        body: rest,
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/admin/update-order/${id}`,
        method: "PATCH",
        body: rest,
      }),
    }),
    addCustomer: builder.mutation({
      query: (data) => ({
        url: `/admin/create-customer`,
        method: "POST",
        body: data,
      }),
    }),
    addScan: builder.mutation({
      query: (data) => ({
        url: `/admin/new-scan`,
        method: "POST",
        body: data,
      }),
    }),
    updateScanDeletion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/delete-scan/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    checkDevice: builder.mutation({
      query: (data) => ({
        url: `/customer/check-device`,
        method: "POST",
        body: data,
      }),
    }),
    checkScan: builder.query({
      query: (query) => ({
        url: `/admin/get-scan?serialNumber=${query?.serialNumber}`,
        method: "GET",
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `/auth/login`,
        method: "POST",
        body: { email, password },
      }),
    }),
    signup: builder.mutation({
      query: ({ email, password }) => ({
        url: `/auth/signup`,
        method: "POST",
        body: { email, password },
      }),
    }),
    sendEmail: builder.mutation({
      query: (body) => ({
        url: "/admin/send-email",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetScansQuery,
  useGetCustomersQuery,
  useAddOrderMutation,
  useUpdateCustomerMutation,
  useUpdateOrderMutation,
  useGetDashboardDataQuery,
  useAddCustomerMutation,
  useAddScanMutation,
  useUpdateScanDeletionMutation,
  useCheckDeviceMutation,
  useCheckScanQuery,
  useLoginMutation,
  useSignupMutation,
  useSendEmailMutation,
} = apiSlice;

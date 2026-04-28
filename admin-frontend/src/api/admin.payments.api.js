import api from "./axios";

/* =========================
   ADMIN PAYMENTS API
========================= */

export const getAdminPayments = async () => {
  const res = await api.get("/admin/payments");
  return res.data;
};

export const getAdminPaymentDetails = async (id) => {
  const res = await api.get(`/admin/payments/${id}`);
  return res.data;
};

export const getAdminPaymentStats = async () => {
  const res = await api.get("/admin/payments/stats");
  return res.data;
};
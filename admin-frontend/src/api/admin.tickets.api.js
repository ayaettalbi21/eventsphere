import api from "./axios";

export const getAdminTickets = async () => {
  const res = await api.get("/admin/tickets");
  return res.data;
};

export const getAdminTicketById = async (id) => {
  const res = await api.get(`/admin/tickets/${id}`);
  return res.data;
};

export const replyToTicket = async (id, message) => {
  const res = await api.post(`/admin/tickets/${id}/reply`, {
    message,
  });
  return res.data;
};

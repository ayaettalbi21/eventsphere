import api from "./axios";

export const getEventsCount = async () => {
  const res = await api.get("/admin/stats/events-count");
  return res.data;
};

export const getClientsCount = async () => {
  const res = await api.get("/admin/stats/clients-count");
  return res.data;
};

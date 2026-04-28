import api from "./axios";

// ==========================
// CREATE EVENT (ADMIN)
// ==========================
export const createAdminEvent = (formData) => {
  return api.post("/admin/events", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==========================
// UPDATE EVENT (ADMIN)
// ==========================
export const updateAdminEvent = (id, formData) => {
  return api.put(`/admin/events/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==========================
// GET ALL EVENTS (ADMIN)
// ==========================
export const getAdminEvents = async () => {
  const res = await api.get("/admin/events");
  return res.data;
};

// ==========================
// CANCEL EVENT (ADMIN)
// ==========================
export const cancelAdminEvent = async (id) => {
  const res = await api.put(`/admin/events/${id}/cancel`);
  return res.data;
};

// ==========================
// GET EVENT RESERVATIONS (ADMIN) ✅ AJOUTÉ
// ==========================
export const getEventReservations = async (eventId) => {
  const res = await api.get(`/admin/events/${eventId}/reservations`);
  return res.data;
};

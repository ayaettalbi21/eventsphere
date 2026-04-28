import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import AdminLayout from "../../components/admin/AdminLayout";
import EventTable from "../../components/admin/EventTable";
import { getAdminEvents, cancelAdminEvent } from "../../api/admin.events.api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAdminEvents();
      // backend: { success, data }
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des événements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCancel = async (eventId) => {
    await cancelAdminEvent(eventId);
    fetchEvents();
  };

  return (
    <AdminLayout>
      <Typography variant="h4" mb={3}>
        Gestion des événements
      </Typography>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <EventTable events={events} onCancel={handleCancel} />
      )}
    </AdminLayout>
  );
};

export default Events;

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import ReservationTable from "../../components/admin/ReservationTable";
import { getEventReservations } from "../../api/admin.events.api";

const EventReservations = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await getEventReservations(id);
        setReservations(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des réservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [id]);

  return (
    <AdminLayout>
      <Box mb={3} display="flex" justifyContent="space-between">
        <Typography variant="h4">
          Réservations de l’événement
        </Typography>

        <Button variant="outlined" onClick={() => navigate("/admin/events")}>
          Retour aux événements
        </Button>
      </Box>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <ReservationTable reservations={reservations} />
      )}
    </AdminLayout>
  );
};

export default EventReservations;

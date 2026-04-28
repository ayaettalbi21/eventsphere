import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

import AdminLayout from "../../components/admin/AdminLayout";
import TicketTable from "../../components/admin/TicketTable";
import { getAdminTickets } from "../../api/admin.tickets.api";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getAdminTickets();
        setTickets(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <AdminLayout>
      <Box mb={3}>
        <Typography variant="h4">Tickets support</Typography>
        <Typography variant="body2" color="text.secondary">
          Gestion des demandes client (lecture + réponse).
        </Typography>
      </Box>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && <TicketTable tickets={tickets} />}
    </AdminLayout>
  );
};

export default Tickets;

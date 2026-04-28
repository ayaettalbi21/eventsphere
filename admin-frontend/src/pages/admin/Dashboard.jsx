import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import EventIcon from "@mui/icons-material/Event";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import AdminLayout from "../../components/admin/AdminLayout";
import { getAdminEvents } from "../../api/admin.events.api";
import { getAdminTickets } from "../../api/admin.tickets.api";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, ticketsRes] = await Promise.all([
          getAdminEvents(),
          getAdminTickets(),
        ]);

        setEvents(eventsRes.data || []);
        setTickets(ticketsRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <CircularProgress />
      </AdminLayout>
    );
  }

  const openTickets = tickets.filter(t => t.STATUS === "OPEN");
  const cancelledEvents = events.filter(e => e.STATUS === "CANCELLED");

  const recentTickets = tickets.slice(0, 3);
  const recentEvents = events.slice(0, 3);

  return (
    <AdminLayout>
      {/* TITRE */}
      <Typography variant="h4" mb={0.5}>
        Dashboard
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Vue rapide de l’activité administrative
      </Typography>

      {/* ALERTES */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <WarningAmberIcon color="warning" />
          <Typography fontWeight={700}>Alertes</Typography>
        </Stack>

        {openTickets.length === 0 && cancelledEvents.length === 0 ? (
          <Chip label="Aucune alerte en attente" color="success" />
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {openTickets.length > 0 && (
              <Chip
                icon={<SupportAgentIcon />}
                label={`${openTickets.length} ticket(s) ouverts`}
                color="warning"
                onClick={() => navigate("/admin/tickets")}
              />
            )}
            {cancelledEvents.length > 0 && (
              <Chip
                icon={<EventIcon />}
                label={`${cancelledEvents.length} événement(s) annulés`}
                color="error"
                onClick={() => navigate("/admin/events")}
              />
            )}
          </Stack>
        )}
      </Paper>

      {/* ACTIVITÉ RÉCENTE */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <AccessTimeIcon />
          <Typography fontWeight={700}>Activité récente</Typography>
        </Stack>

        <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={3}>
          {/* TICKETS */}
          <Box>
            <Typography fontWeight={600} mb={1}>
              Tickets support
            </Typography>

            {recentTickets.length === 0 ? (
              <Typography color="text.secondary">
                Aucun ticket récent
              </Typography>
            ) : (
              <Stack spacing={1}>
                {recentTickets.map(ticket => (
                  <Paper
                    key={ticket.ID}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/admin/tickets/${ticket.ID}`)}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography fontWeight={600}>
                          {ticket.SUBJECT}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.CLIENT_EMAIL}
                        </Typography>
                      </Box>
                      <Chip
                        label={ticket.STATUS}
                        size="small"
                        color={ticket.STATUS === "OPEN" ? "warning" : "success"}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>

          {/* ÉVÉNEMENTS */}
          <Box>
            <Typography fontWeight={600} mb={1}>
              Événements récents
            </Typography>

            {recentEvents.length === 0 ? (
              <Typography color="text.secondary">
                Aucun événement récent
              </Typography>
            ) : (
              <Stack spacing={1}>
                {recentEvents.map(event => (
                  <Paper
                    key={event.ID}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/admin/events")}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography fontWeight={600}>
                          {event.TITLE}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.START_DATE).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={event.STATUS}
                        size="small"
                        color={event.STATUS === "ACTIVE" ? "success" : "error"}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Paper>

      {/* ACTIONS RAPIDES */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography fontWeight={700} mb={2}>
          Accès rapide
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/admin/events/new")}
          >
            Créer un événement
          </Button>

          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/admin/events")}
          >
            Gérer les événements
          </Button>

          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/admin/tickets")}
          >
            Support tickets
          </Button>
        </Stack>
      </Paper>
    </AdminLayout>
  );
};

export default Dashboard;

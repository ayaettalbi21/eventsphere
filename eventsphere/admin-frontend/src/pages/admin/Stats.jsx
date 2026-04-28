import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AdminLayout from "../../components/admin/AdminLayout";
import { getAdminEvents } from "../../api/admin.events.api";
import { getAdminTickets } from "../../api/admin.tickets.api";

const Stats = () => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ev = await getAdminEvents();
        const tk = await getAdminTickets();
        setEvents(ev.data || []);
        setTickets(tk.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <CircularProgress />
      </AdminLayout>
    );
  }

  /* ====== CALCULS ====== */
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.STATUS === "ACTIVE").length;
  const cancelledEvents = events.filter(e => e.STATUS === "CANCELLED").length;

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.STATUS === "OPEN").length;
  const closedTickets = totalTickets - openTickets;

  const eventChartData = [
    { name: "Actifs", value: activeEvents },
    { name: "Annulés", value: cancelledEvents },
  ];

  return (
    <AdminLayout>
      <Typography variant="h4" mb={1}>
        Statistiques
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Vue globale de l’activité de la plateforme
      </Typography>

      {/* KPI */}
      <Grid container spacing={3} mb={4}>
        <Kpi title="Total événements" value={totalEvents} />
        <Kpi title="Événements actifs" value={activeEvents} color="success" />
        <Kpi title="Événements annulés" value={cancelledEvents} color="error" />
        <Kpi title="Tickets ouverts" value={openTickets} color="warning" />
      </Grid>

      {/* ÉVÉNEMENTS */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography fontWeight={700} mb={2}>
          État des événements
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventChartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#F5C400" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* SUPPORT TICKETS */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography fontWeight={700} mb={1}>
          Support client
        </Typography>

        <Typography color="text.secondary" mb={2}>
          Suivi des demandes clients
        </Typography>

        <Typography>• Total tickets : <b>{totalTickets}</b></Typography>
        <Typography>• Tickets ouverts : <b>{openTickets}</b></Typography>
        <Typography>• Tickets fermés : <b>{closedTickets}</b></Typography>

        <Box mt={2}>
          {openTickets > 0 ? (
            <Chip
              label="Des tickets nécessitent une réponse admin"
              color="warning"
            />
          ) : (
            <Chip
              label="Aucune action requise côté support"
              color="success"
            />
          )}
        </Box>
      </Paper>

      {/* SYNTHÈSE */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography fontWeight={800} mb={1}>
          Synthèse admin
        </Typography>

        <Typography color="text.secondary">
          La plateforme contient {activeEvents} événement(s) actif(s).{" "}
          {openTickets > 0
            ? "Une action admin est requise côté support."
            : "Le support client est à jour."}
        </Typography>
      </Paper>
    </AdminLayout>
  );
};

/* ===== KPI CARD ===== */
const Kpi = ({ title, value, color = "primary" }) => (
  <Grid item xs={12} md={3}>
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={800} color={`${color}.main`}>
        {value}
      </Typography>
    </Paper>
  </Grid>
);

export default Stats;

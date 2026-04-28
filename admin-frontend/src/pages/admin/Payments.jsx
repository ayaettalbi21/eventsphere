import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import {
  getAdminPayments,
  getAdminPaymentStats,
} from "../../api/admin.payments.api";

/* ===== STATUS CHIP ===== */
const StatusChip = ({ status }) => {
  const map = {
    PAID: "success",
    PENDING: "warning",
    FAILED: "error",
    CANCELED: "default",
  };
  return <Chip label={status} color={map[status] || "default"} />;
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await getAdminPayments();
        const s = await getAdminPaymentStats();

        setPayments(p.data || []);
        setStats(s.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <CircularProgress />
      </AdminLayout>
    );
  }

  const totals = stats?.totals || {};

  return (
    <AdminLayout>
      {/* HEADER */}
      <Typography variant="h4" mb={1}>
        Paiements
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Suivi et gestion des transactions
      </Typography>

      {/* KPI */}
      <Grid container spacing={3} mb={4}>
        <Kpi title="Total paiements" value={totals.TOTAL_PAYMENTS} />
        <Kpi
          title="Revenus totaux"
          value={`${totals.TOTAL_REVENUE} €`}
          color="success"
        />
        <Kpi title="Payés" value={totals.PAID_COUNT} color="success" />
        <Kpi title="En attente" value={totals.PENDING_COUNT} color="warning" />
        <Kpi title="Échoués" value={totals.FAILED_COUNT} color="error" />
      </Grid>

      {/* TABLE */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography fontWeight={700} mb={2}>
          Liste des paiements
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Événement</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.PAYMENT_ID} hover>
                <TableCell>{p.PAYMENT_ID}</TableCell>
                <TableCell>{p.EMAIL}</TableCell>
                <TableCell>{p.EVENT_TITLE}</TableCell>
                <TableCell>{p.AMOUNT} €</TableCell>
                <TableCell>
                  <StatusChip status={p.STATUS} />
                </TableCell>
                <TableCell>
                  {new Date(p.CREATED_AT).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                            navigate(`/admin/payments/${p.PAYMENT_ID}`, {
                            state: p,
                            })
                        }
                        >
                    Détails
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </AdminLayout>
  );
}

/* ===== KPI CARD ===== */
const Kpi = ({ title, value, color = "primary" }) => (
  <Grid item xs={12} md={2.4}>
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={800} color={`${color}.main`}>
        {value ?? 0}
      </Typography>
    </Paper>
  </Grid>
);

import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AdminLayout from "../../components/admin/AdminLayout";

/* ===== STATUS CHIP ===== */
const StatusChip = ({ status }) => {
  const map = {
    PAID: "success",
    PENDING: "warning",
    FAILED: "error",
    CANCELED: "default",
  };
  const label = status || "UNKNOWN";
  return (
    <Chip
      label={label}
      color={map[label] || "default"}
      sx={{ fontWeight: 800, letterSpacing: 0.4 }}
    />
  );
};

/* ===== FIELD ROW ===== */
const Field = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" gap={2}>
    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 700, textAlign: "right" }}>
      {value ?? "—"}
    </Typography>
  </Stack>
);

export default function PaymentDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <AdminLayout>
        <Typography>Paiement introuvable</Typography>
        <Box mt={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate("/admin/payments")}
          >
            Retour aux paiements
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  const createdAt = state.CREATED_AT ? new Date(state.CREATED_AT) : null;
  const startDate = state.START_DATE ? new Date(state.START_DATE) : null;

  const paymentId = state.PAYMENT_ID;
  const amount = state.AMOUNT;
  const status = state.STATUS;

  const customerName = `${state.FIRST_NAME || ""} ${state.LAST_NAME || ""}`.trim();

  return (
    <AdminLayout>
      {/* TOP BAR */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Détails du paiement
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Vue complète de la transaction, du client et de l’événement.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.2} alignItems="center">
          <StatusChip status={status} />
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate("/admin/payments")}
          >
            Retour
          </Button>
        </Stack>
      </Stack>

      {/* SUMMARY STRIP */}
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 3,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(245,196,0,0.10)",
            }}
          >
            <ReceiptLongIcon />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 900 }}>
              Paiement #{paymentId}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {createdAt ? createdAt.toLocaleString() : "—"}
            </Typography>
          </Box>
        </Stack>

        <Stack alignItems="flex-end">
          <Typography color="text.secondary" sx={{ fontSize: 12 }}>
            Montant
          </Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 22 }}>
            {amount ?? 0} €
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* PAYMENT */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <PaidIcon fontSize="small" />
              <Typography sx={{ fontWeight: 900 }}>Paiement</Typography>
            </Stack>

            <Stack spacing={1.2}>
              <Field label="ID Paiement" value={paymentId} />
              <Divider />
              <Field label="Statut" value={status} />
              <Divider />
              <Field label="Montant" value={`${amount ?? 0} €`} />
              <Divider />
              <Field
                label="Créé le"
                value={createdAt ? createdAt.toLocaleString() : "—"}
              />
            </Stack>
          </Paper>
        </Grid>

        {/* CUSTOMER */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <PersonIcon fontSize="small" />
              <Typography sx={{ fontWeight: 900 }}>Client</Typography>
            </Stack>

            <Stack spacing={1.2}>
              <Field label="Nom" value={customerName || "—"} />
              <Divider />
              <Field label="Email" value={state.EMAIL || "—"} />
              <Divider />
              <Field label="User ID" value={state.USER_ID ?? "—"} />
            </Stack>
          </Paper>
        </Grid>

        {/* EVENT */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <EventIcon fontSize="small" />
              <Typography sx={{ fontWeight: 900 }}>Événement</Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Stack spacing={1.2}>
                  <Field label="Titre" value={state.EVENT_TITLE || "—"} />
                  <Divider />
                  <Field label="Lieu" value={state.LOCATION || "—"} />
                  <Divider />
                  <Field
                    label="Début"
                    value={startDate ? startDate.toLocaleString() : "—"}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: "100%",
                    bgcolor: "rgba(245,196,0,0.06)",
                  }}
                >
                  <Typography sx={{ fontWeight: 900 }} mb={1}>
                    Capacité & réservations
                  </Typography>

                  <Stack spacing={1.2}>
                    <Field label="Capacité" value={state.CAPACITY ?? "—"} />
                    <Divider />
                    <Field
                      label="Réservées"
                      value={state.RESERVED_PLACES ?? "—"}
                    />
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" gap={2}>
                      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                        Statut événement
                      </Typography>
                      <Chip
                        label={state.EVENT_STATUS || "—"}
                        sx={{ fontWeight: 800 }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

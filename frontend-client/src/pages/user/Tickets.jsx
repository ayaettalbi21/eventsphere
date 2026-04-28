import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import api from "../../api/axios";

export default function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // create ticket
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  /* =========================
     LOAD MY TICKETS
  ========================= */
  const loadTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tickets/my");
      setTickets(res.data.data || []);
    } catch {
      setError("Impossible de charger vos demandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  /* =========================
     CREATE TICKET
  ========================= */
  const submitTicket = async () => {
    if (!subject || !type || !message) return;

    setCreating(true);
    setError("");

    try {
      await api.post("/tickets", {
        subject,
        type,
        message,
      });

      setSubject("");
      setType("");
      setMessage("");

      await loadTickets();
    } catch {
      setError("Erreur lors de la création de la demande.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 6, mb: 10 }}>
      {/* HEADER */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background:
            "linear-gradient(145deg, rgba(12,21,25,0.95), rgba(22,33,39,0.95))",
        }}
      >
        <Typography variant="h4" fontWeight={900} mb={1}>
          Support & Assistance
        </Typography>
        <Typography color="text.secondary">
          Contactez notre équipe pour toute question liée aux paiements,
          réservations ou événements.
        </Typography>
      </Paper>

      {/* GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" },
          gap: 4,
        }}
      >
        {/* LEFT — CREATE */}
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography fontWeight={900} mb={2}>
            Nouvelle demande
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Sujet"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
            />

            <TextField
              label="Catégorie"
              select
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
            >
              <MenuItem value="PAYMENT">Paiement</MenuItem>
              <MenuItem value="RESERVATION">Réservation</MenuItem>
              <MenuItem value="EVENT">Événement</MenuItem>
              <MenuItem value="OTHER">Autre</MenuItem>
            </TextField>

            <TextField
              label="Message"
              multiline
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              variant="contained"
              size="large"
              disabled={creating}
              onClick={submitTicket}
              sx={{ fontWeight: 900 }}
            >
              Envoyer la demande
            </Button>
          </Stack>
        </Paper>

        {/* RIGHT — LIST */}
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography fontWeight={900} mb={2}>
            Mes demandes
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <CircularProgress />
          ) : tickets.length === 0 ? (
            <Typography color="text.secondary">
              Aucune demande pour le moment.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {tickets.map((t) => (
                <Paper
                  key={t.ID}
                  variant="outlined"
                  onClick={() => navigate(`/tickets/${t.ID}`)}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all .2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    },
                  }}
                >
                  <Box>
                    <Typography fontWeight={800}>
                      {t.SUBJECT}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: 14 }}
                    >
                      {t.TYPE} •{" "}
                      {new Date(t.CREATED_AT).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Chip
                    label={t.STATUS}
                    color={t.STATUS === "OPEN" ? "warning" : "success"}
                  />
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

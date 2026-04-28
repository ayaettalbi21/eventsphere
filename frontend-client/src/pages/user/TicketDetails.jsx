import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

/* Helpers */
const initials = (email = "") => {
  const name = email.split("@")[0] || "U";
  const parts = name.replace(/[._-]/g, " ").split(" ").filter(Boolean);
  const a = (parts[0]?.[0] || "U").toUpperCase();
  const b = (parts[1]?.[0] || "").toUpperCase();
  return (a + b).slice(0, 2);
};

const StatusChip = ({ status }) => {
  const map = {
    OPEN: "warning",
    RESOLVED: "success",
  };
  return <Chip label={status} color={map[status] || "default"} />;
};

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.CREATED_AT) - new Date(b.CREATED_AT)
    );
  }, [messages]);

  /* =========================
     LOAD TICKET
  ========================= */
  const loadTicket = async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data.ticket);
      setMessages(res.data.messages || []);
    } catch {
      setError("Impossible de charger cette demande.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  /* =========================
     CLOSE TICKET
  ========================= */
  const closeTicket = async () => {
    try {
      await api.put(`/tickets/${id}/close`);
      await loadTicket();
    } catch {
      setError("Impossible de fermer la demande.");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !ticket) {
    return <Alert severity="error">{error || "Demande introuvable"}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, mb: 10 }}>
      {/* HEADER */}
      <Box mb={3} display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight={900}>
            {ticket.SUBJECT}
          </Typography>
          <Typography color="text.secondary">
            {ticket.TYPE}
          </Typography>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <StatusChip status={ticket.STATUS} />
          <Button variant="outlined" onClick={() => navigate("/tickets")}>
            Retour
          </Button>
        </Box>
      </Box>

      {/* INFOS */}
      <Paper sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Créé le{" "}
          <b>{new Date(ticket.CREATED_AT).toLocaleString()}</b>
        </Typography>
      </Paper>

      {/* CONVERSATION */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography fontWeight={800} mb={2}>
          Conversation
        </Typography>

        {sortedMessages.length === 0 ? (
          <Typography color="text.secondary">
            Aucun message pour le moment.
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={1.5}>
            {sortedMessages.map((msg) => {
              const isClient = msg.SENDER === ticket.CLIENT_EMAIL;

              return (
                <Box
                  key={msg.ID}
                  display="flex"
                  gap={1.2}
                  flexDirection={isClient ? "row" : "row-reverse"}
                >
                  <Avatar
                    sx={{
                      bgcolor: isClient
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(245,196,0,0.25)",
                      color: isClient ? "#fff" : "#F5C400",
                      fontWeight: 800,
                    }}
                  >
                    {initials(msg.SENDER)}
                  </Avatar>

                  <Box maxWidth="70%">
                    <Box
                      sx={{
                        p: 1.6,
                        borderRadius: 3,
                        bgcolor: isClient
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(245,196,0,0.12)",
                      }}
                    >
                      <Typography>{msg.MESSAGE}</Typography>
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        textAlign: isClient ? "left" : "right",
                      }}
                    >
                      {msg.SENDER} ·{" "}
                      {new Date(msg.CREATED_AT).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* ACTIONS */}
      {ticket.STATUS === "OPEN" && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography fontWeight={800} mb={2}>
            Actions
          </Typography>

          <Button
            variant="contained"
            color="success"
            onClick={closeTicket}
          >
            Marquer comme résolu
          </Button>
        </Paper>
      )}
    </Box>
  );
}

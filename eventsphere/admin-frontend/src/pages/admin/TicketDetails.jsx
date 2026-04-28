import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  Button,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useParams, useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import { getAdminTicketById, replyToTicket } from "../../api/admin.tickets.api";

/* Helpers */
const initials = (email = "") => {
  const name = email.split("@")[0] || "U";
  const parts = name.replace(/[._-]/g, " ").split(" ").filter(Boolean);
  const a = (parts[0]?.[0] || "U").toUpperCase();
  const b = (parts[1]?.[0] || "").toUpperCase();
  return (a + b).slice(0, 2);
};

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clientEmail = ticket?.CLIENT_EMAIL || "";

  const sortedMessages = useMemo(() => {
    const arr = Array.isArray(messages) ? [...messages] : [];
    return arr.sort(
      (a, b) => new Date(a.CREATED_AT) - new Date(b.CREATED_AT)
    );
  }, [messages]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await getAdminTicketById(id);
        if (!res?.ticket) throw new Error("Ticket introuvable");

        setTicket(res.ticket);
        setMessages(res.messages || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleReply = async () => {
    if (!reply.trim()) return;

    try {
      await replyToTicket(id, reply);
      const res = await getAdminTicketById(id);
      setTicket(res.ticket);
      setMessages(res.messages || []);
      setReply("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l’envoi de la réponse");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <CircularProgress />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert severity="error">{error}</Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* HEADER */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {ticket.SUBJECT}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ticket n°{ticket.ID} • Support {ticket.TYPE}
          </Typography>
        </Box>

        <Box display="flex" gap={1.5} alignItems="center">
          <Chip
            label={ticket.STATUS}
            color={ticket.STATUS === "OPEN" ? "warning" : "success"}
            size="small"
            sx={{ fontWeight: 700 }}
          />
          <Button variant="outlined" onClick={() => navigate("/admin/tickets")}>
            Retour
          </Button>
        </Box>
      </Box>

      {/* INFOS */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Client : <b>{ticket.CLIENT_EMAIL}</b> • Créé le{" "}
          <b>{new Date(ticket.CREATED_AT).toLocaleString()}</b>
        </Typography>
      </Paper>

      {/* CONVERSATION */}
      <Paper sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
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
              const isClient = msg.SENDER === clientEmail;

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
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        {msg.MESSAGE}
                      </Typography>
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
                      {msg.SENDER} •{" "}
                      {new Date(msg.CREATED_AT).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* ZONE RÉPONSE — TOUJOURS VISIBLE */}
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor:
            ticket.STATUS === "OPEN"
              ? "background.paper"
              : "rgba(255,255,255,0.04)",
          opacity: ticket.STATUS === "OPEN" ? 1 : 0.7,
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <AdminPanelSettingsIcon color="primary" />
          <Typography fontWeight={800}>
            Réponse administrateur
          </Typography>
        </Box>

        {ticket.STATUS !== "OPEN" && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Ce ticket est clôturé. La réponse est désactivée.
          </Alert>
        )}

        <TextField
          multiline
          rows={4}
          fullWidth
          disabled={ticket.STATUS !== "OPEN"}
          placeholder={
            ticket.STATUS === "OPEN"
              ? "Rédigez une réponse claire et professionnelle…"
              : "Réponse désactivée"
          }
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            disabled={ticket.STATUS !== "OPEN" || !reply.trim()}
            onClick={handleReply}
          >
            Envoyer la réponse
          </Button>
        </Box>
      </Paper>
    </AdminLayout>
  );
};

export default TicketDetails;

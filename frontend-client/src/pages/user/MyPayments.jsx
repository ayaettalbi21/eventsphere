import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

/* =========================
   HELPERS
========================= */
function formatDate(date) {
  try {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
}

function statusChip(status) {
  switch (status) {
    case "PAID":
      return <Chip label="PAID" color="success" />;
    case "PENDING":
      return (
        <Chip
          label="PENDING"
          sx={{ bgcolor: "rgba(207,157,123,0.25)", fontWeight: 700 }}
        />
      );
    case "FAILED":
      return <Chip label="FAILED" color="error" />;
    default:
      return <Chip label={status} />;
  }
}

/* =========================
   PAGE
========================= */
export default function MyPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/payments/my");
        setPayments(res?.data?.data || []);
      } catch {
        setError("Unable to load payment history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const downloadInvoice = async (paymentId) => {
    try {
      setDownloadingId(paymentId);

      const res = await api.get(`/payments/${paymentId}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_EventSphere_${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Unable to download invoice.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 980, mx: "auto", mt: 6, mb: 10 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight={900} mb={1}>
        My Payments
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Review your transaction history and download your invoices.
      </Typography>

      {payments.length === 0 ? (
        <Alert severity="info">You have no payments yet.</Alert>
      ) : (
        <Stack spacing={3}>
          {payments.map((p) => (
            <Paper
              key={p.ID}
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                {/* LEFT */}
                <Box>
                  <Typography fontWeight={900} fontSize={18}>
                    {p.TITLE}
                  </Typography>
                  <Typography color="text.secondary">
                    {p.LOCATION}
                  </Typography>

                  <Typography mt={1} fontSize={14}>
                    Event Date · {formatDate(p.START_DATE)}
                  </Typography>

                  <Typography mt={1} fontSize={13} color="text.secondary">
                    Paid on {formatDate(p.CREATED_AT)}
                  </Typography>
                </Box>

                {/* RIGHT */}
                <Box textAlign={{ xs: "left", md: "right" }}>
                  <Typography variant="h5" fontWeight={900} mb={1}>
                    {p.AMOUNT} EUR
                  </Typography>

                  {statusChip(p.STATUS)}

                  <Divider sx={{ my: 2 }} />

                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/events/${p.EVENT_ID}`)}
                    >
                      View Event
                    </Button>

                    {p.STATUS === "PAID" && (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={downloadingId === p.ID}
                        onClick={() => downloadInvoice(p.ID)}
                      >
                        {downloadingId === p.ID
                          ? "Downloading..."
                          : "Download Invoice"}
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import api, { getApiBaseUrl } from "../../api/axios";

/* =========================
   HELPERS
========================= */
function resolveImage(url) {
  if (!url) return "https://via.placeholder.com/1200x600?text=EventSphere";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url}`;
}

function fmt(iso) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

/* =========================
   PAYMENT METHODS
========================= */
const METHODS = [
  { id: "VISA", icon: "/assets/payments/visa.svg" },
  { id: "MASTERCARD", icon: "/assets/payments/mastercard.svg" },
  { id: "PAYPAL", icon: "/assets/payments/paypal.svg" },
];

export default function Checkout() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState("VISA");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [card, setCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const [paypal, setPaypal] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    api.get(`/events/${eventId}`).then((res) => {
      setEvent(res.data.data);
      setLoading(false);
    });
  }, [eventId]);

  const remaining = useMemo(() => {
    if (!event) return 0;
    return event.CAPACITY - event.RESERVED_PLACES;
  }, [event]);

  const total = useMemo(() => {
    if (!event) return 0;
    return event.PRICE * quantity;
  }, [event, quantity]);

  const validate = () => {
    if (quantity < 1) return "Quantity must be at least 1.";
    if (quantity > remaining) return "Not enough seats available.";

    if (method !== "PAYPAL") {
      if (!card.holder) return "Cardholder name is required.";
      if (onlyDigits(card.number).length < 12) return "Invalid card number.";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry))
        return "Expiry must be MM/YY.";
      if (!/^\d{3,4}$/.test(card.cvv)) return "Invalid CVV.";
    } else {
      if (!paypal.email) return "PayPal email is required.";
      if (!paypal.password) return "PayPal password is required.";
    }

    return "";
  };

  const payNow = async () => {
    setError("");
    const msg = validate();
    if (msg) return setError(msg);

    setProcessing(true);
    try {
      const create = await api.post("/payments/create", {
        event_id: event.ID,
        quantity,
        amount: total,
        payment_method: method,
      });

      await api.post("/payments/confirm", {
        payment_id: create.data.payment_id,
        event_id: event.ID,
        quantity,
        amount: total,
      });

      navigate("/payment-success", {
        state: {
          eventTitle: event.TITLE,
          quantity,
          total,
        },
      });
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Payment could not be completed.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight={900} mb={3}>
        Secure Payment
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          gap: 4,
        }}
      >
        {/* LEFT */}
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              height: 220,
              borderRadius: 3,
              mb: 2,
              background: `url(${resolveImage(
                event.IMAGE_URL
              )}) center / cover`,
            }}
          />

          <Typography variant="h5" fontWeight={900}>
            {event.TITLE}
          </Typography>
          <Typography color="text.secondary">{event.LOCATION}</Typography>

          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            <Chip label={`Start · ${fmt(event.START_DATE)}`} />
            <Chip label={`End · ${fmt(event.END_DATE)}`} variant="outlined" />
            <Chip label={`${remaining} seats remaining`} />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography fontWeight={800}>Price per seat</Typography>
          <Typography variant="h6">{event.PRICE} EUR</Typography>

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            inputProps={{ min: 1, max: remaining }}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{ mt: 2 }}
          />

          <Divider sx={{ my: 3 }} />

          <Typography fontWeight={800}>Total</Typography>
          <Typography variant="h4" fontWeight={900}>
            {total} EUR
          </Typography>
        </Paper>

        {/* RIGHT */}
        <Paper sx={{ p: 3 }}>
          <Typography fontWeight={900} mb={3}>
            Payment Method
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mb: 4,
            }}
          >
            {METHODS.map((m) => (
              <Box
                key={m.id}
                onClick={() => setMethod(m.id)}
                sx={{
                  width: 110,
                  height: 70,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 3,
                  border:
                    method === m.id
                      ? "2px solid #CF9D7B"
                      : "1px solid rgba(255,255,255,0.25)",
                  cursor: "pointer",
                }}
              >
                <img src={m.icon} alt={m.id} style={{ height: 36 }} />
              </Box>
            ))}
          </Box>

          {method !== "PAYPAL" ? (
            <Stack spacing={2}>
              <TextField
                label="Name on card"
                value={card.holder}
                onChange={(e) =>
                  setCard({ ...card, holder: e.target.value })
                }
              />
              <TextField
                label="Card number"
                value={card.number}
                onChange={(e) =>
                  setCard({ ...card, number: e.target.value })
                }
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Expiry (MM/YY)"
                  value={card.expiry}
                  onChange={(e) =>
                    setCard({ ...card, expiry: e.target.value })
                  }
                />
                <TextField
                  label="CVV"
                  value={card.cvv}
                  onChange={(e) =>
                    setCard({ ...card, cvv: e.target.value })
                  }
                />
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="PayPal Email"
                value={paypal.email}
                onChange={(e) =>
                  setPaypal({ ...paypal, email: e.target.value })
                }
              />
              <TextField
                label="PayPal Password"
                type="password"
                value={paypal.password}
                onChange={(e) =>
                  setPaypal({ ...paypal, password: e.target.value })
                }
              />
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={processing}
            onClick={payNow}
            sx={{ fontWeight: 900 }}
          >
            Pay {total} EUR
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import api, { getApiBaseUrl } from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

/* =========================
   HELPERS
========================= */
function resolveImage(url) {
  if (!url) return "https://via.placeholder.com/1600x800?text=EventSphere";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url.startsWith("/") ? "" : "/"}${url}`;
}

function fmt(iso) {
  if (!iso) return "";
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

/* =========================
   PAGE
========================= */
export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res?.data?.data || null);
    } catch {
      setError("Event not found.");
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const remaining = useMemo(() => {
    if (!event) return 0;
    return (event.CAPACITY ?? 0) - (event.RESERVED_PLACES ?? 0);
  }, [event]);

  const isSoldOut =
    event?.STATUS === "ACTIVE" && remaining <= 0;

  if (loading) return <LinearProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!event) return <Alert severity="info">No event data.</Alert>;

  return (
    <Box>
      {/* =========================
         HERO
      ========================= */}
      <Box
        sx={{
          height: { xs: 360, md: 520 },
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          mb: 6,
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${resolveImage(event.IMAGE_URL)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,12,15,0.25), rgba(8,12,15,0.95))",
          }}
        />

        <Box sx={{ position: "absolute", bottom: 36, left: 36, right: 36 }}>
          {isSoldOut && (
            <Chip
              label="SOLD OUT"
              sx={{
                mb: 2,
                fontWeight: 900,
                letterSpacing: "0.2em",
                backgroundColor: "#CF9D7B",
                color: "#0C1519",
              }}
            />
          )}

          <Typography
            variant="h2"
            sx={{ fontWeight: 950, mb: 0.5 }}
          >
            {event.TITLE}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.05em",
            }}
          >
            {event.LOCATION}
          </Typography>
        </Box>
      </Box>

      {/* =========================
         CONTENT
      ========================= */}
      <Box
        sx={{
          maxWidth: 980,
          mx: "auto",
          px: { xs: 2, md: 0 },
        }}
      >
        {/* META */}
        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <Chip label={`Start · ${fmt(event.START_DATE)}`} />
          <Chip label={`End · ${fmt(event.END_DATE)}`} variant="outlined" />
          <Chip
            label={
              isSoldOut
                ? "No seats available"
                : `${remaining} seats remaining`
            }
            variant="outlined"
          />
        </Stack>

        {/* DESCRIPTION */}
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Typography
            sx={{
              fontSize: "1.08rem",
              lineHeight: 1.8,
              color: "text.secondary",
            }}
          >
            {event.DESCRIPTION}
          </Typography>
        </Paper>

        {/* OBJECTIVE */}
        {event.OBJECTIVE && (
          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, mb: 1.5 }}
            >
              Experience Objective
            </Typography>
            <Typography color="text.secondary">
              {event.OBJECTIVE}
            </Typography>
          </Paper>
        )}

        {/* PRICE INCLUDES */}
        {event.PRICE_INCLUDES && (
          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 6 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, mb: 1.5 }}
            >
              Price Includes
            </Typography>
            <Typography
              sx={{ color: "text.secondary", lineHeight: 1.7 }}
            >
              {event.PRICE_INCLUDES}
            </Typography>
          </Paper>
        )}

        {/* =========================
           BOOKING
        ========================= */}
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            textAlign: "center",
            border: "1px solid rgba(207,157,123,0.35)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              letterSpacing: "0.15em",
              mb: 1,
            }}
          >
            Price
          </Typography>

          <Typography
            variant="h3"
            sx={{ fontWeight: 950, mb: 2 }}
          >
            {event.PRICE}{" "}
            <Typography component="span" sx={{ fontSize: "1.3rem" }}>
              EUR
            </Typography>
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 560,
              mx: "auto",
              mb: 3,
            }}
          >
            This exclusive experience is limited to a select number of guests.
            Reservations are confirmed only after secure payment.
          </Typography>

          {!isAuthenticated ? (
            <Stack spacing={1.5} maxWidth={360} mx="auto">
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate("/login")}
              >
                Login to continue
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => navigate("/register")}
              >
                Create account
              </Button>
            </Stack>
          ) : (
            <Button
              size="large"
              variant="contained"
              disabled={isSoldOut}
              onClick={() => navigate(`/checkout/${id}`)}
            >
              {isSoldOut ? "Sold Out" : "Proceed to Secure Payment"}
            </Button>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Chip,
  Fade,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import api, { getApiBaseUrl } from "../../api/axios";
import LuxuryCard from "../../components/user/LuxuryCard";

/* =========================
   HELPERS
========================= */
function resolveImage(url) {
  if (!url) return "https://via.placeholder.com/800x500?text=EventSphere";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url.startsWith("/") ? "" : "/"}${url}`;
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* =========================
   PAGE
========================= */
export default function Events() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  /* FILTERS */
  const [city, setCity] = useState("");
  const [startAfter, setStartAfter] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/events");
        setEvents(res?.data?.data || []);
      } catch {
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* =========================
     FILTERED EVENTS
  ========================= */
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCity =
        !city || ev.LOCATION?.toLowerCase() === city.toLowerCase();

      const matchDate =
        !startAfter ||
        new Date(ev.START_DATE) >= new Date(startAfter);

      return matchCity && matchDate;
    });
  }, [events, city, startAfter]);

  /* UNIQUE CITIES */
  const cities = useMemo(() => {
    return [...new Set(events.map((e) => e.LOCATION).filter(Boolean))];
  }, [events]);

  /* =========================
     CONTENT
  ========================= */
  const content = useMemo(() => {
    if (loading) return <LinearProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!filteredEvents.length)
      return <Alert severity="info">No events match your filters.</Alert>;

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {filteredEvents.map((ev, index) => {
          const remaining =
            (ev?.CAPACITY ?? 0) - (ev?.RESERVED_PLACES ?? 0);

          const soldOut = remaining <= 0;

          return (
            <Fade
              in
              timeout={600 + index * 120}
              key={ev.ID}
            >
              <Box sx={{ position: "relative" }}>
                {soldOut && (
                  <Chip
                    label="SOLD OUT"
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      zIndex: 2,
                      fontWeight: 900,
                      letterSpacing: "0.12em",
                      backgroundColor: "rgba(207,157,123,0.85)",
                      color: "#0C1519",
                    }}
                  />
                )}

                <LuxuryCard
                  title={ev.TITLE}
                  subtitle={ev.LOCATION}
                  description={ev.DESCRIPTION}
                  image={resolveImage(ev.IMAGE_URL)}
                  metaLeft={`Start · ${formatDate(ev.START_DATE)}`}
                  metaRight={
                    soldOut ? "No seats available" : `${remaining} seats`
                  }
                  onOpen={() => navigate(`/events/${ev.ID}`)}
                />
              </Box>
            </Fade>
          );
        })}
      </Box>
    );
  }, [filteredEvents, error, loading, navigate]);

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 950,
            letterSpacing: "0.05em",
            mb: 0.5,
          }}
        >
          Events
        </Typography>
        <Typography color="text.secondary">
          Refined experiences designed for elegance and distinction.
        </Typography>
      </Box>

      {/* FILTER BAR */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          select
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All cities</MenuItem>
          {cities.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          label="Starting after"
          InputLabelProps={{ shrink: true }}
          value={startAfter}
          onChange={(e) => setStartAfter(e.target.value)}
        />
      </Box>

      {content}
    </Box>
  );
}

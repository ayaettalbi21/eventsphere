import { useEffect, useState } from "react";
import { Alert, Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import api from "../../api/axios";

function fmt(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function MyReservations() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.get("/reservations/my");
      setList(res?.data?.data || []);
    } catch {
      setMsg("Failed to load reservations.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancelReservation = async (id) => {
    setMsg("");
    try {
      await api.put(`/reservations/${id}/cancel`);
      setMsg("Reservation cancelled.");
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Cancel failed.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 950, mb: 2 }}>
        My Reservations
      </Typography>

      {loading ? <LinearProgress /> : null}
      {msg ? <Alert sx={{ mb: 2 }} severity="info">{msg}</Alert> : null}

      {!loading && !list.length ? (
        <Alert severity="info">No reservations found.</Alert>
      ) : null}

      <Stack spacing={2}>
        {list.map((r) => (
          <Paper key={r.ID} sx={{ p: 2.2, boxShadow: "0 14px 40px rgba(0,0,0,0.35)" }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  {r.TITLE}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {r.LOCATION}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fmt(r.START_DATE)} → {fmt(r.END_DATE)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Typography variant="body2" color="text.secondary">
                  Quantity: <b>{r.QUANTITY}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: <b>{r.STATUS}</b>
                </Typography>
                {r.STATUS === "ACTIVE" ? (
                  <Button sx={{ mt: 1 }} variant="outlined" onClick={() => cancelReservation(r.ID)}>
                    Cancel
                  </Button>
                ) : null}
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

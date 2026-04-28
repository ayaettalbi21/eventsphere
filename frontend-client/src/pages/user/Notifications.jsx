import { useEffect, useMemo, useState } from "react";
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

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  const unreadCount = useMemo(
    () => items.filter((n) => n?.IS_READ === 0).length,
    [items]
  );

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.get("/notifications/my");
      setItems(res?.data?.data || []);
    } catch {
      setItems([]);
      setMsg("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    setMsg("");
    try {
      await api.put(`/notifications/${id}/read`);
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed to mark as read.");
    }
  };

  const remove = async (id) => {
    setMsg("");
    try {
      await api.delete(`/notifications/${id}`);
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed to delete notification.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 950, mb: 1 }}>
        Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Unread: <b>{unreadCount}</b>
      </Typography>

      {loading ? <LinearProgress /> : null}
      {msg ? <Alert sx={{ mb: 2 }} severity="info">{msg}</Alert> : null}

      {!loading && !items.length ? <Alert severity="info">No notifications.</Alert> : null}

      <Stack spacing={2}>
        {items.map((n) => (
          <Paper key={n.ID} sx={{ p: 2.2, boxShadow: "0 14px 40px rgba(0,0,0,0.35)" }}>
            <Stack spacing={0.7}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  {n.TITLE}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fmt(n.CREATED_AT)}
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {n.MESSAGE}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Type: {n.TYPE} {n.RELATED_EVENT_ID ? `• Event #${n.RELATED_EVENT_ID}` : ""}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1 }}>
                {n.IS_READ === 0 ? (
                  <Button variant="contained" onClick={() => markRead(n.ID)}>
                    Mark as read
                  </Button>
                ) : (
                  <Button variant="outlined" disabled>
                    Read
                  </Button>
                )}
                <Button variant="outlined" onClick={() => remove(n.ID)}>
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

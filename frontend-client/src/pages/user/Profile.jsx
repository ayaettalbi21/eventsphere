import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Stack,
  Chip,
  TextField,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, refreshMe } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Init form when user loads
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (loading) return null;

  if (!user) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography color="text.secondary">
          Unable to load profile information.
        </Typography>
      </Box>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.put("/auth/update-profile", form); // 🔹 backend next step
      await refreshMe();
      setSuccess("Profile updated successfully.");
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 6, mb: 10 }}>
      {/* ================= HEADER ================= */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background:
            "linear-gradient(145deg, rgba(12,21,25,0.95), rgba(22,33,39,0.95))",
        }}
      >
        <Typography variant="h4" fontWeight={900}>
          My Profile
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Manage your personal information and account preferences.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip
            label={user.role}
            sx={{
              fontWeight: 800,
              letterSpacing: "0.12em",
              bgcolor: "rgba(207,157,123,0.15)",
            }}
          />
          <Chip label={user.email} variant="outlined" />
        </Stack>
      </Paper>

      {/* ================= CONTENT ================= */}
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={900}>Account Information</Typography>

          {!editMode ? (
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Stack spacing={2}>
          <TextField
            label="First name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
          />

          <TextField
            label="Last name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            disabled
            fullWidth
            helperText="Email cannot be changed"
          />
        </Stack>

        {editMode && (
          <>
            <Divider sx={{ my: 4 }} />
            <Button
              variant="contained"
              size="large"
              disabled={saving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </>
        )}

        <Divider sx={{ my: 4 }} />

        {/* ================= QUICK ACTIONS ================= */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/my-reservations")}
          >
            My Reservations
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/tickets")}
          >
            Support Tickets
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/notifications")}
          >
            Notifications
          </Button>

          <Button
             variant="outlined"
             onClick={() => navigate("/my-payments")}
          >
            My Payments
          </Button>


        </Stack>
      </Paper>
    </Box>
  );
}

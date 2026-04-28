import { useContext, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

import authBg from "../../assets/auth-background.jpg";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setMsg(err?.response?.data?.message || err?.message || "Register failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Paper sx={{ p: { xs: 2.5, md: 3 }, position: "relative", overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,0.55)" }}>
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: `url(${authBg})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.22 }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,21,25,0.75), rgba(12,21,25,0.92))" }} />
        <Box sx={{ position: "relative" }}>
          <Typography variant="h5" sx={{ fontWeight: 950 }}>
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
            Create a client account to reserve and receive notifications.
          </Typography>

          <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
            <Stack spacing={1.6}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
                <TextField label="First name" value={form.first_name} onChange={onChange("first_name")} required fullWidth />
                <TextField label="Last name" value={form.last_name} onChange={onChange("last_name")} required fullWidth />
              </Stack>

              <TextField label="Email" value={form.email} onChange={onChange("email")} required />
              <TextField label="Password" value={form.password} onChange={onChange("password")} type="password" required />
              <TextField label="Phone (optional)" value={form.phone} onChange={onChange("phone")} />

              <Button disabled={busy} type="submit" variant="contained">
                Create account
              </Button>

              {msg ? <Alert severity="error">{msg}</Alert> : null}

              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Typography
                  component={RouterLink}
                  to="/login"
                  sx={{ color: "primary.main", textDecoration: "none", fontWeight: 800 }}
                >
                  Login
                </Typography>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

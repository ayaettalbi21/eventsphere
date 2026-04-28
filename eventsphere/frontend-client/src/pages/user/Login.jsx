import { useContext, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

import authBg from "../../assets/auth-background.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      await login({ email, password });
      // ✅ retour HOME (comme tu veux)
      navigate("/", { replace: true });
    } catch (err) {
      setMsg(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 560,
        mx: "auto",
      }}
    >
      <Paper
        sx={{
          p: { xs: 2.5, md: 3 },
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${authBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.22,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(12,21,25,0.75), rgba(12,21,25,0.92))",
          }}
        />
        <Box sx={{ position: "relative" }}>
          <Typography variant="h5" sx={{ fontWeight: 950 }}>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
            Access your premium space.
          </Typography>

          <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
            <Stack spacing={1.6}>
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

              <Button disabled={busy} type="submit" variant="contained">
                Sign in
              </Button>

              {msg ? <Alert severity="error">{msg}</Alert> : null}

              <Typography variant="body2" color="text.secondary">
                No account?{" "}
                <Typography
                  component={RouterLink}
                  to="/register"
                  sx={{ color: "primary.main", textDecoration: "none", fontWeight: 800 }}
                >
                  Register
                </Typography>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

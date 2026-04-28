import { useContext, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

import logo from "../../assets/logo-eventsphere.png";

const navBtnSx = {
  color: "text.primary",
  fontWeight: 700,
  letterSpacing: "0.03em",
  textTransform: "none",
  px: 1.2,
  borderRadius: 999,
  transition: "all 0.22s ease",
  "&:hover": {
    backgroundColor: "rgba(207,157,123,0.10)", // antiqueBrass soft (palette)
    transform: "translateY(-1px)",
  },
};

export default function UserHeader() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnread = async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await api.get("/notifications/my");
      const list = res?.data?.data || [];
      setUnreadCount(list.filter((n) => n?.IS_READ === 0).length);
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadUnread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const rightSide = useMemo(() => {
    if (!isAuthenticated) {
      return (
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="contained" onClick={() => navigate("/register")}>
            Register
          </Button>
        </Stack>
      );
    }

    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          onClick={async () => {
            await loadUnread();
            navigate("/notifications");
          }}
          aria-label="notifications"
        >
          <Badge badgeContent={unreadCount} color="primary" max={99}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <Button variant="outlined" onClick={() => navigate("/profile")}>
          Profile
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </Button>
      </Stack>
    );
  }, [isAuthenticated, logout, navigate, unreadCount]);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar disableGutters sx={{ py: 1 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* LEFT: logo + nav */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textDecoration: "none",
                }}
              >
                <img
                  src={logo}
                  alt="EventSphere"
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: "contain",
                    display: "block",
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 950,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  <Box component="span" sx={{ color: "primary.main" }}>
                    Event
                  </Box>
                  <Box component="span" sx={{ color: "text.primary" }}>
                    Sphere
                  </Box>
                </Typography>
              </Box>

              <Stack direction="row" spacing={0.6} alignItems="center">
                <Button component={RouterLink} to="/" sx={navBtnSx}>
                  Home
                </Button>
                <Button component={RouterLink} to="/events" sx={navBtnSx}>
                  Events
                </Button>

                {/* ✅ PAS D’ICÔNES (comme tu as demandé) */}
                {isAuthenticated ? (
                  <>
                    <Button
                      component={RouterLink}
                      to="/my-reservations"
                      sx={navBtnSx}
                    >
                      Reservations
                    </Button>
                    <Button component={RouterLink} to="/tickets" sx={navBtnSx}>
                      Support
                    </Button>
                  </>
                ) : null}
              </Stack>
            </Stack>

            {/* RIGHT */}
            {rightSide}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

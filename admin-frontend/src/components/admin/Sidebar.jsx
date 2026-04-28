import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import SupportIcon from "@mui/icons-material/SupportAgent";
import BarChartIcon from "@mui/icons-material/BarChart";
import { NavLink } from "react-router-dom";
import PaymentIcon from "@mui/icons-material/Payments";

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/admin/dashboard" },
  { label: "Événements", icon: <EventIcon />, to: "/admin/events" },
  { label: "Support", icon: <SupportIcon />, to: "/admin/tickets" },
  {label: "Paiements", icon: <PaymentIcon />, to: "/admin/payments" },
  { label: "Statistiques", icon: <BarChartIcon />, to: "/admin/stats" },
 
];

const Logo = () => (
  <Box
    display="flex"
    alignItems="center"
    gap={1.2}
    px={1}
    py={1.5}
    mb={1}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "12px",
        background: "linear-gradient(135deg, #F5C400 0%, #FFD84D 100%)",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 10px 25px rgba(245,196,0,.18)",
      }}
    >
      <Typography sx={{ color: "#000", fontWeight: 800, fontSize: 14 }}>ES</Typography>
    </Box>

    <Box>
      <Typography sx={{ fontWeight: 700, lineHeight: 1.1 }}>EventSphere</Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Admin</Typography>
    </Box>
  </Box>
);

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        position: "sticky",
        top: 0,
        bgcolor: "background.paper",
        borderRight: "1px solid #2a2a2a",
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 2,
      }}
    >
      {/* LOGO */}
      <Logo />

      {/* NAV (centrée verticalement) */}
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
        <List sx={{ width: "100%" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {({ isActive }) => (
                <ListItemButton
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform .15s ease, background-color .15s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      backgroundColor: "rgba(245,196,0,0.08)",
                    },
                    ...(isActive && {
                      backgroundColor: "rgba(245,196,0,0.14)",
                    }),
                    "&::before": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 10,
                          bottom: 10,
                          width: 4,
                          borderRadius: 8,
                          backgroundColor: "#F5C400",
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: isActive ? 700 : 600,
                        letterSpacing: 0.2,
                      },
                    }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          ))}
        </List>
      </Box>

      {/* FOOTER SIDEBAR (optionnel) */}
      <Box px={1} py={1} sx={{ color: "text.secondary", fontSize: 12 }}>
        © EventSphere
      </Box>
    </Box>
  );
};

export default Sidebar;

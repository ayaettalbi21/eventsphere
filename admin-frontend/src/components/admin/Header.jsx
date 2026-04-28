import { Box, Typography, Button, Chip } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Box
      sx={{
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        borderBottom: "1px solid #2a2a2a",
        bgcolor: "background.paper",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Typography sx={{ fontWeight: 800, letterSpacing: 0.3 }}>
        EventSphere Admin
      </Typography>

      <Box display="flex" alignItems="center" gap={1.5}>
        <Chip label="ADMIN" size="small" color="primary" sx={{ fontWeight: 700 }} />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {user?.email}
        </Typography>
        <Button variant="outlined" color="primary" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Header;

import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function UserLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <UserHeader />
      <Box component="main" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <UserFooter />
    </Box>
  );
}

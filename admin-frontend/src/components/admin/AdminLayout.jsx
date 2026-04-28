import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Header />

        {/* PAGE CONTENT (avec animation) */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            animation: "fadeIn .25s ease",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 520,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        {/* ICON */}
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 72,
            color: "#CF9D7B",
            mb: 2,
          }}
        />

        {/* TITLE */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 950,
            mb: 1,
          }}
        >
          Payment Successful
        </Typography>

        {/* SUBTITLE */}
        <Typography
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.7,
          }}
        >
          Your payment has been processed successfully.  
          Your reservation is now confirmed and secured.
        </Typography>

        {/* INFO BOX */}
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.03)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              letterSpacing: "0.08em",
              mb: 1,
            }}
          >
            WHAT’S NEXT
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            You can view your confirmed reservation, track your events,
            or continue exploring exclusive experiences.
          </Typography>
        </Paper>

        {/* ACTIONS */}
        <Stack spacing={1.5}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{ fontWeight: 900 }}
            onClick={() => navigate("/my-reservations")}
          >
            View My Reservations
          </Button>

          <Button
            fullWidth
            size="large"
            variant="outlined"
            onClick={() => navigate("/events")}
          >
            Explore More Events
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

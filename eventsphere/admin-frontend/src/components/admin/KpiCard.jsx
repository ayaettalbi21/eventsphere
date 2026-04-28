import { Box, Typography } from "@mui/material";

const KpiCard = ({ title, value }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid #2a2a2a",
        minWidth: 220,
        transition: "transform .15s ease",
        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
        {value}
      </Typography>
    </Box>
  );
};

export default KpiCard;

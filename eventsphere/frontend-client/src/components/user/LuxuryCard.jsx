import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function LuxuryCard({
  title,
  subtitle,
  description,
  image,
  chip,
  metaLeft,
  metaRight,
  onOpen,
  square = false,
}) {
  return (
    <Paper
      sx={{
        height: 520, // ✅ HAUTEUR FIXE → clé du problème
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(22,33,39,0.95), rgba(12,21,25,0.95))",
        boxShadow: "0 14px 35px rgba(0,0,0,0.45)",
        transition: "all 0.35s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.65)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          height: square ? 220 : 180,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* CONTENT */}
      <Box
        sx={{
          p: 2.4,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chip && (
          <Chip
            label={chip}
            size="small"
            sx={{
              mb: 1,
              alignSelf: "flex-start",
              backgroundColor: "rgba(207,157,123,0.15)",
              color: "#CF9D7B",
              fontWeight: 700,
            }}
          />
        )}

        {/* TITLE (2 lines max) */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "1.05rem",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        {/* LOCATION */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {subtitle}
        </Typography>

        {/* DESCRIPTION (3 lines max) */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {description}
        </Typography>

        {/* META */}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: "auto", mb: 2 }}
        >
          <Typography variant="caption" color="text.secondary">
            {metaLeft}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {metaRight}
          </Typography>
        </Stack>

        {/* BUTTON ALWAYS BOTTOM */}
        <Button
          variant="outlined"
          fullWidth
          onClick={onOpen}
          sx={{
            borderRadius: 99,
            fontWeight: 700,
          }}
        >
          View details →
        </Button>
      </Box>
    </Paper>
  );
}

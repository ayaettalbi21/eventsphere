import { Box, Container, Divider, Stack, Typography } from "@mui/material";

export default function UserFooter() {
  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        <Stack direction={{ xs: "column", md: "row" }} spacing={1} justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} EventSphere — Luxury Experiences.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Crafted in Chinese Black & Antique Brass.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

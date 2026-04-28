import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import { AuthContext } from "../../context/AuthContext";
import api, { getApiBaseUrl } from "../../api/axios";
import LuxuryCard from "../../components/user/LuxuryCard";

import heroImg from "../../assets/hero-luxury.jpg";

const PAGE_WIDTH = 1200;

function resolveImage(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url}`;
}

function fmtShort(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [previewEvents, setPreviewEvents] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/events");
        setPreviewEvents((res?.data?.data || []).slice(0, 3));
      } catch {
        setErr("Unable to load event preview.");
      }
    })();
  }, []);

  return (
    <Box>
      {/* ✅ même largeur pour TOUT */}
      <Box sx={{ maxWidth: PAGE_WIDTH, mx: "auto", px: 3 }}>
        {/* ================= HERO ================= */}
        <Paper
          sx={{
            minHeight: { xs: 540, md: 680 },
            mb: 8,
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 18px 55px rgba(0,0,0,0.45)",
          }}
        >
          {/* background */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.92)",
            }}
          />
          {/* overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(12,21,25,0.88), rgba(22,33,39,0.55))",
            }}
          />

          {/* ✅ FLEX COLUMN + bouton FORCÉ en bas avec mt:auto */}
          <Box
            sx={{
              position: "relative",
              height: "100%",
              minHeight: { xs: 540, md: 680 }, // ✅ important
              display: "flex",
              flexDirection: "column",
              p: { xs: 3.2, md: 5 },
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ letterSpacing: "0.35em", color: "text.secondary" }}
              >
                EVENTSPHERE
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  mt: 1.2,
                  fontWeight: 950,
                  maxWidth: 980,
                  lineHeight: 1.06,
                }}
              >
                Curated luxury events, designed for refined audiences
              </Typography>

              <Typography sx={{ mt: 2, maxWidth: 760 }}>
                Discover exclusive experiences crafted with elegance, discretion,
                and premium service.
              </Typography>
            </Box>

            {/* ✅ FORCÉ EN BAS */}
            <Stack direction="row" spacing={1.5} sx={{ mt: "auto", pt: 3 }}>
              <Button variant="contained" onClick={() => navigate("/events")}>
                Explore events
              </Button>

              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  onClick={() => navigate("/register")}
                >
                  Join EventSphere
                </Button>
              )}
            </Stack>
          </Box>
        </Paper>

        {/* ================= FEATURED ================= */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 950 }}>
              Featured Experiences
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A curated selection to inspire you.
            </Typography>
          </Box>

          <Button variant="outlined" onClick={() => navigate("/events")}>
            View all
          </Button>
        </Stack>

        {err ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            {err}
          </Alert>
        ) : null}

        {/* ✅ 3 cards même ligne, même taille */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: { xs: "wrap", md: "nowrap" },
            alignItems: "stretch",
            mb: 9,
          }}
        >
          {previewEvents.map((ev) => {
            const remaining =
              (ev?.CAPACITY ?? 0) - (ev?.RESERVED_PLACES ?? 0);

            return (
              <Box
                key={ev.ID}
                sx={{
                  flex: "1 1 0",
                  minWidth: { xs: "100%", sm: 320 },
                }}
              >
                <LuxuryCard
                  square
                  title={ev.TITLE}
                  subtitle={ev.LOCATION}
                  description={ev.DESCRIPTION}
                  image={resolveImage(ev.IMAGE_URL)}
                  metaLeft={fmtShort(ev.START_DATE)}
                  metaRight={`${remaining} seats`}
                  onOpen={() => navigate(`/events/${ev.ID}`)}
                />
              </Box>
            );
          })}
        </Box>

        {/* ================= WHY ================= */}
        <Typography variant="h5" sx={{ fontWeight: 950, mb: 3 }}>
          Why EventSphere
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", pb: 2 }}>
          {[
            {
              icon: WorkspacePremiumIcon,
              title: "Premium Selection",
              text: "Carefully curated luxury events.",
            },
            {
              icon: ShieldOutlinedIcon,
              title: "Secure Booking",
              text: "Reliable and protected reservations.",
            },
            {
              icon: AutoAwesomeOutlinedIcon,
              title: "Elegant Experience",
              text: "A refined and modern interface.",
            },
            {
              icon: SupportAgentOutlinedIcon,
              title: "Dedicated Support",
              text: "Assistance via tickets when needed.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <Paper
                key={f.title}
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  flex: "1 1 240px",
                  borderRadius: 3,
                }}
              >
                <Icon sx={{ fontSize: 40, color: "primary.main" }} />
                <Typography sx={{ fontWeight: 900, mt: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.text}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

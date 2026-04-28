import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import PeopleIcon from "@mui/icons-material/People";

import { useNavigate } from "react-router-dom";

const placeholderImage =
  "https://via.placeholder.com/120x80?text=Event";

const buildImageUrl = (url) => {
  if (!url) return placeholderImage;

  // Si l'URL contient déjà des paramètres
  if (url.includes("?")) {
    return url;
  }

  // Forcer les paramètres Unsplash pour un rendu fiable
  return `${url}?auto=format&fit=crop&w=200&q=60`;
};

const EventTable = ({ events, onCancel }) => {
  const navigate = useNavigate();

  return (
    <TableContainer
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        border: "1px solid #2a2a2a",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Événement</TableCell>
            <TableCell>Lieu</TableCell>
            <TableCell>Dates</TableCell>
            <TableCell align="center">Capacité</TableCell>
            <TableCell align="center">Réservées</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {events.map((event) => (
            <TableRow key={event.ID} hover>
              {/* IMAGE + TITRE */}
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    variant="rounded"
                    src={buildImageUrl(event.IMAGE_URL)}
                    sx={{
                      width: 72,
                      height: 48,
                      bgcolor: "#2a2a2a",
                    }}
                  />
                  <Box>
                    <Typography fontWeight={700}>
                      {event.TITLE}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Catégorie ID : {event.CATEGORY_ID}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* LIEU */}
              <TableCell>{event.LOCATION || "-"}</TableCell>

              {/* DATES */}
              <TableCell>
                {new Date(event.START_DATE).toLocaleDateString()} →{" "}
                {new Date(event.END_DATE).toLocaleDateString()}
              </TableCell>

              {/* CAPACITÉ */}
              <TableCell align="center">{event.CAPACITY}</TableCell>

              {/* RÉSERVÉES */}
              <TableCell align="center">
                {event.RESERVED_PLACES || 0}
              </TableCell>

              {/* STATUT */}
              <TableCell>
                <Chip
                  label={event.STATUS}
                  color={
                    event.STATUS === "ACTIVE"
                      ? "success"
                      : "error"
                  }
                  size="small"
                />
              </TableCell>

              {/* ACTIONS */}
              <TableCell align="right">
                <Tooltip title="Modifier">
                  <IconButton
                    onClick={() =>
                      navigate(`/admin/events/${event.ID}/edit`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Réservations">
                  <IconButton
                    onClick={() =>
                      navigate(
                        `/admin/events/${event.ID}/reservations`
                      )
                    }
                  >
                    <PeopleIcon />
                  </IconButton>
                </Tooltip>

                {event.STATUS === "ACTIVE" && (
                  <Tooltip title="Annuler">
                    <IconButton
                      color="error"
                      onClick={() => onCancel(event.ID)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventTable;

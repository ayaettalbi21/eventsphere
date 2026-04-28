import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Stack,
} from "@mui/material";

import { getApiBaseUrl } from "../../api/axios";

function resolveImage(url) {
  if (!url) return "https://via.placeholder.com/120x70?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url}`;
}

export default function EventTable({ events, onCancel }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Titre</TableCell>
            <TableCell>Catégorie</TableCell>
            <TableCell>Capacité</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {events.map((e) => (
            <TableRow key={e.ID}>
              <TableCell>
                <img
                  src={resolveImage(e.IMAGE_URL)}
                  alt={e.TITLE}
                  onError={(ev) => {
                    ev.target.src =
                      "https://via.placeholder.com/120x70?text=Error";
                  }}
                  style={{
                    width: 120,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              </TableCell>

              <TableCell>{e.TITLE}</TableCell>
              <TableCell>
                <Chip label={e.CATEGORY} />
              </TableCell>
              <TableCell>{e.CAPACITY}</TableCell>
              <TableCell>
                <Chip
                  label={e.STATUS}
                  color={e.STATUS === "ACTIVE" ? "success" : "default"}
                />
              </TableCell>

              <TableCell align="right">
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onCancel(e.ID)}
                  >
                    Annuler
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";

const TicketTable = ({ tickets }) => {
  const navigate = useNavigate();

  if (!tickets || tickets.length === 0) {
    return (
      <Typography color="text.secondary">
        Aucun ticket support pour le moment.
      </Typography>
    );
  }

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
            <TableCell>ID</TableCell>
            <TableCell>Sujet</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets.map((t) => (
            <TableRow key={t.ID} hover>
              <TableCell>{t.ID}</TableCell>

              <TableCell>
                <Box>
                  <Typography fontWeight={700}>{t.SUBJECT}</Typography>
                  {t.MESSAGE && (
                    <Typography variant="caption" color="text.secondary">
                      {String(t.MESSAGE).slice(0, 60)}
                      {String(t.MESSAGE).length > 60 ? "..." : ""}
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell>{t.TYPE || "-"}</TableCell>

              <TableCell>{t.EMAIL || "-"}</TableCell>

              <TableCell>
                <Chip
                  label={t.STATUS}
                  color={t.STATUS === "OPEN" ? "warning" : "success"}
                  size="small"
                />
              </TableCell>

              <TableCell>
                {t.CREATED_AT ? new Date(t.CREATED_AT).toLocaleString() : "-"}
              </TableCell>

              <TableCell align="right">
                <Tooltip title="Voir détail">
                  <IconButton onClick={() => navigate(`/admin/tickets/${t.ID}`)}>
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketTable;

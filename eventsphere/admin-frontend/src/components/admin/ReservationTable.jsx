import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
} from "@mui/material";

const ReservationTable = ({ reservations }) => {
  if (reservations.length === 0) {
    return (
      <Typography color="text.secondary">
        Aucune réservation pour cet événement.
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
            <TableCell>Email client</TableCell>
            <TableCell align="center">Quantité</TableCell>
            <TableCell align="center">Statut</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {reservations.map((r, index) => (
            <TableRow key={index} hover>
              <TableCell>{r.EMAIL}</TableCell>

              <TableCell align="center">{r.QUANTITY}</TableCell>

              <TableCell align="center">
                <Chip
                  label={r.STATUS}
                  color={r.STATUS === "ACTIVE" ? "success" : "default"}
                  size="small"
                />
              </TableCell>

              <TableCell>
                {new Date(r.CREATED_AT).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReservationTable;

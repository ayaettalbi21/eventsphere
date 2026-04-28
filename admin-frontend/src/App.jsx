import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Events from "./pages/admin/Events";
import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";
import EventReservations from "./pages/admin/EventReservations";
import Tickets from "./pages/admin/Tickets";
import Stats from "./pages/admin/Stats";
import TicketDetails from "./pages/admin/TicketDetails";
import Payments from "./pages/admin/Payments"; // ✅ CHEMIN CORRIGÉ
import PaymentDetails from "./pages/admin/PaymentDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route path="/admin/login" element={<Login />} />

          {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events/new"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events/:id/edit"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events/:id/reservations"
            element={
              <ProtectedRoute>
                <EventReservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments/:id"
            element={
              <ProtectedRoute>
                <PaymentDetails />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

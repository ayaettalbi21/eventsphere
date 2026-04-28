import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

/* =========================
   LAYOUT
========================= */
import UserLayout from "./components/user/UserLayout";

/* =========================
   USER PAGES
========================= */
import Home from "./pages/user/Home";
import Events from "./pages/user/Events";
import EventDetails from "./pages/user/EventDetails";
import Checkout from "./pages/user/Checkout";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Profile from "./pages/user/Profile";
import MyReservations from "./pages/user/MyReservations";
import Notifications from "./pages/user/Notifications";
import Tickets from "./pages/user/Tickets"; // ✅ AJOUTÉ
import MyPayments from "./pages/user/MyPayments";
import TicketDetails from "./pages/user/TicketDetails";

/* =========================
   AUTH GUARD
========================= */
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

/* =========================
   ROUTES
========================= */
export default function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CHECKOUT */}
        <Route
          path="/checkout/:eventId"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />

        {/* PAYMENT CONFIRMATION */}
        <Route
          path="/payment-success"
          element={
            <RequireAuth>
              <PaymentSuccess />
            </RequireAuth>
          }
        />

        {/* AUTHENTICATED USER */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <RequireAuth>
              <MyReservations />
            </RequireAuth>
          }
        />

        <Route
          path="/tickets"               // ✅ AJOUTÉ
          element={
            <RequireAuth>
              <Tickets />
            </RequireAuth>
          }
        />

        <Route
          path="/notifications"
          element={
            <RequireAuth>
              <Notifications />
            </RequireAuth>
          }
        />
        <Route
          path="/my-payments"
          element={
            <RequireAuth>
              <MyPayments />
            </RequireAuth>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <RequireAuth>
              <TicketDetails />
            </RequireAuth>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

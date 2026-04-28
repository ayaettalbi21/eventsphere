import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F5C400", // jaune doré
    },
    secondary: {
      main: "#2A2A2A",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#FF9800",
    },
    error: {
      main: "#F44336",
    },
  },

  // 🎨 TYPOGRAPHIE MODERNE
  typography: {
    fontFamily: "Poppins, Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    h5: {
      fontWeight: 700,
    },
    body1: {
      letterSpacing: 0.1,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  // 🔲 SHAPE GLOBAL
  shape: {
    borderRadius: 12,
  },

  // 🧩 OVERRIDES COMPOSANTS
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "transform .15s ease, box-shadow .15s ease",
        },
        containedPrimary: {
          color: "#000000",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "box-shadow .15s ease",
        },
      },
    },
  },
});

export default theme;

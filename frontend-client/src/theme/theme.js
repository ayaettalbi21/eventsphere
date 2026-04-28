import { createTheme } from "@mui/material/styles";

export const palette = {
  chineseBlack: "#0C1519",
  darkJungleGreen: "#162127",
  jet: "#3A3534",
  coffee: "#724B39",
  antiqueBrass: "#CF9D7B",
  ivory: "#EDE5DC",
  soft: "#CFC4BA",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: palette.chineseBlack,
      paper: palette.darkJungleGreen,
    },
    primary: { main: palette.antiqueBrass },
    secondary: { main: palette.coffee },
    text: {
      primary: palette.ivory,     // ✅ plus luxe que blanc pur
      secondary: palette.soft,
    },
    divider: "rgba(207,157,123,0.18)",
  },
  typography: {
    fontFamily: [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
    ].join(","),
    h1: { fontWeight: 800, letterSpacing: "0.03em" },
    h2: { fontWeight: 800, letterSpacing: "0.03em" },
    h3: { fontWeight: 800, letterSpacing: "0.02em" },
    h4: { fontWeight: 750, letterSpacing: "0.02em" },
    button: { textTransform: "none", fontWeight: 700, letterSpacing: "0.02em" },
    body1: { letterSpacing: "0.01em" },
    body2: { letterSpacing: "0.01em" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(1000px 650px at 70% 10%, rgba(207,157,123,0.14), transparent 55%), radial-gradient(900px 600px at 15% 25%, rgba(114,75,57,0.12), transparent 60%)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(207,157,123,0.12)",
          backgroundImage:
            "linear-gradient(180deg, rgba(22,33,39,0.94), rgba(22,33,39,0.78))",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, padding: "10px 18px" },
        outlined: { borderColor: "rgba(207,157,123,0.55)" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(180deg, rgba(12,21,25,0.94), rgba(12,21,25,0.70))",
          borderBottom: "1px solid rgba(207,157,123,0.16)",
          backdropFilter: "blur(10px)",
        },
      },
    },
  },
});

export default theme;

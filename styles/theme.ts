import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      dark: "rgb(var(--primary))",
      main: "rgb(var(--primary))",
      light: "rgb(var(--primary))",
      contrastText: "#fff",
    },
    secondary: {
      dark: "rgb(var(--secondary))",
      main: "rgb(var(--secondary))",
      light: "rgb(var(--secondary))",
      contrastText: "#fff",
    },
    background: {
      default: "rgb(var(--background))",
      paper: "rgb(var(--card-background))",
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: "dark",
  },
});

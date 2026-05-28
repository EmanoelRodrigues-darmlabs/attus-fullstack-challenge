import { createTheme } from "@mui/material/styles";

export type AppTheme = "light" | "dark";

export function createAppTheme(mode: AppTheme) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#2563eb"
      },
      success: {
        main: "#16a34a"
      },
      warning: {
        main: "#d97706"
      },
      error: {
        main: "#dc2626"
      },
      background: {
        default: isDark ? "#0f1117" : "#f5f7fb",
        paper: isDark ? "#171a22" : "#ffffff"
      },
      text: {
        primary: isDark ? "#fcf8f8" : "#111827",
        secondary: isDark ? "#aab4c1" : "#64748b"
      },
      divider: isDark ? "#303744" : "#dbe1ea"
    },
    shape: {
      borderRadius: 8
    },
    typography: {
      fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
      button: {
        fontWeight: 800,
        textTransform: "none"
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true
        },
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 8
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 8
          }
        }
      }
    }
  });
}

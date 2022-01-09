import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import * as Colors from '@mui/material/colors'
export default responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(255, 255, 255, 0.9)',
    },
    secondary: {
      main: Colors.indigo[500],
    },
    background: {
      default: "#0A1929",
      paper: "rgb(0, 30, 60)"
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    "fontWeightLight": 200,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 600
  },
  shape: {
    borderRadius: 5
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            "-webkit-box-shadow": "0 0 0 100px var(--primary-weak) inset",
            "-webkit-text-fill-color": "var(--text-primary)",
          }
        }
      }
    }
  }
}))
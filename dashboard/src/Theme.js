import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import * as Colors from '@mui/material/colors'
export default responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "rgb(0, 127, 255)",
    },
    secondary: {
      main: "rgb(0, 127, 255)",
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

        
      }
    },
    MuiPaper: {
      styleOverrides: {
          outlined: {
             borderColor: 'rgba(30, 73, 118,0.5)'
          }
      }
    },
    MuiDivider: {
      styleOverrides: {
        fullWidth: {
          borderColor: 'rgb(30, 73, 118,0.5)'
        }
      }
    }
  }
}))

// 'rgba(255, 255, 255, 0.9)'
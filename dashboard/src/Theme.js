import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import * as Colors from '@material-ui/core/colors'

export default responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: Colors.pink[600],
    },
    secondary: {
      main: Colors.lightBlue[500],
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    "fontWeightLight": 400,
    "fontWeightRegular": 500,
    "fontWeightMedium": 600
  },
  shape: {
    borderRadius: 4
  }
}))
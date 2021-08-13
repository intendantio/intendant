import Authentification from './screens/Authentification'
import Theme from './Theme'
import { ThemeProvider, CssBaseline, Box } from '@material-ui/core'

function App() {
  return (
    <ThemeProvider theme={Theme} >
      <CssBaseline />
      <Box style={{ userSelect: 'none', outline: 'none', WebkitTapHighlightColor: 'rgba(41,108,71,0.33)', height: '100vh', width: '100wh', backgroundColor: Theme.palette.background.default, display: 'flex', flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
        <Authentification />
      </Box>
    </ThemeProvider>
  )
}

export default App

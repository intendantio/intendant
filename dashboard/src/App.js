import Authentification from './screens/Authentification'
import Theme from './Theme'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobile: false
    }
  }

  componentDidMount() {
    this.mediaQueries('(max-width: 1200px),(max-height: 675px)')
  }

  mediaQueries(query) {
    let mediaMatch = window.matchMedia(query);
    this.setState({ isMobile: mediaMatch.matches })
    const handler = e => this.setState({ isMobile: e.matches })
    mediaMatch.addListener(handler)
  }

  render() {
    return (
      <ThemeProvider theme={Theme} >
        <CssBaseline />
        <Box style={{ userSelect: 'none', outline: 'none', WebkitTapHighlightColor: 'rgba(41,108,71,0.33)', height: '100vh', width: '100wh', backgroundColor: Theme.palette.background.default, display: 'flex', flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Authentification isMobile={this.state.isMobile} />
        </Box>
      </ThemeProvider>
    )
  }

}

export default App

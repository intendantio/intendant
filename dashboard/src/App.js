import Authentification from './screens/Authentification'
import Theme from './Theme'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import React from 'react'
import Context from './utils/Context'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobile: false,
      title: "Intendant",
      setTitle: (title) => {
        this.setState({
          title: capitalizeFirstLetter(title)
        })
      },
      setActionType: (actionType) => {
        this.setState({
          actionType: actionType
        })
      },
      actionType: "list"
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
      <Context.Provider value={this.state}>
      <ThemeProvider theme={Theme} >
        <CssBaseline />
        <Box style={{ userSelect: 'none', outline: 'none', WebkitTapHighlightColor: 'rgba(41,108,71,0.33)', height: '100vh', width: '100wh', backgroundColor: Theme.palette.background.default, display: 'flex', flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Authentification isMobile={this.state.isMobile} />
        </Box>
      </ThemeProvider>
      </Context.Provider>
    )
  }

}

function capitalizeFirstLetter(string = "") {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


export default App

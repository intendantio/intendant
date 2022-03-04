import Authentification from './screens/Authentification'
import Theme from './Theme'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import React from 'react'
import Context from './utils/Context'
import Alert from './components/Alert'

String.capitalizeFirstLetter = function (string) {
  if (string == undefined || string.length == 0) {
    return ""
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobile: false,
      enabled: false,
      severity: "error",
      message: "",
      title: "Intendant",
      setTitle: (title) => {
        this.setState({
          title: String.capitalizeFirstLetter(title)
        })
      },
      setActionType: (actionType) => {
        this.setState({
          actionType: actionType
        })
      },
      setMessage: (message, severity = "error") => {
        this.setState({
          message: message,
          severity: severity,
          enabled: true
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
            <Authentification setMessage={this.state.setMessage.bind(this)} isMobile={this.state.isMobile} />
          </Box>
          <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={this.state.severity}>
            {this.state.message}
          </Alert>
        </ThemeProvider>
      </Context.Provider>
    )
  }
}


export default App

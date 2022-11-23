import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import FormFill from 'pages/FormFill'
import VoiceFilter from 'pages/VoiceFilter'
import VoiceCommands from 'pages/VoiceCommands'
import VoiceInput from 'pages/VoiceInput'
import Navbar from "components/Navbar";

const demosPaths = [
	{ path: '/demos/form-fill', name: 'Voice Form Filling'},
	{ path: '/demos/voice-filter', name: 'Voice Filtering'},
	//{ path: '/demos/voice-commands', name: 'Voice Commands'},
	{ path: '/demos/voice-input', name: 'Voice Input'},
]

const App = () => {
  return (
    <Router>
      <div>

        <Navbar demos={demosPaths}/>

        <Switch>
          <Route path="/demos/form-fill" component={FormFill}/>
          <Route path="/demos/voice-filter" component={VoiceFilter}/>
          <Route path="/demos/voice-commands" component={VoiceCommands}/>
          <Route path="/demos/voice-input" component={VoiceInput}/>
          <Route exact path="/">
            <Redirect to="/demos/voice-input" />
          </Route>
        </Switch>
      </div>
    </Router>

  )
}

export default App;
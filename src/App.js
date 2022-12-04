import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import VoiceFormFill from 'pages/VoiceFormFill'
import VoiceFilter from 'pages/VoiceFilter'
import VoiceSearch from 'pages/VoiceSearch'
import VoiceInput from 'pages/VoiceInput'
import Navbar from "components/Navbar";

const demosPaths = [
	{ path: '/demos/voice-form-fill', name: 'Voice Form Fill'},
	{ path: '/demos/voice-filter', name: 'Voice Filtering'},
	{ path: '/demos/voice-search', name: 'Voice Search'},
	{ path: '/demos/voice-input', name: 'Voice Input'},
]

const App = () => {
  return (
    <Router>
      <div>

        <Navbar demos={demosPaths}/>

        <Switch>
          <Route path="/demos/voice-form-fill" component={VoiceFormFill}/>
          <Route path="/demos/voice-filter" component={VoiceFilter}/>
          <Route path="/demos/voice-search" component={VoiceSearch}/>
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
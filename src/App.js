import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import FormFill from 'pages/FormFill'
import ProductFilter from 'pages/ProductFilter'
import VoiceCommands from 'pages/VoiceCommands'
import VoiceSearch from 'pages/VoiceSearch'
import Navbar from "components/Navbar";


const demosPaths = [
	{ path: '/demos/form-fill', name: 'Form Filling'},
	{ path: '/demos/product-filter', name: 'Product Filter'},
	{ path: '/demos/voice-commands', name: 'Voice Commands'},
	{ path: '/demos/voice-search', name: 'Voice Input'},
]

const App = () => {
  return (
    <Router>
      <div>

        <Navbar demos={demosPaths}/>


        <Switch>
          <Route path="/demos/form-fill" component={FormFill}/>
          <Route path="/demos/product-filter" component={ProductFilter}/>
          <Route path="/demos/voice-commands" component={VoiceCommands}/>
          <Route path="/demos/voice-search" component={VoiceSearch}/>
          <Route exact path="/">
            <h1>Home</h1>
          </Route>
        </Switch>
      </div>
    </Router>

  )
}

export default App;
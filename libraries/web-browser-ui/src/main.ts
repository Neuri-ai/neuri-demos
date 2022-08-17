import CheckPermissions from './components/Permissions/index';
import PushToTalk from './components/PushToTalk/index';
//import Drawer from './components/Drawer/index';

window.customElements.get('push-to-talk') || window.customElements.define('push-to-talk', PushToTalk);
window.customElements.get('check-permissions') || window.customElements.define('check-permissions', CheckPermissions);

//window.customElements.get('drawer') || window.customElements.define('drawer', Drawer);
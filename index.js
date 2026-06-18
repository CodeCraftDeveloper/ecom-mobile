import { Text, AppRegistry } from "react-native";
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

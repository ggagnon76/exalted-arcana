import { hasDependencies } from "./module-dependencies.js";

Hooks.on('ready', () => {
  if (!hasDependencies()) return;
  ui.notifications.info("All module dependencies are installed!");
})
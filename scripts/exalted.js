import { hasDependencies } from "./module-dependencies.js";
import { monitorSpellCasting } from "./spell-active-effect.js"

Hooks.on('ready', () => {
  if (!hasDependencies()) return;
  ui.notifications.info("All module dependencies are installed!");
})

monitorSpellCasting();
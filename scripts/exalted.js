import { hasDependencies } from "./module-dependencies.js";
import { monitorSpellCasting } from "./spell-active-effect.js";

Hooks.on('ready', () => {
  if (!hasDependencies()) return;
  if (game.user.isGM) ui.notifications.info("All module dependencies are installed!");
})

monitorSpellCasting();
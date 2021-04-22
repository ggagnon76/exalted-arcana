import { hasDependencies } from "./module-dependencies.js";

Hooks.on('ready', () => {
  if (!hasDependencies()) return;
})
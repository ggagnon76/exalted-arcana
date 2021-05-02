export function hasDependencies() {
  // dependencies is an array of all the modules that have to be installed and activated for this module to proceed.
  const dependencies = ["betterrolls5e", "socketlib"];

  const notInstalled = [];
  const notActivated = [];

  for (const dependency of dependencies) {
    const status = game.modules.get(dependency)?.active
    if (status) continue;
    if (status === undefined) notInstalled.push(dependency);
    if (status === false) notActivated.push(dependency);
  }

  for (const warning of notInstalled) {
    ui.notifications.error("The " + warning + " module is not installed.  Exalted Arcana execution aborted.")
  }

  for (const warning of notActivated) {
    ui.notifications.error("The " + warning + " module is not activated.  Exalted Arcana execution aborted.")
  }

  if (notInstalled.length > 0 || notActivated.length > 0) return false;

  return true;
}


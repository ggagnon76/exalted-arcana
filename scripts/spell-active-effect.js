export function monitorSpellCasting() {
  return Hooks.on('preRollItemBetterRolls', (CustomItemRoll) => {
    const item = CustomItemRoll._item.data.name;
    const myActor = CustomItemRoll._actor.data.name;
    if (item !== "Hold Person") return ui.notifications.info("Not a spell we're watching for.");
    const selectedTargets = game.user.targets;
    const ownedSelected = canvas.tokens.controlled;
    const targets = [...selectedTargets, ...ownedSelected];
    if (targets.length === 0) return ui.notifications.info(myActor + " has not selected any targets for the " + item + " spell!");
    let targetString = "";
    for (const target of targets) {
      const name = target.data?.actorData.name || target.data.name;
      targetString += name + ", ";
    }
    ui.notifications.info(myActor + " is casting " + item + "spell with the following targets: " + targetString);
  })
}
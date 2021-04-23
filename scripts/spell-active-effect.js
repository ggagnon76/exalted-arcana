export function monitorSpellCasting() {
  return Hooks.on('preRollItemBetterRolls', (CustomItemRoll) => {
    const item = CustomItemRoll._item.data.name;
    const myActor = CustomItemRoll._actor.data.name;
    if (header === "Hold Person") {return ui.notifications.info(myActor + " is casting " + item)};
    return ui.notifications.info("Not a spell we're watching for.");
  })
}
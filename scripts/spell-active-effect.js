export function monitorSpellCasting() {

  let spells, spell, castLevel, message;

  // The event listener for 
  $(document).on('click', '.exalted-arcana-chatCard-prompt', async function () {
    const cm = game.messages.filter(v => v.data.flags.hasOwnProperty("exalted-arcana"))[0];
    const myActor = Object.keys(cm.data.flags["exalted-arcana"])[0];
    const myActorId = cm.data.flags["exalted-arcana"][myActor];
    await cm.delete();
    if (queryTargets()) return
    eaChatCard(myActor, myActorId, `<p>You didn't select any targets!</p><p>Double-Right-Click to select the first target.</p><p>Shift+(Double-Right-Click) to select more.</p>`);
  })
  
  function queryTargets() {
    if (spell.self) return true;
    const selectedTargets = game.user.targets;
    const targets = [...selectedTargets];
    if (targets.length !== 0) {
      // To-Do: check for allowed target qty per slot level
      const targetIdsArray = [];
      for (const target of targets) {
        targetIdsArray.push(target.id)
      }
      if (!game.user.isGM) {
        socket.executeAsGM("applyEffects", targetIdsArray, spell.effect);
        return true;
      } else applyEffects(targetIdsArray, spell.effect)
    }
    return false;
  }
  
  async function eaChatCard(myActor, myActorId, content = "") {
    content +=   `<p>Select targets for your spell, then click OK.</p>
                  <button exalted-arcana-id="${myActorId}" class="exalted-arcana-chatCard-prompt">OK</button>`
    let cm = await ChatMessage.create({
      content: content,
      speaker: ChatMessage.getSpeaker({alias: "Exalted Arcana Module"}),
      whisper: ChatMessage.getWhisperRecipients(myActor, "GM")
    })
  
    await cm.setFlag("exalted-arcana", myActor, myActorId)
  }

  function applyEffects(targetArray, effect) {
    const configEffect = CONFIG.statusEffects.find(effect => (effect.id === "combat-utility-belt." + effect));
    for (const target of targetArray) {
      const tok = canvas.tokens.get(target);
      tok.toggleEffect(configEffect, {active: true});
    }
  }

  function populateSpells() {
    return spells;
  }

  // Populate spell dictionary for GM.
  Hooks.once('ready', async () => {
    if (game.user.isGM) {
      const response = await fetch(`modules/exalted-arcana/scripts/spell-dictionary/spell-dictionary.json`);
      spells = await response.json();
    }
  });

  let socket;
  Hooks.once('socketlib.ready', () => {
    socket = socketlib.registerModule('exalted-arcana');
    socket.register("applyEffects", applyEffects);
    socket.register("populateSpells", populateSpells);
  })

  Hooks.on('renderBetterRolls', async (CustomItemRoll) => {

    const item = CustomItemRoll._item.data.name;
    const myActor = CustomItemRoll._actor.data.name;
    const myActorId = CustomItemRoll.actorId;
    castLevel = CustomItemRoll.params.slotLevel;

    if (!game.user.isGM  && !spells) {
      spells = await socket.executeAsGM("populateSpells");
    }

    spell = spells.find(s => s.name === item);

    if (!spell) return ui.notifications.info("Not a spell we're watching for.");

    if (queryTargets()) return

    await new Promise(resolve => setTimeout(resolve, 200));
    eaChatCard(myActor, myActorId);
  })


}

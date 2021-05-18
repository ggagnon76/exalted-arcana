export function monitorSpellCasting() {

  let spells, spell, castLevel, message;

  // The event listener for 
  $(document).on('click', '.exalted-arcana-chatCard-prompt', async function () {
    const cm = game.messages.filter(v => v.data.flags.hasOwnProperty("exalted-arcana"))[0];
    const myActorName = Object.keys(cm.data.flags["exalted-arcana"])[0];
    const myActorId = cm.data.flags["exalted-arcana"][myActorName];
    const myActor = game.actors.get(myActorId);
    const tok = canvas.tokens.placeables.find(t => t.name === myActor.data.name);
    const tokenId = tok.id;
    await cm.delete();
    if (queryTargets(tokenId)) return
    eaChatCard(myActorName, myActorId, `<p>You didn't select any targets!</p><p>Double-Right-Click to select the first target.</p><p>Shift+(Double-Right-Click) to select more.</p>`);
  })
  
  function queryTargets(tokenId) {
    const selectedTargets = game.user.targets;
    const targets = [...selectedTargets];
    const targetIdsArray = [];
    if (!spell.self && targets.length !== 0) {
      for (const target of targets) {
        targetIdsArray.push(target.id);
      }
    }
    if (spell.self) targetIdsArray.push(tokenId);
    if (targetIdsArray.length === 0) return false;
    if (!game.user.isGM) {
      socket.executeAsGM("applyEffects", targetIdsArray, spell.effect);
      return true;
    } else {
      applyEffects(targetIdsArray, spell.effect);
      return true;
    }
  }
  
  async function eaChatCard(myActorName, myActorId, content = "") {
    content +=   `<p>Select targets for your spell, then click OK.</p>
                  <button exalted-arcana-id="${myActorId}" class="exalted-arcana-chatCard-prompt">OK</button>`
    let cm = await ChatMessage.create({
      content: content,
      speaker: ChatMessage.getSpeaker({alias: "Exalted Arcana Module"}),
      whisper: ChatMessage.getWhisperRecipients(myActorName, "GM")
    })
  
    await cm.setFlag("exalted-arcana", myActorName, myActorId)
  }

  function applyEffects(targetArray, effect) {
    const configEffect = CONFIG.statusEffects.find(e => (e.id === `combat-utility-belt.${effect}`));
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
    const myActorName = CustomItemRoll._actor.data.name;
    const myActorId = CustomItemRoll.actorId;
    const myActor = game.actors.get(myActorId);
    const tok = canvas.tokens.placeables.find(t => t.name === myActor.data.name);
    const tokenId = tok.id;
    castLevel = CustomItemRoll.params.slotLevel;

    if (!game.user.isGM  && !spells) {
      spells = await socket.executeAsGM("populateSpells");
    }

    spell = spells.find(s => s.name === item);

    if (!spell) return ui.notifications.info("Not a spell we're watching for.");

    if (queryTargets(tokenId)) return

    await new Promise(resolve => setTimeout(resolve, 200));
    eaChatCard(myActorName, myActorId);
  })
}

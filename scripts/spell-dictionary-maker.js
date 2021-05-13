// Dictionary of spells we're going to keep an eye out for
// and execute code for each spell.

const object = [
    {
        name: "Shield",
        self: true,
        attack: {},
        save: {
            isSave: false,
            type: ""
        },
        effect: "shield",
        level: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        name: "Bless",
        self: false,
        attack: {},
        save: {
            isSave: false,
            type: ""
        },
        effect: "bless",
        level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    {
        name: "Enlarge/Reduce",
        self: false,
        attack: {},
        save: {
            isSave: true,
            type: "con"
        },
        effect: "enlarge/reduce",
        level: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
    }
];

// Can this work in the module folder?
const path = 'modules/exalted-arcana/scripts/spell-dictionary'
const target = 'modules/exalted-arcana/scripts';
debugger;
await FilePicker.browse("data", path2)
    .then(loc => {
        if (loc.target == target) FilePicker.createDirectory("data", path, {})
    });
const jsonString = JSON.stringify(object, null, '');
const fileName = encodeURI("spell-dictionary.json");
const file = new File([jsonString], fileName, {type: 'application/json'});
const response = await FilePicker.upload("data", path, file);

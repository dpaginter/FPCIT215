// CHARACTER EXAMPLES
let characters = [
    {
        id: 1,
        name: "Frodo Baggins",
        race: "Half-ling",
        class: "Rogue",
        level: 5,
        hp: 35,
        deleted: false 
    },

    {
        id: 2,
        name: "Gandalf The Grey",
        race: "Maiar",
        class: "Wizard",
        level: 20,
        hp: 100,
        deleted: false 
    },

    {
        id: 3,
        name: "Legolas Thranduilion",
        race: "Elf",
        class: "Ranger",
        level: 10,
        hp: 30,
        deleted: false 
    },

    {
        id: 4,
        name: "Gimli",
        race: "Dwarf",
        class: "Barbarian",
        level: 10,
        hp: 70,
        deleted: false 
    },

    {
        id: 5,
        name: "Aragorn II Elessar",
        race: "Human",
        class: "Fighter",
        level: 10,
        hp: 65,
        deleted: false 
    },

    {
        id: 6,
        name: "Pippin Took",
        race: "Half-ling",
        class: "Bard",
        level: 5,
        hp: 25,
        deleted: false 
    },

    {
        id: 7,
        name: "Merry Brandybuck",
        race: "Half-ling",
        class: "Bard",
        level: 5,
        hp: 25,
        deleted: false 
    },

    {
        id: 8,
        name: "Samwise Gamgee ",
        race: "Half-ling",
        class: "Cleric",
        level: 5,
        hp: 30,
        deleted: false 
    },

    {
        id: 9,
        name: "Boromir, son of Denethor II",
        race: "Human",
        class: "Paladin",
        level: 70,
        hp: 10,
        deleted: false 
    },



    
];
// DISPLAY LIST
const displayCharacters = () => {
    const characterList = $('#character-list');
    characterList.empty();

    characters.forEach(character => {
        if (!character.deleted) {
            const listItem = $(`<li class="list-group-item character-item" data-id="${character.id}">${character.name}</li>`)
                .click(() => displayCharacterDetails(character.id));
            characterList.append(listItem);
        }
    });
}

// DISPLAY DETAIL
const displayCharacterDetails = (characterId) => {
    const character = characters.find(char => char.id === characterId);
    const detailsContainer = $('#character-details');
    detailsContainer.empty();

    const details = $(`
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${character.name}</h5>
                <p class="card-text">Race: ${character.race}</p>
                <p class="card-text">Class: ${character.class}</p>
                <p class="card-text">Level: ${character.level}</p>
                <p class="card-text">HP: ${character.hp}</p>
                <button class="btn btn-primary edit-btn" data-id="${character.id}" data-toggle="modal" data-target="#editCharacterModal">Edit</button>
                <button class="btn btn-danger" onclick="deleteCharacter(${characterId})">Delete Temporarily</button>
                <button class="btn btn-warning" onclick="deleteForever(${characterId})">Delete Forever</button>
            </div>
        </div>`
    );
    detailsContainer.append(details);
}

// EDIT CHAR
$('.edit-btn').click(function() {
    const characterId = $(this).data('id');
    const character = characters.find(char => char.id === characterId);
    fillEditForm(character);
});

$('#save-edit-btn').click(function() {
    const characterId = $('.edit-btn').data('id');
    const editedCharacter = {
        name: $('#editName').val(),
        race: $('#editRace').val(),
        class: $('#editClass').val(),
        level: parseInt($('#editLevel').val()),
        hp: parseInt($('#editHP').val())
    };
    updateCharacter(characterId, editedCharacter);
});

//EDIT FORM //MODAL
function fillEditForm(character) {
    $('#editName').val(character.name);
    $('#editRace').val(character.race);
    $('#editClass').val(character.class);
    $('#editLevel').val(character.level);
    $('#editHP').val(character.hp);
    $('#save-edit-btn').data('id', character.id);
}

// UPDATE CHAR
function updateCharacter(characterId, editedCharacter) {
    const index = characters.findIndex(char => char.id === characterId);
    characters[index] = editedCharacter;
    displayCharacters();
    $('#editCharacterModal').modal('hide');
}

// ADD CHAR //MODAL
const addCharacter = () => {
    const name = $('#name').val();
    const race = $('#race').val();
    const charClass = $('#class').val();
    const level = parseInt($('#level').val());
    const hp = parseInt($('#hp').val());

    const newCharacter = {
        id: characters.length + 1,
        name: name,
        race: race,
        class: charClass,
        level: level,
        hp: hp,
        deleted: false 
    };
    characters.push(newCharacter);
    displayCharacters();

    // INPUT
    $('#name, #race, #class, #level, #hp').val('');
    $('#addCharacterModal').modal('hide');
}

// TEMP DELETE
const deleteCharacter = (characterId) => {
    const character = characters.find(char => char.id === characterId);
    character.deleted = true;
    displayCharacters();
}

// PERM DELETE
const deleteForever = (characterId) => {
    const index = characters.findIndex(char => char.id === characterId);
    characters.splice(index, 1);
    displayCharacters();
}

// RESTORE
const restoreDeletedCharacters = () => {
    characters.forEach(character => {
        character.deleted = false; 
    });
    displayCharacters();
}

// INITALIZE
$(document).ready(function() {
    $('#add-character-btn').click(addCharacter);
    $('#restore-characters-btn').click(restoreDeletedCharacters); 
    displayCharacters();
});

//FETCH WITH AJAX AND API
const processClasses = (data) => {
    const classContainer = $('#classInfo');
    classContainer.empty();
    const classes = data.results;
    for (let i = 0; i < classes.length; i++) {

        const className = classes[i].name;
        const classItem = $('<div>').addClass('info-item').text(className);
        classContainer.append(classItem);
    }


}

const processRaces = (data) => {
    const raceContainer = $('#raceInfo');
    raceContainer.empty();
    const races = data.results;
    for (let i = 0; i < races.length; i++) {

        const raceName = races[i].name;
        const raceItem = $('<div>').addClass('info-item').text(raceName);
        raceContainer.append(raceItem);
    }



}

const fetchData = (url, successCallback, errorCallback) => {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (result, status, xhr) {
            successCallback(result);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
            errorCallback();
        },
    });
}

const fetchClasses = () => {
    const url = "https://www.dnd5eapi.co/api/classes";
    fetchData(url, processClasses, () => {
        const errorMessage = $('<div>').addClass('info-item').text('Error fetching data');
        $('#classInfo').html(errorMessage);
    });
}


const fetchRaces = () => {
    const url = "https://www.dnd5eapi.co/api/races";
    fetchData(url, processRaces, () => {
        const errorMessage = $('<div>').addClass('info-item').text('Error fetching data');
        $('#raceInfo').html(errorMessage);
    });
}


$(document).ready(function() {
    $('#add-character-btn').click(addCharacter);
    $('#restore-characters-btn').click(restoreDeletedCharacters); 
    fetchClasses();
    fetchRaces();
    displayCharacters();
});

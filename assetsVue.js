let elems = [];
async function dataToElements() {
    await pathfindersStaticArray;
    for(i = 0; i < pathfindersStaticArray.length; i++) {
        elems.push({
            text: `${pathfindersStaticArray[i].firstName}'s ID: ${pathfindersStaticArray[i].pathfinderID}`,
            date: `${decodeDate(pathfindersStaticArray[i].created)}`,
            firstname: `${pathfindersStaticArray[i].firstName}`,
            lastname: `${pathfindersStaticArray[i].lastName}`
        });
    }
}
console.log("Readiness!");
setTimeout(dataToElements, 2000);

let pathfinderCard_pathfinder = 0;

var pathfinderCard = Vue.component('pathfinder-card', {
    props: ['date', 'firstName', 'lastName'],
    template: '<div class="profile"><p class="date">Since {{ date }}</p><button class="selectpathfinder">Show Honors</button><h2>{{ firstName }} {{ lastName }}</h2></div>'
});

async function createPathfinderCardComponents() {
    const a = await pathfinders;
    for(p = 0; p < a.length; p++) {

    }
}

var app = new Vue({
    el: '#myclub',
    data: {
        profiles: [
        ]
    }
});

function mapPrototypeElements() {
    app.$data.profiles = [];
    for(x = 0; x < elems.length; x++) {
        app.$data.profiles.push(elems[x]);
    }
    console.log(app.$data.profiles);
}

setTimeout(mapPrototypeElements, 2000);
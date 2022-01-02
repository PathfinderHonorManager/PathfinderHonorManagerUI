var app = new Vue({
    el: '#content',
    data: {
        profiles: [
        ],
        honors: [
        ]
    }
});

let elems = [];
function dataToElements() {
    for(i = 0; i < pathfindersArray.length; i++) {
        elems.push({
            text: `${pathfindersArray[i].firstName}'s ID: ${pathfindersArray[i].pathfinderID}`,
            date: `${decodeDate(pathfindersArray[i].created)}`,
            firstname: `${pathfindersArray[i].firstName}`,
            lastname: `${pathfindersArray[i].lastName}`
        });
    }
}
let honorElems = []
function dataToHonors() {
    for (i = 0; i < honorsArray.length; i++) {
        honorElems.push({
            honorname: `${honorsArray[i].name}`,
            level: `${honorsArray[i].level}`
        });
    }
} 
function packageElementData() {
    dataToHonors();
    dataToElements();
}
console.log("Readiness!");
setTimeout(packageElementData, 2000);

let pathfinderCard_pathfinder = 0;

var pathfinderCard = Vue.component('pathfinder-card', {
    props: ['date', 'firstName', 'lastName'],
    template: '<div class="card"><p class="specialitalic">Since {{ date }}</p><button class="selectpathfinder">Show Honors</button><h2>{{ firstName }} {{ lastName }}</h2></div>'
});

var honorCard = Vue.component('honor-card', {
    props: ['title', 'level'],
    template: '<div class="card"><h2>{{title}}</h2><p class="special-italic">Level {{ level }}</p></div>'
});

function mapPrototypeElements() {
    app.$data.profiles = [];
    app.$data.honors = [];
    for(x = 0; x < elems.length; x++) {
        app.$data.profiles.push(elems[x]);
    }
    for(x = 0; x < honorElems.length; x++) {
        app.$data.honors.push(honorElems[x]);
    }

    console.log("Vue App data:");
    console.log(app.$data.profiles);
    console.log(app.$data.honors);
}
setTimeout(mapPrototypeElements, 2000);
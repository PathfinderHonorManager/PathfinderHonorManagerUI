var app = new Vue({
    el: '#vuestuff',
    data: {
        message: '',
        profiles: [
        ],
        honors: [
        ],
        pathfinderselector: 'nobody',
        pathfinderindex: 0,
        pathfinderhonors: []
}});

let elems = [];
function dataToElements() {
    for(i = 0; i < pathfindersArray.length; i++) {
        elems.push({
            text: `${pathfindersArray[i].firstName}'s ID: ${pathfindersArray[i].pathfinderID}`,
            date: `${decodeDate(pathfindersArray[i].created)}`,
            firstname: `${pathfindersArray[i].firstName}`,
            lastname: `${pathfindersArray[i].lastName}`,
            functionfile: i,
            honors: DATA.pathfinders[i].pathfinderHonors
        });
    }
}
let honorElems = []
function dataToHonors() {
    for (i = 0; i < honorsArray.length; i++) {
        honorElems.push({
            honorname: `${honorsArray[i].name}`,
            level: `${honorsArray[i].level}`,
            imagepath: `https://pathfinderhonor.azureedge.net/assets/honors/small/${honorsArray[i].patchPath}`
        });
    }
}

function packageElementData() {
    dataToHonors();
    dataToElements();
}
setTimeout(packageElementData, 2000);
console.log("Readiness!");

let pathfinderCard_pathfinder = 0;

var pathfinderCard = Vue.component('pathfinder-card', {
    props: ['date', 'firstName', 'lastName', 'honorset'],
    template: '<div class="card"><p class="specialitalic">Since {{ date }}</p><button class="selectpathfinder" :id="honorset" onclick="openHonorSet(this.id)">{{firstName}}\'s Honors</button><h2>{{ firstName }} {{ lastName }}</h2></div>'
});

var honorCard = Vue.component('honor-card', {
    props: ['title', 'level', 'image'],
    template: '<div class="card"><h2>{{title}}</h2><p class="special-italic">Level {{ level }}</p><img :src="image" alt="image could not be retrieved." class="honorimg"></div>'
});

var pathfinderHonorCard = Vue.component('honor-card-p', {
    props: ['title', 'status', 'pathfinder', 'honor', 'indexer'],
    template: `<div class="card">
                    <h2>{{title}}</h2>
                    <div class="dropdown">
                        <button class="status-changeable">{{status}}</button>
                        <div class="dropdowncnt">
                            <button class="dropdownoption" :data-ownerid="pathfinder" :data-honorid="honor" data-setterstatus="Planned" onclick="requestHonorUpdate(this)" :data-index="indexer">Planned</button>
                            <button class="dropdownoption" :data-ownerid="pathfinder" :data-honorid="honor" data-setterstatus="Earned" onclick="requestHonorUpdate(this)" :data-index="indexer">Earned</button>
                            <button class="dropdownoption" :data-ownerid="pathfinder" :data-honorid="honor" data-setterstatus="Awarded" onclick="requestHonorUpdate(this)" :data-index="indexer">Awarded</button>
                        </div>
                    </div>
                </div>`
});

function mapPrototypeElements() {
    app.$data.profiles = elems;
    app.$data.honors = honorElems;
}
setTimeout(mapPrototypeElements, 2000);
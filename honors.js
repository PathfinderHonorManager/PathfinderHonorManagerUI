var baseAddress = "https://pathfinderhonormanager.azurewebsites.net/api"
var honorURI = "/honors";
var pathfinderURI = "/pathfinders";


const pathfinders = fetch(baseAddress + pathfinderURI)
.then((response) => response.json())
.then((pathfinders) => {
    return pathfinders;
});

async function getPathfinders () {
    const a = await pathfinders;
    console.log(a);
    return a;
}

function selectPathfinder () {
    let pathfinders = getPathfinders();
    for (let s of pathfinders) {
        if (pathfinders) {
            return;
        }
    }
}

async function getPathfinderHonors () {

}

var content = document.getElementById("content");
function clearContent () {
    while (content.lastChild) {
        content.removeChild(content.lastChild);
    }
}

var title = document.getElementById("titleheader");
function initPage(pageName) {
    clearContent();
    title.textContent = pageName;
}

function  decodeDate (date) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = date.match("-(.*)-")[1];
    let day = date.match(`${month + "-"}(.*)T`)[1];
    let d = new Date(date);
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();/*months[month - 1] + " " + day + ", " + date.match(/.{1,4}/i)*/
}

getPathfinders();
async function renderPathfinders () {
    const a = await pathfinders;
    //set title header text
    initPage("My Club");
    for (p = 0; p < a.length; p++) {
        console.log(a[p].firstName);
        //pathfinder profile box
        var pathfinderProfile = document.createElement("div");
        pathfinderProfile.setAttribute("class", "profile");
        pathfinderProfile.setAttribute("id", a[p].firstName + "'s-profile");

        //nav button
        var profileButton = document.createElement("button");
        profileButton.setAttribute("class", "selectpathfinder");
        profileButton.textContent = "Show Honors";
        pathfinderProfile.appendChild(profileButton);

        //pathfinder date
        var pathfinderDate = document.createElement("p");
        pathfinderDate.setAttribute("class", "date");
        pathfinderDate.textContent = "Since " + decodeDate(a[p].created);
        pathfinderProfile.appendChild(pathfinderDate);

        //pathfinder name
        var pathfinderName = document.createElement("h1")
        pathfinderName.textContent = a[p].firstName + " " +  a[p].lastName;
        pathfinderProfile.appendChild(pathfinderName);

        //append pathfinder profile box
        content.appendChild(pathfinderProfile);
        
    }
}
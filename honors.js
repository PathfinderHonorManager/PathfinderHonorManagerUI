

var baseAddress = "https://pathfinderhonormanager.azurewebsites.net/api"
var honorURI = "/honors";
var pathfinderURI = "/pathfinders";


const pathfinders = fetch(baseAddress + pathfinderURI)
.then((response) => response.json())
.then((pathfinders) => {
    return pathfinders;
});

pathfindersStaticArray = [];
async function getPathfinders () {
    const a = await pathfinders;
    console.log(a);
    pathfindersStaticArray = a;

    return a;
}
function makeThingsWork() {
getPathfinders();
}

makeThingsWork();

async function getPathfinderHonors (pathfinderID) {

}

var content = document.getElementById("content");
var subcontent = document.getElementById("subcontent");
var tabs = document.getElementsByClassName("tab");
function clearContent () {
    while (content.lastChild) {
        content.removeChild(content.lastChild);
    }
}

var title = document.getElementById("titleheader");
var pagePath = "homepage";
let page = document.getElementById(pagePath);
function initPage(pageName, pageID) {
    console.log(`You are currently viewing the ${pageName} page.`)
    pagePath = pageID;
    document.getElementById(pagePath);
    function hideChildren () {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].getAttribute("id") === pageID) {
                tabs[i].style.display = "block";
                console.log("you done good, kid.");
            } else {
            tabs[i].style.display = "none";
            }
        }
    }
    hideChildren();
    page.style.visibility = "visible";
    title.innerHTML = pageName;
}

function  decodeDate (date) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date(date);
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

getPathfinders();
initPage("Pathfinder Honor Manager", "homepage");
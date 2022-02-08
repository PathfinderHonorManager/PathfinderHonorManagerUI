let paginations = 1;
function searchHonors(query) {
    let tokens = query.toLowerCase().split(' ');
    let props = honorsArray.map(obj => Object.values(obj)[1].toLowerCase());
    let matches = props.filter(str => tokens.length === 0 || tokens.every(t => str.indexOf(t) > -1)); 
    return matches;
}

var newHonors = [];
var renderedHonors = [];


var thePaginator = document.getElementById("thepaginator");
thePaginator.style.display = "none";

function renderHonorsSearch(p) {
    renderedHonors = honorElems.filter(obj => newHonors.indexOf(Object.values(obj)[0].toLowerCase()) > -1).slice(0, (p * paginations));
    app.$data.honors = renderedHonors;
    if (newHonors.length === renderedHonors.length) {
        thePaginator.style.display = "none";
    } else {
        thePaginator.style.display = "inherit";
    }
}

//Event listeners
var queryElement = document.getElementById("honorsearcharea");
queryElement.addEventListener('keyup', function (e) {
    paginations = 1;
    newHonors = searchHonors(e.target.value);
    renderHonorsSearch(6);
});

var content = document.getElementById("content");
var subcontent = document.getElementById("subcontent");
var tabs = document.getElementsByClassName("tab");

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

function decodeDate (date) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date(date);
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

initPage("Pathfinder Honor Manager", "homepage");
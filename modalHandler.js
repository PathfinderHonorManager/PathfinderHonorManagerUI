var vignette = document.getElementsByClassName("vignette")[0];
var box = document.getElementById("honorcase");
vignette.style.display = "none";
box.style.display = "none";

var bounce = true;
var bounceBox = () => bounce = !bounce;
function callShunBox (){
    box.style.animationDirection = bounce? "normal":"reverse";
    box.style.display = bounce? "flex":"none";
    vignette.style.display = bounce? "block":"none";
    bounceBox();
}

function openHonorSet (el) {
    let c = DATA.pathfinders[el].firstName;
    app.$data.pathfinderselector = c;
    app.$data.pathfinderindex = el;
    app.$data.pathfinderhonors = [...app.$data.profiles[el].honors];
    console.log(app.$data.pathfinderhonors);
    callShunBox();
}

var dropdwnPathfinderIndex = -1;
var dropdwnIndex = -1;
function requestHonorUpdate(status) {
    console.log(status);
    console.log(dropdwnPathfinderIndex);
    console.log(dropdwnIndex);
}
function changeHonorStatus(pathfinderIndex, honorIndex, newStat) {
    let pathfinderID = DATA.pathfinders[pathfinderIndex].pathfinderID;
    let honorID = DATA.pathfinders[pathfinder].pathfidnerHonors[honorIndex].honorID;
    putHonorStatus(pathfinderID, honorID, newStat);
}

vignette.addEventListener('mousedown', function (e) {
    callShunBox();
});
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
    callShunBox();
}

vignette.addEventListener('mousedown', function (e) {
    callShunBox();
});
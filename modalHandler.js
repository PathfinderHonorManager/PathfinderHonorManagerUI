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

function requestHonorUpdate(status) {
    console.log(status.parentElement.parentElement.parentElement.tabindex);
    putHonorStatus(status.dataset.ownerid, status.dataset.honorid, status.dataset.setterstatus);
    status.parentNode.parentNode.getElementsByClassName("status-changeable")[0].innerText = status.dataset.setterstatus;
    status.parentNode.parentNode.style.height = "0";
    setTimeout(200, function () {return 1;});
    status.parentNode.parentNode.style = null;
}

vignette.addEventListener('mousedown', function (e) {
    callShunBox();
});
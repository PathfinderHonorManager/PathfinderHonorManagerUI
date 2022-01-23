var vignette = document.getElementsByClassName("vignette")[0];
var box = document.getElementById("honorcase");
vignette.style.display = "none";
box.style.display = "none";

var bounce = 1;
var bounceBox = () => bounce = (((bounce + 1) % 2) + 2) % 2;
function callShunBox (){
    box.style.animationDirection = bounce? "normal":"reverse";
    box.style.display = bounce? "flex":"none";
    vignette.style.display = bounce? "block":"none";
    bounceBox();
}

function openHonorSet () {
    function inferTagIndex () {
        // for (tag = 0; tag < DATA.pathfinders.length; tag++) {
        //     console.log(tag);
        //     if (document.getElementsByClassName("selectpathfinder")[tag].onclick) {
        //         return tag;
        //     }
        // }

    }
    let index = inferTagIndex();
    let c = DATA.pathfinders[index].firstName;
    console.log(c);
    box.innerHTML = `${c}'s Honors`;
    app.$data.selectpathfinder = c;
    callShunBox();
}

vignette.addEventListener('mousedown', function (e) {
    console.log(e);
    openHonorSet();
})
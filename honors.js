// var honorURI = "/honors";
// var pathfinderURI = "/pathfinders";
// var pathfinderID = "";
// var PHURI = "/PathfinderHonors";
// var fetched = 0;

// const pathfinders = fetch(baseAddress + pathfinderURI)
// .then((response) => response.json())
// .then((pathfinders) => {
//     return pathfinders;
// });

// const honors = fetch(baseAddress + honorURI)
// .then((response) => response.json())
// .then((honors) => {
//     return honors;
// });

//var pathfinderHonors;

// let pathfindersArray = [];
// async function getPathfinders () {
//     const a = await pathfinders;
//     console.log(a);
//     pathfindersArray = a;
//     fetched = 1;
//     return a;
// }
// getPathfinders();

// var honorsArray = [];
// async function getHonors () {
//     const a = await honors;
//     console.log(a);
//     honorsArray = a;
//     fetched = 2;
//     return a;
// }
// getHonors();

// let pathfinderIdsHonors = [];
// async function getPathfinderHonors (ID) {
//     var coolParser = (obj) => obj.json() ?? "here's some crap.";
//     try {
//     var pathfinderHonors = fetch(baseAddress + pathfinderURI + "/" + ID + "/PathfinderHonors", {
//         "method":"GET",
//         "Access-Control-Allow-Origin": "*"
//     })
//     .then(a => coolParser(a));
//     pathfinderIdsHonors = pathfinderHonors;
//     } catch (err) {
//         console.error(`An Error (${err}) has occured with fetch function.`);
//     }
//     console.log(await pathfinderHonors);
//     return pathfinderHonors;
// }
// getPathfinderHonors("2080a454-1ee3-483b-9dde-55880109db70");
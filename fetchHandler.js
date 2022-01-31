var baseAddress = "https://pathfinderhonormanager.azurewebsites.net/api";
var DATA = {
    pathfinders: [],
    honors: [],
    temp: {
        pathfinderHonors: [],
    }
}

//Fetch things function
async function getTheTHING (URI, ID) {
    var coolParser = (obj) => {return obj.json() ?? "here's some crap."};
    var ifID = (id) => {
        if (id == null) {
            return "";
        } else {
            return "/" + id + "/PathfinderHonors";
        }
    }
    let PATH = baseAddress + URI + ifID(ID);
    console.log(PATH);
    try {
    var result = fetch(PATH, {
        "method":"GET",
        "Access-Control-Allow-Origin": "*"
    })
    .then(a => coolParser(a));
    } catch (err) {
        console.log(a);
        console.error(`An Error (${err}) has occured with fetch function.`);
    }
    console.log(result);
    return await result;
}

//wait for things to happen function
async function waitFor (v) {
    return await v;
}


//pathfinder/honor vaariables:
let pathfindersArray = [];
var honorsArray = [];

let pathfinderIdsHonors = [];

//Run fetch functions synchronosly
async function getAllTheTHINGS () {
    DATA.pathfinders = await getTheTHING("/pathfinders");
    DATA.honors = await getTheTHING ("/honors");
    pathfindersArray = DATA.pathfinders;
    honorsArray = DATA.honors;
    console.log(DATA);

}

getAllTheTHINGS();

//statatus is actually just status. :)
function putHonorStatus(pathfinderID, honorID, statatus) {
    fetch(baseAddress + "/pathfinders" + pathfinderID + "/PathfinderHonors" + honorID, {
        "method": "PUT",
        "headers": {'Content-Type': 'application/json'},
        "redirect": "follow",
        "body": JSON.stringify({status: statatus})
    })
}
var permission = false;
var tries = 1000000;
let submition = "";
function Submit(password) {
    confirm("Are you sure the password is: " + password);
    console.log("Processing request");
    submition = password;
    authenticate();
}
function authenticate() {
    var authString = "";
    for (i=0; i<64; i++) {
        authString = authString + String(Math.round(Math.random() * 9));
    }
    if (tries == 0) {
        console.log("You have no more tries left. Have a nice day!");
        return;
    }
    if (authString === submition) {
        permission = true;
    } else {
        tries -= 1;
        console.error(`Password does not match, and has now changed to anther unguessable 64-character string. You have ${tries} tries left. Good luck!`);
    }
}

function pleaseAuthenticate() {
    console.log("Please provide 64-character password. This can be done by inserting string into the Submit() function.");
}

//pleaseAuthenticate();
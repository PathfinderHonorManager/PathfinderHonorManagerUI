const baseURL = "https://pathfinderhonormanager.azurewebsites.net/api/";

async function get(endpoint: string) {
  try {
    let response = new Object();
    response = await fetch(baseURL + endpoint)
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        return response;
      });
  } catch (err) {
    console.error(`Could not get response from ${endpoint}, because: ${err}`);
  }
}

export const pathfinders = get("pathfinders").then(res => Array(res));
export const honors = get("honors");

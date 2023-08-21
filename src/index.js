/**
 * @author CaptainCluster
 * @link https://github.com/CaptainCluster
 */
import { createJson } from "./components/jsonobject.js"; 
import { predictButtonProcess } from "./components/estimate.js";
import { buildChart } from "./components/chartbuilder.js";

if (document.readyState !== "loading") {
  mainFunction();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    mainFunction();
  });
}

/**
 * @description - The first function to be started
 */
async function mainFunction() {
  const municipalityData = await getMunicipalities();
  const jsonQuery = createJson("SSS");
  const data = await getData(jsonQuery);
  const years = Object.values(data.dimension.Vuosi.category.label);
  const population = data.value;
  
  buildChart(years, population);
  buttonEvents(municipalityData, jsonQuery);
}

/**
 * @description - Functionalities for submitButton and predictButton
 * @param {data} municipalityData 
 * @param {JSON} jsonQuery 
 */
function buttonEvents(municipalityData, jsonQuery){
  const submitButton = document.getElementById("submit-municipality");
  const predictButton = document.getElementById("add-data");
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    submitButtonProcess(municipalityData, jsonQuery);
  });
  predictButton.addEventListener("click", () => {
    predictButtonProcess(municipalityData, jsonQuery)
  });
}

/**
 * @description - Making the program work case insensitively by replacing the first letters of
 * The user input and the name of the fetched municipality (both match) with ""
 * @param {data} municipalityData 
 * @param {JSON} jsonQuery 
 * @returns {jsonQuery}
 */
function findInputResults(municipalityData, jsonQuery){
  const userInput = document.getElementById("input-municipality").value;

  for(var i = 0; i < municipalityData[1].length; i++){
    var compareUserInput = userInput.replace(userInput[0], "");
    var compareMunicipality = municipalityData[1][i].replace(municipalityData[1][i][0], ""); 
    if(compareUserInput == compareMunicipality){
      jsonQuery = createJson(municipalityData[0][i]);
      break;
    }
  }
  return jsonQuery;
}

/**
 * @description - Fetching all the necessary data, based on the user input, and creating 
 * a chart (without predictions for "future" years) 
 * @param {data} municipalityData 
 * @param {JSON} jsonQuery 
 * @returns {data}
 */
async function submitButtonProcess(municipalityData, jsonQuery){
    jsonQuery = findInputResults(municipalityData, jsonQuery);
    const data = await getData(jsonQuery);
    const years = Object.values(data.dimension.Vuosi.category.label);
    const population = data.value;
    buildChart(years, population);
    return data;
}

/**
 * @description - 
 * @param {JSON} jsonQuery 
 * @returns {data}
 */
async function getData(jsonQuery) {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  //Sending a POST request to the URL
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonQuery)
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();
  return data;
}

/**
 * @returns {municipalityData}
 */
async function getMunicipalities(){
  const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url);
  const data = await res.json();
  const municipalityKey = data.variables[1].values;
  const municipalityLabel = data.variables[1].valueTexts;
  const municipalityData = [municipalityKey, municipalityLabel];
  return municipalityData;
}

export { submitButtonProcess }
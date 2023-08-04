/**
 * @author CaptainCluster
 * @link https://github.com/CaptainCluster
 */
import { processJson } from "./jsonprocess.js";
import { predictButtonProcess } from "./estimate.js";
import { buildChart } from "./chartbuilder.js";

if (document.readyState !== "loading") {
  mainFunction();
} else {
  document.addEventListener("DOMContentLoaded", () => {
  });
  mainFunction();
}

async function mainFunction() {
  const submitButton = document.getElementById("submit-municipality");
  const predictButton = document.getElementById("add-data");
  const municipalityData = await getMunicipalities();
  const jsonQuery = processJson("SSS");
  const data = await getData(jsonQuery);
  const years = Object.values(data.dimension.Vuosi.category.label);
  const population = data.value;
  
  buildChart(years, population);

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    submitButtonProcess(municipalityData, jsonQuery);
  });
  predictButton.addEventListener("click", () => {
    predictButtonProcess(municipalityData, jsonQuery)
  });
}

function findInputResults(municipalityData, jsonQuery){
  const userInput = document.getElementById("input-municipality").value;
  for(var i = 0; i < municipalityData[1].length; i++){
    var compareUserInput = userInput.replace(userInput[0], "");
    var compareMunicipality = municipalityData[1][i].replace(municipalityData[1][i][0], ""); 
    if(compareUserInput == compareMunicipality){
      jsonQuery = processJson(municipalityData[0][i]);
      break;
    }
  }
  return jsonQuery;
}

async function submitButtonProcess(municipalityData, jsonQuery){
    jsonQuery = findInputResults(municipalityData, jsonQuery);
    const data = await getData(jsonQuery);
    const years = Object.values(data.dimension.Vuosi.category.label);
    const population = data.value;
    buildChart(years, population);
    return data;
}


async function getData(jsonQuery) {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

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
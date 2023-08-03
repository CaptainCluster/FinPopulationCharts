/**
 * @author CaptainCluster
 * @link https://github.com/CaptainCluster
 */

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

async function predictButtonProcess(municipalityData, jsonQuery){
  const data = await submitButtonProcess(municipalityData, jsonQuery);
  makePrediction(data);
}

function processJson(userInput){
  const jsonQuery = {
    query: [
      {
        code: "Vuosi",
        selection: {
          filter: "item",
          values: [
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021"
          ]
        }
      },
      {
        code: "Alue",
        selection: {
          filter: "item",
          values: [userInput]
        }
      },
      {
        code: "Tiedot",
        selection: {
          filter: "item",
          values: ["vaesto"]
        }
      }
    ],
    response: {
      format: "json-stat2"
    }
  };
  return jsonQuery;
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

async function makePrediction(data){ 
  const years = Object.values(data.dimension.Vuosi.category.label);
  const population = data.value;
  const futureYears = ["2022", "2023", "2024"];

  for(var turn = 0; turn < 3; turn++){ 
    let divider = 0;
    let sum = 0;
    let result = 0
    for(var i = 0; i < 21; i++){
      sum = sum + population[i+1]-population[i];
      divider++;
      result = population[21+turn] + sum/divider;
    }
    population.push(Math.round(result));
    years.push(futureYears[turn]);
  }
  buildChart(years, population)
}

async function buildChart(years, population) {
  const chartData = {
    labels: years,
    datasets: [{ values: population }]
  };

  const chart = new frappe.Chart("#chart", {
    title: "The population of chosen municipality",
    data: chartData,
    type: "line",
    height: 450,
    colors: ["#eb5146"],
    lineOptions: {
      hideDots: 1,
      regionFill: 0
    }
  });
  chart.draw();
}


function bootUpProcess(){
  if (document.readyState !== "loading") {
    console.log("Document is ready!");
    mainFunction();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Document is ready after waiting!");
    });
    mainFunction();
  }
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

  submitButton.addEventListener("click", async function(event){
    event.preventDefault();
    submitButtonProcess(municipalityData, jsonQuery);
  });
  predictButton.addEventListener("click", function(){
    predictButtonProcess(municipalityData, jsonQuery)
  });
}
bootUpProcess();
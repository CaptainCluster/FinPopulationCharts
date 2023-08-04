import { buildChart } from "./chartbuilder.js";
import { submitButtonProcess } from "./index.js";

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

async function predictButtonProcess(municipalityData, jsonQuery){
  const data = await submitButtonProcess(municipalityData, jsonQuery);
  makePrediction(data);
}

export { predictButtonProcess }
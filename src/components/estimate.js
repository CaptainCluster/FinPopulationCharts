import { buildChart } from "./chartbuilder.js";
import { submitButtonProcess } from "./index.js";

/**
 * @description - Estimating how the population developes in the future,
 * based on the average yearly change.
 * @param {data} data 
 */
async function makePrediction(data){ 
    const years = Object.values(data.dimension.Vuosi.category.label);
    const population = data.value;
    const futureYears = ["2022", "2023", "2024"];

    //Proceeding to do the calculation...
    for(let turn = 0; turn < 3; turn++){ 
      //Since we will make predictions for 3 years, this loop iterates 3 times
      //Note that the variable turn is used below in order to add the average
      //of the population change between two years below on the 2nd for-loop.
      //This way we can make sure the estimate is proper, for the proper year.
      let divider = 0;
      let sum = 0;
      let result = 0

      for(let i = 0; i < 21; i++){ //We have data for 22 years, and that determines how long this loop iterates

        //We will calculate 
        sum = sum + population[i+1]-population[i];
        divider++;
        result = population[21+turn] + sum/divider;
      }
      //As we get the results for a specific year, we will add them to a list
      population.push(Math.round(result));
      years.push(futureYears[turn]);
    }
    //With all the requirements being met, we can finally build the chart.
    buildChart(years, population)
  }

  /**
   * @description - A process that gets the necessary data and utilizes the function makePrediction
   * @param {data} municipalityData 
   * @param {JSON} jsonQuery 
   */
async function predictButtonProcess(municipalityData, jsonQuery){
  const data = await submitButtonProcess(municipalityData, jsonQuery);
  makePrediction(data);
}

export { predictButtonProcess }
/** 
* @author CaptainCluster
* @link https://github.com/CaptainCluster
*/

/*
We will use frappe-charts to create a chart with the population of a selected municipality
based on the year (x-axis) and the population (y-axis).
*/

/**
 * @param {list} years 
 * @param {list} population 
 */
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

export { buildChart }
/**
 * @author CaptainCluster
 * @link https://github.com/CaptainCluster
 */

//NOTE! A lot of the data is behind tags written in Finnish!

/**
 * @description - Creates a JSON object based on the input (municipality) given by the user
 * @param {String} userInput 
 * @returns {jsonQuery}
 */
function createJson(userInput){
  const jsonQuery = {
    query: [
      {
        code: "Vuosi", //year
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
        code: "Alue", //region
        selection: {
          filter: "item",
          values: [userInput]
        }
      },
      {
        code: "Tiedot", //information
        selection: {
          filter: "item",
          values: ["vaesto"] //population
        }
      }
    ],
    response: {
      format: "json-stat2"
    }
  };
  return jsonQuery;
}

export { createJson }
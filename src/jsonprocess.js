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

export { processJson }
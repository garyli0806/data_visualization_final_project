/*
Author: Gary Li, Daniel Lee, Alyssa Yanez
Course: CSC444
Assignment: Assignment 12
Instructor: Dr.Picoral
TAs: Tanner Finken
Due date: 12/12/22
*/

// create spec
var spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 400,
    height: 600,
    padding: 50,

    // Projections for map interactivity
    projections: [{
        name: "projection",
        type: "mercator",
    }],
    // World map and happiness/life expectancy data
    data: [{
            name: "happiness",
            url: "https://raw.githubusercontent.com/garyli0806/csc444_assignment11/main/data/world_happiness_2020_2021.csv",
            format: { type: "csv" },
            transform: [{
                    type: "filter",
                    expr: "datum.year == 2021"
                },
                {
                    type: "formula",
                    as: "life_expectancy",
                    expr: "datum.healthy_life_expectancy / 1"
                }
            ]
        },
        {
            name: "world",
            url: "https://raw.githubusercontent.com/vega/datalib/master/test/data/world-110m.json",
            format: {
                type: "topojson",
                feature: "countries",
            },
            transform: [{
                    type: "lookup",
                    from: "happiness",
                    key: "id",
                    fields: ["id"],
                    values: ["country", "happiness_score", "life_expectancy"]
                },
                {
                    "type": "formula",
                    "as": "centroid",
                    "expr": "geoCentroid('projection', datum)"
                }
            ]
        },
        {
            name: "graticule",
            transform: [
                { type: "graticule", step: [15, 15] }
            ]
        }
    ],
    // Scales to show happiness and life expectancy
    scales: [{
        name: "fillScale",
        domain: { data: "world", field: "happiness_score" },
        range: { scheme: "greens" }
    }, {
        name: "sizeScale",
        // domain: { data: "happiness", field: "life_expectancy" },
        domain: [40, 80],
        range: [0, 1000]
    }],

    marks: [{
            type: "shape",
            from: { data: "graticule" },
            encode: {
                enter: {
                    strokeWidth: { value: 1 },
                    stroke: { value: "#ddd" },
                    fill: { value: null }
                }
            },
            transform: [
                { type: "geoshape", projection: "projection" }
            ]
        },

        {
            type: "shape",
            from: { data: "world" },
            encode: {
                enter: {
                    strokeWidth: { "value": 0.5 },
                    stroke: { "value": "#bbb" },
                    fill: { field: "happiness_score", scale: "fillScale" },
                    tooltip: { signal: "datum.country + ': ' + datum.happiness_score + ' happiness, ' + datum.life_expectancy + ' life expectancy (years)'" }

                }
            },
            transform: [
                { type: "geoshape", projection: "projection" }
            ]
        },
        {
            "name": "circles",
            "type": "symbol",
            "from": { "data": "world" },
            encode: {
                enter: {
                    size: { scale: "sizeScale", field: "life_expectancy" },
                    "x": { "field": "centroid[0]" },
                    "y": { "field": "centroid[1]" },
                    opacity: { value: 0.9 },
                    fill: { value: "steelblue" },
                    tooltip: { signal: "datum.country + ': ' + datum.happiness_score + ' happiness, ' + datum.life_expectancy + ' life expectancy (years)'" }
                }
            },
        },

    ],
    legends: [{
        fill: "fillScale",
        title: "Happiness Score",
        orient: "left",
    }, {
        title: "Life Expectancy (years)",
        type: "symbol",
        size: "sizeScale",
        orient: "bottom-left",
        symbolFillColor: "steelblue"
    }],
    title: {
        text: "Happiness Score vs Health Life Expectancy across countries",
        offset: 50,
        fontSize: 12,
        align: { value: "center" }
    }
};

// create runtime
var runtime = vega.parse(spec);

// create view
var view = new vega.View(runtime)
    .logLevel(vega.Error)
    .renderer("svg")
    .initialize("#map")
    .hover();

// run it
view.run();
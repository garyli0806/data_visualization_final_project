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
    width: 400,
    height: 600,
    padding: 20,
    signals: [{
            name: "year",
            value: ['2020'],
            bind: {
                input: "select",
                options: ['2020', '2021']
            }
        },
        {
            name: "displayNum",
            value: {},
            on: [{
                    events: "symbol:mouseover",
                    update: "datum"
                },
                {
                    events: "symbol:mouseout",
                    update: "{}"
                }
            ]
        }
    ],
    data: [{
        name: "happiness",
        url: "https://raw.githubusercontent.com/garyli0806/csc444_assignment11/main/data/world_happiness_2020_2021.csv",
        format: { type: "csv" },
        transform: [{
            type: "filter",
            expr: "datum.year == year"
        }]
    }],
    scales: [{
            name: "xScale",
            type: "linear",
            domain: [0, 10],
            range: "width"
        },
        {
            name: "yScale",
            type: "linear",
            domain: { data: "happiness", field: "healthy_life_expectancy" },
            range: "height",
            zero: false
        }
    ],
    marks: [{
            type: "symbol",
            from: { data: "happiness" },
            encode: {
                update: {
                    x: { field: "happiness_score", scale: "xScale" },
                    y: { field: "healthy_life_expectancy", scale: "yScale" }
                }
            }
        },
        {
            type: "text",
            encode: {
                enter: {
                    dx: { value: -7 },
                    dy: { value: -6 },
                    align: { value: "center" }
                },
                update: {
                    x: { signal: "displayNum.happiness_score", scale: "xScale" },
                    y: [{ test: "displayNum.healthy_life_expectancy > 0", signal: "displayNum.healthy_life_expectancy", scale: "yScale" }, { value: 200 }],
                    text: { signal: "format(displayNum.healthy_life_expectancy,'.1f')" },
                    fillOpacity: [
                        { test: "displayNum.healthy_life_expectancy > 0", value: 1 },
                        { value: 0 }
                    ]
                }
            }
        }
    ],
    axes: [{
            scale: "xScale",
            orient: "bottom",
            title: "Happiness Score",
            titleFontSize: 10,
        },
        {
            scale: "yScale",
            orient: "left",
            title: "Healthy Life Expectancy",
            titleFontSize: 10
        }
    ],
    title: {
        text: "Health Life Expectancy vs Happiness Score",
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
    .initialize("#scatterplot")
    .hover();

// run it
view.run();
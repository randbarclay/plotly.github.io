// Initializes the page with a default plot for first item in dropdown
function init() {
    d3.json("./samples.json").then(function(d) {
        var data = d;

        // populate dropdown menu
        d3.select("#selDataset").selectAll("option")
            .data(Object.values(data.names))
            .enter().append("option").attr("value", testSubject => testSubject)
            .text(testSubject => testSubject);

        // populate demographic info
        d3.select("#sample-metadata").selectAll("tr")
            .data(Object.entries(data.metadata[0]))
            .enter().append("tr")
            .html(function ([k,v]) {
                return `<td><strong><font size="1">${k}: </strong></font></td> 
                <td><font size="1">${v}</font></td>`});

        // define plot data
        var values = data.samples[0].sample_values;
        var ids = data.samples[0].otu_ids;
        var labels = data.samples[0].otu_labels;
        var scrubs = data.metadata[0].wfreq;
        
        // slice & reverse values & ids
        var valueSort = values.slice(0,10).reverse();
        var labelSort = labels.slice(0,10).reverse();
        var idSort = ids.slice(0,10).reverse();
        var chartLabels = idSort.map(l => "OTU " + l);

        var barData = {
            type: "bar",
            x: valueSort,
            y: chartLabels,
            text: labelSort,
            orientation: "h",
            marker: {
                color: "#6ba0f5",
                opacity: .6,
                line: {
                    color: "#2d4366",
                    width: 1.5
                }
            }
        };

        var barLayout = {
            title: "Top 10 OTUs<br>(Operational Taxonomic Units aka Microbial Species)"
        };

        var bubbleData = {
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                color: ids,
                size: values,
                labels: labels,
                type: "scatter"
                }
        };

        var bubbleLayout = {
            title: "OTU (Operation Taxonomic Unit) Frequency",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Frequency"}
        };

        var gaugeData = {
            domain: {
                x: [0,1],
                y: [0,1]
            },
            value: scrubs,
            //title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
            type: "indicator",
            mode: "gauge",
            //labels: ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
            gauge: {
                steps: [
                    {range: [0,1], color: "#f8f3ec"},
                    {range: [1,2], color: "#f4f1e4"},
                    {range: [2,3], color: "#e9e6c9"},
                    {range: [3,4], color: "#e5e8b0"},
                    {range: [4,5], color: "#d5e599"},
                    {range: [5,6], color: "#b7cd8f"},
                    {range: [6,7], color: "#8ac086"},
                    {range: [7,8], color: "#88bc8d"},
                    {range: [8,9], color: "#84b588"}
                ],
                axis: {range: [0, 9], 
                    tickvals: [0,1,2,3,4,5,6,7,8,9]},
                bar: {color: "#840000"}
            }
        };

        var gaugeLayout = {
            title: "Belly Button Washing Frequency<br>Scrubs per Week"
        }

        Plotly.newPlot("bar", [barData], barLayout);
        Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
        Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
    });
};

// Call optionChanged() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    var testSubject = dropdownMenu.property("value");
    // identify index # of selected test subject
    var selIndex = this.selectedIndex;

    d3.json("./samples.json").then(function(d) {
        var data = d;
        console.log(d);
    
        console.log(`Selected test subject: ${testSubject}`);
        
        // clear & repopulate demographic info
        d3.select("#sample-metadata").selectAll("tr")
        .remove() // clears previous test subject metadata
        .data(Object.entries(data.metadata[selIndex]))
        .enter()
        .append("tr")
        .html(function ([k,v]) {
            return `<td><strong><font size="1">${k}: </strong></font></td> 
            <td><font size="1">${v}</font></td>`});

        var values = data.samples[selIndex].sample_values;
        var ids = data.samples[selIndex].otu_ids;
        var labels = data.samples[selIndex].otu_labels;
        var scrubs = data.metadata[selIndex].wfreq;

        // slice & reverse values & ids
        var valueSort = values.slice(0,10).reverse();
        var idSort = ids.slice(0,10).reverse();
        var labelSort = labels.slice(0,10).reverse();
        var chartLabels = idSort.map(l => "OTU " + l);

        Plotly.restyle("bar", "x", [valueSort]);
        Plotly.restyle("bar", "y", [chartLabels]);
        Plotly.restyle("bar", "text", [labelSort]);

        Plotly.restyle("bubble", "x", [ids]);
        Plotly.restyle("bubble", "y", [values]);
        Plotly.restyle("bubble", "text", [labels]);

        Plotly.restyle("gauge", "value", [scrubs]);
    });
};

init();


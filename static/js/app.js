// Create a horizontal bar chart using sample_values, otu_ids, otu_labels
// access data from sample.json
function getSample(id) {
d3.json("samples.json").then((Data) => {
    // console.log(incomingData);

    var samplesData = Data.samples;
    // console.log(samplesData);

    // Filter for specified id
    var sampleResult = samplesData.filter(row => row.id.toString() === id)[0];

    // For each individual, sort Sample Values in descending order
    var otuID = sampleResult.otu_ids;
    // console.log(otuID);
    var top10Samples = sampleResult.sample_values.slice(0,10).reverse();
    // console.log(top10Samples);
    var top10labels = sampleResult.otu_labels.slice(0,10).reverse();
    // console.log(top10labels);
    var top10ID = otuID.slice(0,10).reverse();
    // console.log(top10ID);
    var OTU_id = top10ID.map(d => "OTU " + d);
        // console.log(`OTU IDS: ${OTU_id}`)

    // Create plot
    var trace1 = {
        x: top10Samples,
        y: OTU_id,
        text: top10labels,
        type:"bar",
        orientation: "h",
        marker:{
            color: sampleResult.otu_ids
        }
    };
    // Create data variable
    var data = [trace1];

    // create layout
    var layout = {
        title: "<b>Top 10 OTU</b>",
        height: 500,
        width: 500,
        }

     // Create the bar plot
     Plotly.newPlot("bar", data, layout);

    // Create a bubble chart 
    var trace2 = {
        x: sampleResult.otu_ids,
        y: sampleResult.sample_values,
        mode: 'markers',
        marker: {
        size: sampleResult.sample_values,
        color: sampleResult.otu_ids
        },
        text: sampleResult.otu_labels,
    };
    
    var data2 = [trace2];
    
    var layout2 = {
        title: '<b>OTU represented in a bubble chart</b>',
        showlegend: false,
        height: 600,
        width: 1100,
     };
    
    Plotly.newPlot("bubble", data2, layout2);
    });

  }

// Create function to gather metadata for each individual
function indivInfo(id) {
    d3.json("samples.json").then((incomingData) => {
        var metadata = incomingData.metadata;
        // console.log(metadata);

        // Filter for specified id
        var result = metadata.filter(row => row.id.toString() === id)[0];

        // Display to demographic info panel
        var demoInfo = d3.select("#sample-metadata");
        
        // Clear demographic info panel before new info is updated
        demoInfo.html("");

        // Map demographic info to id
        Object.entries(result).forEach((key) => {   
            demoInfo.append("body").text(key[0] + ": " + key[1] + "\n");    
        });
    });
}

// Adapt gauge chart to plot weekly washing frequency of individual
function gaugeInfo(id) {
    d3.json("samples.json").then((incomingData) => {
        // console.log(incomingData);
    
        var metadata = incomingData.metadata;
        // console.log(metadata);
    
        // Filter for specified id
        var metaResult = metadata.filter(row => row.id.toString() === id)[0];
    
        // Identify frequency of washing
        var wfreqData = metaResult.wfreq;

        // Modify gauge to account for values ranging from 0 to 9
        var data = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: wfreqData,
              title: { text: "<b>Belly Button Washing Frequency</b> <br> Washing(s) per Week </br>", font: { size: 16 } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
                bgcolor: "white",
                bar: { color: "#008080" },
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], text: "0-1", textinfo: 'text', textposition: 'inside', color: "#FFFFE0"},
                  { range: [1, 2], text: "1-2", color: "#FFFACD" },
                  { range: [2, 3], text: "2-3", color: "#FAFAD2" },
                  { range: [3, 4], text: "3-4", color: "#FFEFD5" },
                  { range: [4, 5], text: "4-5", color: "#FFE4B5" },
                  { range: [5, 6], text: "5-6", color: "#FFDAB9" },
                  { range: [6, 7], text: "6-7", color: "#EEE8AA" },
                  { range: [7, 8], text: "7-8", color: "#F0E68C" },
                  { range: [8, 9], text: "8-9", color: "#BDB76B" },
                ],
              }
            }
          ];
          
          var layout = {
            width: 350,
            height: 300,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            font: { color: "black", family: "Arial" },
            annotation: [{
              text: "Washes per Week",
                font: {
                size: 10,
                color: 'black'},
              }],
          };
          
        // Create plot
          Plotly.newPlot('gauge', data, layout);
        });
}

// Create function for default data
function init() {

    // Link to drop down menu
    var dropDownMenu = d3.select("#selDataset");
    // read the data 
    d3.json("samples.json").then((data)=> {
        // console.log(data)

        // Populate ID data into drop down menu
        data.names.forEach(function(name) {
            dropDownMenu.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        var id = d3.select("#selDataset").node().value;
        console.log(id);
      
        // Build the plot with the new stock
        getSample(id);
        indivInfo(id);
        gaugeInfo(id);
    });
}

// Create change event trigger
function optionChanged(id) {
    getSample(id);
    indivInfo(id);
    gaugeInfo(id);
}

init();
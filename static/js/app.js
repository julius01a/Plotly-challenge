// Create a horizontal bar chart using sample_values, otu_ids, otu_labels
// Read in data from sample.json
function getData(id) {
d3.json("samples.json").then((incomingData) => {
    // console.log(incomingData);

    var samplesData = incomingData.samples;
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

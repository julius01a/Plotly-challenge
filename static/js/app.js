// Create a horizontal bar chart using sample_values, otu_ids, otu_labels
// access data from sample.json
function getSample(id) {
d3.json("samples.json").then((Data) => {
    // console.log(incomingData);

    var samplesData = Data.samples;
    // console.log(samplesData);


    // place filter on id
    var sampleResult = samplesData.filter(row => row.id.toString() === id)[0];

    // rank the result
    var otuID = sampleResult.otu_ids;
   
    // console.log(otuID);
    var topSample = sampleResult.sample_values.slice(0,10).reverse();
   
    // console.log(topSample);
    var topLabels = sampleResult.otu_labels.slice(0,10).reverse();
   
    // console.log(topLabels);
    var topID = otuID.slice(0,10).reverse();
    
    // console.log(topID);
    var OTU_id = topID.map(d => "OTU " + d);
        // console.log(`OTU IDS: ${OTU_id}`)

    // Create plot
    var trace1 = {
        x: topSample,
        y: OTU_id,
        text: topLabels,
        type:"bar",
        orientation: "h",
        marker:{
            color: sampleResult.otu_ids
        }
    };

    // Create data variable
    var traceData = [trace1];

    // create layout
    var layout = {
        title: "<b>Top 10 OTU</b>",
        height: 500,
        width: 500,
        }

     // Create the bar plot
     Plotly.newPlot("bar", traceData, layout);

    // Create the bubble chart 
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
    
   
    var traceData2 = [trace2];
    
    var layout2 = {
        title: '<b>OTU mapped in a bubble chart</b>',
        showlegend: false,
        height: 600,
        width: 1100,
     };
    
    Plotly.newPlot("bubble", traceData2, layout2);
    });

  }


// access metadata for each sample
function indivInfo(id) {
    d3.json("samples.json").then((RawData) => {
        var metadata = RawData.metadata;
        // console.log(metadata);

        // Filter id
        var result = metadata.filter(row => row.id.toString() === id)[0];

        // Display demographic info 
        var demoInfo = d3.select("#sample-metadata");
        
        // Clear demographic info for the new info 
        demoInfo.html("");

        // link demographic info to id
        Object.entries(result).forEach((key) => {   
            demoInfo.append("body").text(key[0] + ": " + key[1] + "\n");    
        
          });
    
      });

}




// Create function for default display
function init() {

    // drop down menu
    var dropDownMenu = d3.select("#selDataset");
    // access raw data from json
    d3.json("samples.json").then((rawData)=> {
        // console.log(rawData)

        // Populate ID data into drop down menu
        rawData.names.forEach(function(name) {
            dropDownMenu.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        var id = d3.select("#selDataset").node().value;
        console.log(id);
      
        // Build the plot with the new stock
        getSample(id);
        indivInfo(id);
        
    });
}

// Create change event trigger
function optionChanged(id) {
    getSample(id);
    indivInfo(id);
    
}

init();
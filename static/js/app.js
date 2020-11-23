// dropdown menu function to print new graph 
d3.selectAll("#selDataset").on("change", selection)

// create dropdown value
d3.json("samples.json").then(function(dataOtu){
    console.log(dataOtu)
    // get names list from data and print in dropdown menu first list option
    var names_list = dataOtu.names;
    
    buildPlot(names_list[0]);
    
    var dropDownMenu = d3.select("#selDataset");
    dropDownMenu.selectAll("option").data(names_list).enter().append("option").text(function(d) {
          return d;
         })
        .attr("value", function(d){
          return d;
        });
});

// running buildplot function with the value of the dropdown menu
function selection(){
      var dropDownMenu = d3.select("#selDataset") 
      var input = dropDownMenu.node().value;
     buildPlot(input)
};

function buildPlot(input) {
    d3.json("samples.json").then(function(dataOtu){
       var names_list = dataOtu.names;
       var sample_id = names_list.findIndex(i => i == input);
    // Adding data 
       var otu_IDs = dataOtu.samples[sample_id].otu_ids; 
       var samp_Values = dataOtu.samples[sample_id].sample_values;
       var otu_Labels = dataOtu.samples[sample_id].otu_labels; 
    // get top values from data and reverse
        otuIDs = otu_IDs.slice(0,10);
        otuIDs = otuIDs.map(s => `OTU ${s}`).reverse();
        sampValues = samp_Values.slice(0,10).reverse();
        otuLabels = otu_Labels.slice(0,10).reverse();

    // set the Bar Chart
        var trace = {
            x: sampValues,
            y: otuIDs,
            text: otuLabels,
            type: "bar",
            orientation: "h"
            };
        var layout = {
            };
        var data = [trace];
        Plotly.newPlot("bar", data, layout);

        // set the Bubble Chart
        var trace1 = {
            x: otu_IDs,
            y: samp_Values,
            text: otu_Labels,
            mode: 'markers',
            marker: {
              size: samp_Values,
              color: otu_IDs,
              colorscale: [[0, '#4b4ba9'], [.2, '#54d2b0'],[.2, '#7fe36b'],[.5, '#c0ea6e'],[.5, '#99752b'],[1, '#d7c7b9']]
              }
            };
        var data = [trace1];  
        var layout = {
            xaxis: {title: 'OTU ID'},
            showlegend: false,
            };
        Plotly.newPlot('bubble', data, layout);

        d3.select("#sample-metadata").selectAll("p").remove();
        var meta_text = dataOtu.metadata[sample_id];
        var m_keys = Object.entries(meta_text);
        var meta_data = d3.select("#sample-metadata");

        // input data in demographic 
        m_keys.forEach(function(m_data){
        meta_data.append("p").text(`${m_data[0]}: ${m_data[1]}`)
        });

        //  wash variable for guage
        var wash_freq = meta_text.wfreq
        guage(wash_freq)
    }); 
};
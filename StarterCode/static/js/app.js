// Pulling and processing samples.json for chart data
d3.json("/static/data/samples.json").then((data) => {
    // retrieving datasets
    var metadata = data.metadata;
    var subjectNames = data.names;
    var samples = data.samples;
  
    // console.log(metadata);
  
    // adding test subjects to select
    var testSubject = d3.select("#selDataset");
    subjectNames.forEach((subject) => {
      var newSubject = testSubject.append("option");
      newSubject.text(subject);
    });
  
    // defining elements
    var sampleMetadata = d3.select("#sample-metadata");
    var barPlot = d3.select("#bar");
    var gaugePlot = d3.select("#gauge");
    var bubblePlot = d3.select("#bubble");
  
    // creating change event for select
    testSubject.on("change", updateCharts);
  
    // event functions
    function updateCharts() {
      // Preventing refresh
      d3.event.preventDefault();
  
      // clearing console
      console.clear();
  
      // getting selectedSubject
      var selectedSubject = testSubject.property("value");
  
      // filtering metadata for panel body
      filteredMetadata = metadata.filter(function (meta) {
        return meta.id == selectedSubject;
      });
  
      // filtering samples by selectedSubject
      var filteredSamples = samples.filter(function (sample) {
        return sample.id == selectedSubject;
      });
  
      // removing all paragraph elements first
      sampleMetadata.html("");
      // adding paragraph tags in panel body
      filteredMetadata.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          // console.log(`${key}: ${value}`);
          var newParagraph = sampleMetadata.append("p");
          newParagraph.text(`${key}: ${value}`);
        });
      });
  
      // slicing first 10 item samples for barPlot
      var sampleValues = filteredSamples[0].sample_values.slice(0, 10);
      var otuLabels = filteredSamples[0].otu_labels.slice(0, 10);
      var otuIDs = filteredSamples[0].otu_ids.slice(0, 10);
      // prefix otuIDs with "OTU"
      var otuIDsP = [];
      otuIDs.forEach(function (otu) {
        otuIDsP.push(`OTU ${otu}`);
      });
  
      // creating trace for bar chart
      var traceBar = {
        type: "bar",
        x: sampleValues.reverse(),
        y: otuIDsP.reverse(),
        text: otuLabels.reverse(),
        orientation: "h",
      };
  
      var dataBar = [traceBar];
  
      Plotly.newPlot("bar", dataBar);
  
      // creating trace for bubble plot
      var traceBubble = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIDs,
        },
      };
  
      var layBubble = {
        xaxis: {
          title: {
            text: "OTU ID",
          },
        },
      };
  
      var dataBubble = [traceBubble];
  
      Plotly.newPlot("bubble", dataBubble, layBubble);
  
      // console.log
      console.log(`Selected Sample: ${selectedSubject}`);
      console.log(`Sample Metadata: ${JSON.stringify(filteredMetadata)}`);
      console.log(`Filtered Sample: ${JSON.stringify(filteredSamples)}`);
      console.log(`Sample Values: ${JSON.stringify(sampleValues)}`);
      console.log(`OTU IDs: ${JSON.stringify(otuIDs)}`);
      console.log(`OTU IDs Prefixed: ${otuIDsP}`);
      console.log(`OTU Labels: ${JSON.stringify(otuLabels)}`);
    }
  });


function barchart(targetDOMelement) {



	//Delare the main object that will be returned to caller
	var scatterObject = {};


	//=================== PUBLIC FUNCTIONS =========================
	//legend code but for a scatterplot, its a pulbic function as only want it called once on First
	//declaration.
	scatterObject.createLegend= function (){
		var colours = {
			Panel:"#FFFFFF",
		    A: "#42d4f4",
		    B: "#aaffc3",
		    C: "#f58231",
		    D: "#808000"

		  };
			var borders ={
				w: 75,
				h:30,
				s:3,
				r:3
			};

			var legend= d3
			.select("#legendPlot")
			.append("svg:svg")
			.attr("width",borders.w)
			.attr("height",d3.keys(colours).length*(borders.h +borders.s));

			var g = legend
						.selectAll("g")
						.data(d3.entries(colours))
						.enter()
						.append("svg:g")
						.attr("transform", function(d, i) {
							return "translate(0," + i * (borders.h + borders.s) + ")";
						});

					g.append("svg:rect")
						.attr("rx", borders.r)
						.attr("ry", borders.r)
						.attr("width", borders.w)
						.attr("height", borders.h)
						.style("fill", function(d) {
							return d.value;
						});

					g.append("svg:text")
						.attr("x", borders.w / 2)
						.attr("y", borders.h / 2)
						.attr("dy", "0.35em")
						.attr("text-anchor", "middle")
						.text(function(d) {
							return d.key;
						});
		}

	scatterObject.appendedMouseOverFunction = function (callbackFunction) {
		console.log("appendedMouseOverFunction called", callbackFunction)
		appendedMouseOverFunction = callbackFunction;
		render();
		return scatterObject;
	}

	scatterObject.appendedMouseOutFunction = function (callbackFunction) {
		appendedMouseOutFunction = callbackFunction;
		render();
		return scatterObject;
	}

	scatterObject.loadAndRenderDataset = function (data) {
		dataset=data.map(d=>d); //create local copy of references so that we can sort etc.
		console.log(dataset);
		render();
		return scatterObject;
	}

	scatterObject.overrideDataFieldFunction = function (dataFieldFunction) {
		dataField = dataFieldFunction;
		return scatterObject;
	}


		//an override used to set the class of each circle to the panel
	scatterObject.overrideColorFunction = function (theColor) {

		personalColor = theColor;

		return scatterObject;
	}

//used to override the key function
	scatterObject.overrideKeyFunction = function (keyFunction) {
	 yAxisCategoryFunction = keyFunction;
		return scatterObject;
	}

	scatterObject.ovverridegupkeyfield = function (keyfield) {
	 gupKeyField = keyfield;
		return scatterObject;
	}

	scatterObject.overrideyaxislabel = function (label) {
	 Yaxislabel = label;
		return scatterObject;
	}

	scatterObject.overridexaxislabel = function (label) {
	 Xaxislabel = label;
		return scatterObject;
	}

	scatterObject.overrideuni = function (university) {
	 uni = university;
		return scatterObject;
	}


	scatterObject.overrideTooltipFunction = function (toolTipFunction) {

		tooltip = toolTipFunction;
		return scatterObject;
	}


	scatterObject.appendClickFunction = function (d) {

		plotClickFunction(d)
		return scatterObject;
	}

	scatterObject.overrideMouseClickFunction = function (fn) {
		mouseClick2Function = fn;
		render(); //Needed to update DOM if they exist
		return scatterObject;
	}

	scatterObject.maxValueOfDataField = function (max) {
		maxValueOfDataset = max;
		maxValueOfDataField=function(){return maxValueOfDataset};
		return scatterObject;
	}

//new for the Y values
	scatterObject.maxValueOfWordCount = function (max) {
		maxValueOfWordCount = max;
		maxValueOfWordCount =function(){return maxValueOfWordCount};
		return scatterObject;
	}

	scatterObject.render = function (callbackFunction) {
		render(); //Needed to update DOM
		return scatterObject;
	}



	//=================== PRIVATE VARIABLES ====================================

	var focusOn;//used for displaying the text
	var svgWidth = 500;
	var svgHeight = 500;
	var dataset = [];
	var xScale = d3.scaleLinear();
	var yScale = d3.scaleLinear();
	var yAxisIndent = 200; //Space for labels
	var maxValueOfDataset; //For manual setting of bar length scaling (only used if .maxValueOfDataset() public method called)

	//=================== INITIALISATION CODE ====================================

	//Declare and append SVG element
	var svg = d3
		.select(targetDOMelement)
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight)
		.classed("barchart",true);


	//Declare and add group for y axis
	var yAxis = svg
		.append("g")
		.classed("yAxis", true);


	//Declare and add group for x axis
	var xAxis = svg
		.append("g")
		.classed("xAxis", true);

		var Uni = svg
			.append("g")
			.classed("Uni", true);

var focusOnFunction;
var x = 320;
var y = 380	;

	//===================== ACCESSOR FUNCTIONS =========================================

	var dataField = function(d){return d.datafield} //The length of the bars
	var tooltip = function(d){return  d.datafield} //tooltip text for plot
	var university = function(d){return  d}
	var clickFunction = function (d,i){return scatterObject.appendClickFunction(d)}
	var yAxisCategoryFunction = function(d){return d.key} //Categories for y-axis
	var gupKey = d => "key--"+d.UoAString.replace(/[\W]+/g, "_").toLowerCase(); //used to set the gup key to a unique identifier
	var gupKeyField =function(d){return  d.datafield};
	var Yaxislabel = function(d){return  d.datafield};
	var Xaxislabel = function(d){return  d.datafield};


	//=================== OTHER PRIVATE FUNCTIONS ====================================
	var maxValueOfDataField = function(){
		//Find the maximum value of the data field for the x scaling function using a handy d3 max() method
		//This will be used to set (normally used )
		return d3.max(dataset, dataField)
	};
	var maxValueOfWordCount = function(){
		//Find the maximum value of the data field for the x scaling function using a handy d3 max() method
		//This will be used to set (normally used )
		return d3.max(dataset, yAxisCategoryFunction)
	};

//mouse over function used for labeling at the bottom of the svg
	var mouseOverFunction = function (d,i){

        d3.select(this).classed("highlight", true).attr("r", 6);
				focusOnFunction.style("display",null)
				.style("font"," 12px");

					focusOnFunction.attr("transform", "translate(" + x + "," + y + ")");
				focusOnFunction.select("text").text(d.UoAString);
				highlightsubjectPlottrue(d.UoAString);

	}

	var mouseOutFunction = function (d,i){
        d3.select(this).classed("highlight", false).attr("r", 3.5);

			focusOnFunction.style("display","none");
			highlightsubjectPlotfalse(d.UoAString);
	}

	var mouseClick2Function = function (d,i){
        console.log("barchart click function = nothing at the moment, d=",d)
	};


//this is used to display the data that I have added to show the university clicked
//and the ranking of said university.
function returnUni(data){
if(data[0]["Institution name"] !="undefined"){
	var end;
	if(data[0].Ranking == 1){
		end ="st";
	}else if(data[0].Ranking == 2){
		end= "nd"
	}else if(data[0].Ranking == 3){
		end ="rd"
	}
	else if(data[0].Ranking > 3){
		end ="th"
	}
	return data[0]["Institution name"] +": Ranked "+ data[0].Ranking+end+" in the UK";
}else{
	return 0;
}
}

	function render () {
		updateScalesAndRenderAxes();
		GUP_bars();
	}

	function updateScalesAndRenderAxes(){
		//Set scales to reflect any change in svgWidth, svgHeight or the dataset size or max value
	//createLegend();
svg.select(".Uni").text(university);

		xScale
			.domain([0, maxValueOfDataField()])
			.range([0, svgWidth-(yAxisIndent+30)]);
		yScale
		  .domain([0, maxValueOfWordCount()])
	  	.range([0, svgWidth-(yAxisIndent)]);


		//Now render the y-axis using the new yScale
		var yAxisGenerator = d3.axisLeft(yScale);
		svg.select(".yAxis")
			.transition().duration(800)
			.attr("transform", "translate(" + yAxisIndent + ",55)")
			.call(yAxisGenerator);
			svg.append("text")
					 .attr("transform", function(d) {return "translate( 150, 270) rotate(270)"; })
					 .text(Yaxislabel);


		//Now render the x-axis using the new xScale
		var xAxisGenerator = d3.axisTop(xScale);
		svg.select(".xAxis")
			.transition().duration(800)
			.attr("transform", "translate(" + yAxisIndent + ",50)")
			.call(xAxisGenerator);
			svg.append("text")
					 .attr("transform", function(d) {return "translate( 260	, 25) "; })
					 .text(Xaxislabel);

	};



	function GUP_bars(){

//selects all circles and attaches unique gupkey identifier
selection = svg
	.selectAll("circle")
	.data(dataset, gupKeyField)

//gets data for label, if doesnt exist returns 0
 label =returnUni(dataset);

//svg created for the label and positioned in the correct location
	svg.select(".Uni")
	.append("text")
	.attr("transform", function(d) {return "translate( 150, 500)"; })
	.text(label)
	.transition().duration(800)
	.attr("transform", function(d) {return "translate( 250, 350)"; });
//GUP: ENTER SELECTION

//enter selection to add the circles and set the radius
	var enterSelection = selection
	.enter()
	.append("circle")
	.attr("r", 3.5)

//used for text ofeach subject on mouseover
var focusOn=svg.append("g").attr("class","focusOn");
//focus on is given a class
var focusOn=svg
.append("g")
.attr("class","focusOn");

focusOn
.append("text");

focusOnFunction =focusOn;
//appends tooltips in each circle
enterSelection
.append("title")
.text(tooltip);

//used to label the classes so I know what color each circle will be
//also used to append the click function and mouseoverfunction
enterSelection
.attr("class",gupKey)
.classed("A", function(d) { return d["Main panel"]==="A";})
.classed("B", function(d) { return d["Main panel"]==="B";})
.classed("C", function(d) { return d["Main panel"]==="C";})
.classed("D", function(d) { return d["Main panel"]==="D";})
.on("mouseover",mouseOverFunction)
.on("mouseout",mouseOutFunction)
.on("click",clickFunction);


//this sets the points from which each circle will be entered
	enterSelection
	.attr("cx", 203)
	.attr("cy", 43)




	//GUP UPDATE (anything that is already on the page)
		var updateSel = enterSelection //update CSS classe
			.classed(" enterSelection ", false)
			.classed("updateSelection", true)


//moves to the location of the dots
		updateSel
			.transition()
			.duration(1000)
			.delay(0)
			.attr("cx", function(d) {return xScale(dataField(d))+yAxisIndent;})
			.attr("cy",  function(d) {return yScale(yAxisCategoryFunction(d));});



		//GUP EXIT selection removes dots
		var exitSel = selection.exit()
			.classed("highlight updateSelection enterSelection no", false)
			.classed("exitSelection ", true)
			.transition()
			.duration(750)
			.attr("cx", 500)
			.attr("cy", 400)
			.remove()


	};


	//================== IMPORTANT do not delete ==================================
	return scatterObject; // return the main object to the caller to create an instance of the 'class'

}

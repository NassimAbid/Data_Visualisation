/*--------------------------------------------------------------------

   Module: piechart class implemented in Bostock's functional style
   Author: Mike Chantler

   What it does:
  	Renders a pie chart using the GUP

   Dependencies
  	D3.js v4

   Version history
  	v001	17/09/2017	mjc	Created.

---------------------------------------------------------------------- */

function piechart(targetDOMelement) {

	var piechartObject = {};

	//=================== PUBLIC FUNCTIONS =========================
	//
	piechartObject.overrideDataFieldFunction = function (dataFieldFunction) {
		dataField = dataFieldFunction;
		layoutAndRender();
		return piechartObject;
	}

	piechartObject.overridelabel = function (uni) {
		label = uni;
		layoutAndRender();
		return piechartObject;
	}


		piechartObject.overridesubject = function (sub) {
			subject = sub;
			layoutAndRender();
			return piechartObject;
		}

//create legend for the pie this time
	piechartObject.createLegend= function (){
		var colours = {
			Ranking:"#FFFFFF",
			First: "#D40E22",
			Second: "#7FDBFF",
			Third: "#3D9970",
			Fourth: "#FFDC00"

			};
			var borders ={
				w: 75,
				h:30,
				s:3,
				r:3
			};

			var legend= d3
			.select("#legendpie")
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
						}).style("opacity","0.7");

					g.append("svg:text")
						.attr("x", borders.w / 2)
						.attr("y", borders.h / 2)
						.attr("dy", "0.35em")
						.attr("text-anchor", "middle")
						.text(function(d) {
							return d.key;
						});
		}

	piechartObject.render = function (callbackFunction) {
		layoutAndRender();
		return piechartObject;
	}

//Maybe the best function i have created
	piechartObject.loadAndRenderDataset = function (data) {
		console.log(data);
		var Keyvalue = Object.keys(data).map(function(key) {
  	return { key: this[key].topicAs3words , value: this[key].weight };
		}, data);

		Keyvalue.sort(function(p1, p2) { return p2.value - p1.value; });

		var top4 = Keyvalue.slice(0, 4);
		dataset=top4;
		layoutAndRender();
		return piechartObject;
	}

	piechartObject.sort = function () {
		dataset.sort(function (a,b){
			return dataField(a) - dataField(b)
		})
		layoutAndRender();
		return piechartObject;
	}

	piechartObject.sortR = function () {
		dataset.sort(function (a,b){return dataField(b) - dataField(a)})
		layoutAndRender();
		return piechartObject;
	}

	piechartObject.sortKey = function () {
		dataset.sort(function (a,b){
			if (a.topicAs3words < b.topicAs3words) return -1;
			if (a.topicAs3words > b.topicAs3words) return  1;
			return 0;
		});
		layoutAndRender();
		return piechartObject;
	}


	//=================== PRIVATE VARIABLES ====================================
	//Width and height of svg canvas
	var focusOn;
	var svgWidth = 320;
	var svgHeight = 320;
	var dataset = [];
	var colors = ["#D40E22","#7FDBFF", "#3D9970","#FFDC00"]



	//=================== INITIALISATION CODE ====================================

	//Declare and append SVG element
	var svg = d3.select(targetDOMelement)
				.append("svg")
				.attr("width", svgWidth)
				.attr("height", svgHeight)
				.classed ("piechart",true);


	//Declare and append group that we will use tp center the piechart within the svg
	var grp = svg.append("g");
	var subjects = svg
		.append("g")
		.classed("subjects", true);


		var name = svg
			.append("g")
			.classed("name", true);

	//=================== PRIVATE FUNCTIONS ====================================

	var dataField = function(d){return d.value}
	var PieKey= function (d){return d.data.key}
	var label ="Place Holder";
	var subject= "placeholder";

//mouseover function used for highlighting for both plot and pack and adding text
	var mouseOverFunction = function (d,i){
		d3.select(this).classed("piehighlight",true);

		focusOnFunction.style("display",null)
		.style("font"," 10px")
		var x =50;
		var y =150;
		focusOnFunction.attr("transform", "translate(" + x + "," + y + ")");
		focusOnFunction.select("text").text(d.data.key);

		highlightsubjectpietopacktrue(d.data, subject);

		highlightsubjectpietoplottrue(d.data, label);

	}
	//set for removing the highlight
	var mouseOutFunction = function (d,i){
			d3.select(this).classed("piehighlight",false);
	focusOnFunction.style("display","none");
		highlightsubjectpietopackfalse(d.data, subject);
		highlightsubjectpietoplotfalse(d.data,label)
	}

	//Set up shape generator
	var arcShapeGenerator = d3.arc()
		.outerRadius(svgHeight/2 - 30)
		.innerRadius(svgHeight/4- 30)
		.padAngle(0.03)
		.cornerRadius(8);

	function layoutAndRender(){

svg.select(".subjects").text(subject);

svg.select(".name").text(label);

//svg for the subject text
svg.select(".subjects")
.append("text")
.attr("transform", function(d) {return "translate( 50, 25)"; })
.text(subject)
.style("font" ,"11px sans-serif");

//svg for the uni text
svg.select(".name")
.append("text")
.text(label)
.attr("transform", function(d) {return "translate( 110, 500)"; })
.style("font" ,"11px sans-serif")
.transition().duration(800)
.attr("transform", function(d) {return "translate( 110, 310)"; });

//fills the pie with values
		var arcsLayout = d3.pie()
			.value(dataField)
			.sort(null)
			(dataset);

		grp.attr("transform", "translate("+[svgWidth/2, svgHeight/2]+")")

		GUP_pies(arcsLayout, arcShapeGenerator);
	}

	function GUP_pies(arcsLayout, arcShapeGenerator){

		var selection = grp.selectAll("path")
			.data(arcsLayout, function (d){return console.log(d.data.key)})


		//GUP: ENTER SELECTION
		var enterSel = selection
			.enter()
			.append("path")
			.each(function(d) { this.dPrevious = d; });// store d for use in tweening

			enterSel
			.transition()
			.duration(750)
			.attrTween("d", arcTween);

			var focusOn=svg
			.append("g")
			.attr("class","focusOn");

			focusOn
			.append("text");

			focusOnFunction =focusOn;

		//GUP ENTER AND UPDATE selection
		var mergedSel = enterSel.merge(selection)

		mergedSel
			.attr("fill", function(d, i) { return colors[i]})
			.on("mouseover",mouseOverFunction)
			.on("mouseout", mouseOutFunction)
			.attr("class",d=>"key--"+label.replace(/[\W]+/g, "_").toLowerCase())
			.append("title").text(function(d) { return d.data.key});

		mergedSel
			.transition()
			.duration(750)
			.attrTween("d", arcTween); //Use custom tween to draw arcs

		//GUP EXIT selection
		selection.exit()
			.remove()
	};


	function arcTween(dNew) {
		var interpolateAngles = d3.interpolate(this.dPrevious, dNew);
		this.dPrevious = dNew;
		return function(t) {return arcShapeGenerator(interpolateAngles(t)) };
	}


	//================== IMPORTANT do not delete ==================================
	return piechartObject; // return the main object to the caller to create an instance of the 'class'

} //End of piechart() declaration

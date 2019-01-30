/* pack function for the project, Highlight features are the legend created and
zoomable function

---------------------------------------------------------------------- */
var hierarchyGraph; //The graph of objects used to represent the hierarchy

function packs(targetDOMelement) {
	//Delare the main object that will be returned to caller
	var packObject = {};

//different colours for the legend
	var colours = {
			Region: "#FFFFFF",
	    EMID: "#27AE60",
			SWES: "#17A589",
			WMID: "#bfef45",
	    SEAS: "#E67E22",
			LOND: "#D40E22",
			EAST: "#E74C3C",
		  NEAS: "#CD6155",
			YORH: "#F4D03F",
			 NWES: "#F5B041",
	    WALE: "#9B59B6",
	    SCOT: "#3498DB",
		 NIRE: "#2980B9"
	  };

//function to create the legend, this code is repeated for the other layouts
		function createLegend(){

			var borders ={
				w: 75,
				h:30,
				s:3,
				r:3
			};

//creates and appends another SVG
			var legend= d3
			.select("#legend")
			.append("svg:svg")
			.attr("width",borders.w)
			.attr("height",d3.keys(colours).length*(borders.h +borders.s));

	//this variable appends to a group where it tranforms the location
			var g = legend
						.selectAll("g")
						.data(d3.entries(colours))
						.enter()
						.append("svg:g")
						.attr("transform", function(d, i) {
							return "translate(0," + i * (borders.h + borders.s) + ")";
						});
//it appends the coloured rectangles for the legend
					g.append("svg:rect")
						.attr("rx", borders.r)
						.attr("ry", borders.r)
						.attr("width", borders.w)
						.attr("height", borders.h)
						.style("fill", function(d) {
							return d.value;
						});

//the text associated is then appended
					g.append("svg:text")
						.attr("x", borders.w / 2)
						.attr("y", borders.h / 2)
						.attr("dy", "0.35em")
						.attr("text-anchor", "middle")
						.text(function(d) {
							return d.key;
						});
		}

	//=================== PUBLIC FUNCTIONS =========================//


	packObject.loadAndRenderNestDataset = function (nestFormatHierarchy, rootName) {
		//Loads and renders (format 2) hierarchy in "nest" or "key-values" format.
		layoutAndRenderHierarchyInNestFormat(nestFormatHierarchy, rootName)
		return packObject; //for method chaining
	}


	packObject.nodeLabelIfNoKey = function (fn) {

		nodeLabelIfNoKey = fn;
		return packObject; //for method chaining
	}


	packObject.appendClickFunction = function (d) {
		// calls pack click function to pass the data to the bar chart
		packClickFunction(d)
		return packObject; //for method chaining
	}

	//=================== PRIVATE VARIABLES ====================================

	//Declare and append SVG element
	var height = 600,
			width =600;

	//Set up SVG and append group to act as container for tree graph

	var grp = d3.select(targetDOMelement).append("svg")
		.attr("width", width )
		.attr("height", height );

  var Diameter = +grp.attr("width"),
	margin = 20;

	var MyPack = d3.pack().size([Diameter -margin, Diameter- margin])
	.padding(2);

	//Add group for the nodes, just for clarity when 'inspecting' the html & svg
	var nodesGroup = grp
		.append("g")
		.classed("nodesGroup", true)
		.attr("transform", function(d) {
			return "translate(" + Diameter/2 + "," + Diameter/2 + ")";
		});


	//=================== PRIVATE FUNCTIONS ====================================
	var nodeLabelIfNoKey = function(){return "No name set"};
	var appendClickFunction = function(){console.log ("No click fn appended")};
	var clickFunction = function (d,i){return packObject.appendClickFunction(d)}
	var nodeLabel = function(d) {return d.data.name  ;}
	var gupKey = d => "key--"+(d.data.key).replace(/[\W]+/g, "_").toLowerCase();

//mouse over function used in highlighting the single layout and the pie
	var mouseOverFunction = function (d,i){
				var check = d.height;
				d3.select(this).classed("hovercolor",true);
				d3.select(this.parentNode).classed("bigtext",true);
				if(check==0){
		highlightpacktopietrue(d);
			}
	}
//mouse over function used in dehighlighting
	var mouseOutFunction = function (d,i){
				d3.select(this).classed("hovercolor", false);
					d3.select(this.parentNode).classed("bigtext",false);
							highlightpacktopiefalse(d);
	}

	function layoutAndRenderHierarchyInNestFormat (nestFormatHierarchy, rootName){
		//create legend is called
		createLegend();
		//Move the 'nest' array into a root node:
		var datasetAsJsonD3Hierarchy = {"key":rootName, "values": nestFormatHierarchy}

//contains all nodes, sums and sorts the values
		hierarchyGraph = d3
			.hierarchy(datasetAsJsonD3Hierarchy, d=>d.values)
			.sum(function(d){return d.value} )
				.sort(function(a, b) { return b.value - a.value; });

		//variable used when zooming
				var focus = hierarchyGraph,
				 nodes = MyPack(hierarchyGraph).descendants(),
				 view;

	 //used to correctly label each node
		nodeLabel = function(d) {
			if (d.data.key) return d.data.key ;
			else return nodeLabelIfNoKey(d);
		}

		//Can now calculate XY data and render
		calculateXYpositionsAndRender(hierarchyGraph);
	}

	function calculateXYpositionsAndRender(hierarchyGraph){
		//Add x and y properties to each node in the hierarchy graph.
		var hierarchyGraphWithPositions = MyPack(hierarchyGraph);
		//Get lists of nodes
		var listOfNodes = hierarchyGraphWithPositions.descendants();

		//Render links and nodes
		GUPrenderNodes(listOfNodes);
	}

	function GUPrenderNodes(listOfNodes){

		//DATA BIND
		var selectionGroup = nodesGroup
			.selectAll("g.cssClassNode") //select groups with class = "cssClassNode"
			.data(listOfNodes);

		//ENTER  SELECTION PROCESSING
		//Create groups
		var enterSelectionGroup = selectionGroup
			.enter()
			.append("g")
			.classed("cssClassNode enterSelection", true)


		//Append nodes to group
		enterSelectionGroup
			.append("circle")
			.attr("class",gupKey)
			.classed("highlight",false)
			.attr("r",function(d){return d.r} )
			.append("title")
			.text(nodeLabel);


		//Append text to group
		enterSelectionGroup
		.append("g")
		.attr("class","text")
			.append("text")


		//Merged ENTER + UPDATE group selections
		enterUpdateSelectionGroup = enterSelectionGroup
			.merge(selectionGroup)

		enterUpdateSelectionGroup
			//translate the group into the correct position
			.attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			})




// select all circles and add functions to them which include the click, dblclick for intermediate nodes only(zoom)
//circle is also used later on.
		var circle = grp.selectAll("circle")
			.on("click",clickFunction)
			.on("mouseover",mouseOverFunction)
			.on("mouseout",mouseOutFunction)
			.on("dblclick", function(d) { if (d.height != 0 && d.depth != 0 )
				 zoom(d),
				  d3.event.stopPropagation(); });


// onclick the svg will zoom
		grp.on("click", function() { zoom(hierarchyGraph); });


		var node = enterUpdateSelectionGroup;

//initialise the starting locations for the zoom
		zoomTo([hierarchyGraph.x, hierarchyGraph.y, hierarchyGraph.r * 2+ margin]);


		enterUpdateSelectionGroup
		//change to visually repersentation of each region
			//set appropriate classes for the group
			.classed("leafNode", d => d.height == 0)
			.classed("rootNode", d => d.depth == 0)
			.classed("intermediateNodeNEAS", d => (d.height != 0 && d.depth != 0)&&d.data.key=="NEAS")
			.classed("intermediateNodeEAST", d => (d.height != 0 && d.depth != 0)&&d.data.key=="EAST")
			.classed("intermediateNodeWALE", d => (d.height != 0 && d.depth != 0)&&d.data.key=="WALE")
			.classed("intermediateNodeNIRE", d => (d.height != 0 && d.depth != 0)&&d.data.key=="NIRE")
			.classed("intermediateNodeSCOT", d => (d.height != 0 && d.depth != 0)&&d.data.key=="SCOT")
			.classed("intermediateNodeSWES", d => (d.height != 0 && d.depth != 0)&&d.data.key=="SWES")
			.classed("intermediateNodeWMID", d => (d.height != 0 && d.depth != 0)&&d.data.key=="WMID")
			.classed("intermediateNodeEMID", d => (d.height != 0 && d.depth != 0)&&d.data.key=="EMID")
			.classed("intermediateNodeYORH", d => (d.height != 0 && d.depth != 0)&&d.data.key=="YORH")
			.classed("intermediateNodeNWES", d => (d.height != 0 && d.depth != 0)&&d.data.key=="NWES")
			.classed("intermediateNodeSEAS", d => (d.height != 0 && d.depth != 0)&&d.data.key=="SEAS")
			.classed("intermediateNodeLOND", d => (d.height != 0 && d.depth != 0)&&d.data.key=="LOND")

			//left this commented out, this is used for non
		//	.classed("intermediateNode", d => (d.height != 0 && d.depth != 0))

		//Create Merged ENTER + UPDATE selections for the text element in the group
		enterUpdateSelectionText = 	enterUpdateSelectionGroup
			//add text to the text element
			.select("text")
			.text(nodeLabel);

//sets class to update selection
		selectionGroup
			//Set Update classes on group
			.classed("enterSelection", false)
			.classed("updateSelection", true)

		// EXIT(which isnt called in this case)
		selectionGroup
			.exit()
			.classed("enterSelection updateSelection", false)
			.classed("exitSelection", true)
			.remove();

	//function used in zooming
			function zoom(d) {
					var focus0 = focus; focus = d;
					//transitions to the point of zoom and resets the center
					var transition = d3.transition()
							.duration(d3.event.altKey ? 7500 : 750)
							.tween("zoom", function(d) {
								var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
								return function(t) { zoomTo(i(t)); };
							});

				}
// is is recurrisvely called in zoom to change the transolations and radius of all circles/nodes
		function zoomTo(v) {
		 var k = Diameter/ v[2] ; view = v;
 		node.attr("transform", function(d) {return "translate(" + (d.x - v[0]) * k+ "," + (d.y - v[1]) * k + ")"; });
		circle.attr("r", function(d) { return d.r * k; })

		}


	}

	return packObject; // return the main object to the caller to create an instance of the 'class'

} //End of pack() declaration

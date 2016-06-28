// ***************** COPYRIGHT (c) 2013 STEFAN WANER ******************
// *********************** ALL RIGHTS RESERVED ************************




var svgNS = "http://www.w3.org/2000/svg";

var uAg = navigator.userAgent.toLowerCase(), OPJS=false,IEJS=false,SAFJS=false,FFJS=false;
if (uAg.indexOf( "opera" ) != -1 ) OPJS=true;
else if (uAg.indexOf( "msie" ) != -1 ) IEJS=true;
else if (uAg.indexOf( "safari" ) != -1 ) SAFJS=true;
else if (uAg.indexOf( "firefox" ) != -1 ) FFJS=true;


var graphDocNameGiven=false; // if true expects a global called theDocObj;
var graphsOnPage=[]; // will contain the heights and frame IDs  of the graphs
var theActions = new Array();
var epsilonjs = .0000000001; // for manipulating the current canvas
var yLabelsPosn = 0;
var xLabelsPosn = 0;
var numberTesting = 0;
var numTesting2 = 0;
var jsPuttingXLabels = false; // special flag that allows user labels under the graph area.
var jsRefreshingGraph = false; // if true skip setup  stage
var jsXGridAuto = true; // auto gridlines
var jsYGridAuto = true;
var jsTheCurveNum = 0; // the curve selected for tracing or other purposes

var jsGridWdthPc=0, jsGridHtPc=0;  // percent of canvas occupied by grid
var jSGridBeginLPc =0, jSGridBeginTPc=0;  // percent left edge before grid etc


// dimension and position globals
var jsYLabelMargin=0; // width of y-labels in the event of y labels left;
var jsXLabelMargin=0; // height of x-labels in the event of x labels below;
var jSGridBeginL=0; // total left space inside SVG until start of grid calculated in computeGridDimensions and then adjusted in drawDecorations
var jSGridBeginT=0; // total top space inside SVG until start of grid calculted in drawDecorations
var jsBeastNum=60666.666
var JsXaxisPosition=jsBeastNum; // position of axes = -1 if not visible
var JsYaxisPosition= jsBeastNum;

// gridlines globals
var JsXGridLines = new Array(); // these are screen coordinates 
var JsYGridLines = new Array(); // format [numLines, x1, x2, ...]
var JsXMinorGridLines = new Array(); // these are screen coordinates
var JsYMinorGridLines = new Array();
var JsXGridLinesActual = new Array(); // these are actual coordinates
var JsYGridLinesActual = new Array();
var JsNudgeY=8; // offset of tickmarks if axis showing or dist from edge
var JsNudgeX=3; // note these are screen coords


// error messages
var undefinedMg = "Y is not defined for the given range of X.";
try{
if (theLanguage == "es") undefinedMg ="Y no es definido por el rango especificado de X."
}
catch(error) {}


function grapher(name, width, height) {
// bColor = border color
// format: "graphFunction",function_string, color
// format "plotPoints",number,x1,y1,...,xn,yn,color

this.id = name;
this.grapherIframeID = name+"Iframe";
this.divId = name + "Div"; // id of the container div inside Iframe

this.isPopup = false; // deal with in-document figures differently
this.popupURL="";
this.popupWinName="" // will be assigned on insertGraph

// dimensions
// first backgrounds, etc 
this.totWdth = width; // width of entire SVG
this.totHt = height; // height of entire SVG
this.bottomMargin = 2; // margins around drawing canvas
this.topMargin = 2;
this.leftMargin = 2;
this.rightMargin = 2;
this.jsGridWdth=0; // should be the actual grid - calculated in drawDecorations
this.jsGridHt=100; // temporary; recalculated when it plots curves
this.wtSpace = 10; // space inside canvas around graph and labels
this.ifrMargin=0; // iframe margin for expanding the graph inside its frame
// next internally-used like spacing, etc
this.xLabelGap=8;// gap under grid above labels or between axis and labels
this.yLabelGap=8;
this.xLabelFontSize=3.5;
this.yLabelFontSize=3.5;
// end of dimensions


this.curveWt = 0.3 // thickness of curves in px - can be 0.1 etc
this.gridWt=0.2 // thickness of gridlines
this.borderWt=0.1 // thickness of graph border


this.mode = "cartesian"; // others are, for now "polar" TODO: "parametric"
this.jsCenter = [0, 0]; // screen coordinates of center for polar curves
this.showCoords = 0; //set to 1 if you want trace coordinates showing
this.tracing = 0; // tracing takes place on curves only
this.traceColor = "red";
this.traceStep = 0; // will set on insertGraph()
this.precisionX=12; // sig digits for auto grid lines
this.precisionY=12; 
this.decPlacesX = 2; // rounding of x-coordinates for tracing and showCoords -- changing to clickAccX/2 though....
this.decPlacesY = 2; // rounding of y-coordinates
this.clickAccX = .05; // rounds to this when clicked in interactive line
this.clickAccY = .05; // accuracy of x clicks
this.draggableBars = 0; // if 1 you can drag bars from the top
this.stopOnCutoff = false; // terminates all curves with arrows the first time they leaves the windopw

this.borderColor = ""; // make it the empty string for no border
this.backgroundColor = "white"; // any valid CSS format - eg "#ff7788" or "rgb(100,255,9)"
this.surroundColor = ""; // same format; not specified means does nothing
this.gridColor = "aqua";
this.coordsColor = "blue"; // color of coordinates appearing below 
this.xAxis = "on";
this.yAxis = "on";
this.xAxisPosn="0"; // change for graphs where you want an axis not thorugh the origin
this.yAxisPosn="0"; 
this.xGrid = "on";
this.yGrid = "on";
this.xLabels = []; // labels to place instead of values on grid (eg dates)
this.xLabelPosition = "onLines"; // otherwise "midLines" (that is, between grid lines as in. say, bar graphs)
this.xLabelsBelow = true;
this.yLabelsLeft = true;
this.xValuesShown = []; // if nonempty, these are the only values shown
this.yValuesShown = [];
this.xValuesRange=[];
this.yValuesRange=[];
this.nudgeDownxValues = 0; // pixels down (or up if neg) to shift x-axis labels 
this.nudgeRightxValues = 0; // pixels right (or up if neg)
this.nudgeDownyValues = 0; // pixels down (or up if neg) to shift y-axis labels 
this.nudgeRightyValues = 0; // pixels right (or up if neg)

this.title = '';
this.pointsColor = "purple";
this.linesColor="teal";
this.pointsText = '&nbsp; &nbsp; '; // the text where the coordinates are normally shown
this.action = doActions;
this.clicked = false;
this.slope = ""; // will be the line created by the user 
this.intercept = "";
this.interceptX = ""; // for vertical lines
this.lineSegment = []; // will be the line segment coords for above line
this.window = [-10, 10, -10, 10];
this.xActual = ""; // coordinates of cursor on graph
this.yActual = "";
this.xScreen = ""; // screen coordinates of cursor on graph
this.yScreen = "";
this.outOfBounds=0; // adjusted by in showCoords()
this.xClicked = ""; // screen coordinates of cursor on graph when clicked
this.yClicked = "";
this.xTrace = ""; // actual coordinates of cursor on graph when clicked
this.yTrace = "";
this.xPrev = ""; 
this.yPrev = "";
this.actionsList = new Array(); // an array of actions to do on setUpGraph
this.xGridStep = 1;
this.yGridStep = 1;
this.plottedPointsX = [0];
this.plottedPointsY = [0];
this.plottedCurves = [];
// format:  [string, xMin, xMax,"dot/circle/arrow","dot/circle/arrow", [ shading from arrays ]  ]
// each shading array is [leftlimit, rightlimit, color, transparency, shade-to-value, border color, border trnaparency ]
// does not yet shade to a cuvrve...
// eg [parent.intLimitsQ15[2],parent.intLimitsQ15[1],col2,.7,0,"",".7"]


this.curvesColors = ["teal","magenta","blue", "firebrick","coral","darkviolet", "purple","aqua","blue","red","grey", "navyblue", "black" ];
this.pointsPerCurve = 1.5*(this.totHt + this.totWdth); 
this.minDeltaXFactor = .00001; 
	// fraction of window for smallest Æx used in adaptiveSegment
this.adaptive = false; // permits adaptiveSegment
this.bars = [];
	// a bar is an array xCoords, yCoords, delta1, delta2, color, opacity, border opacity
	// x coords of the bar are [x-detla1, x+delta2]
	// opacity = -1 means pure white;
	// if color = "[ [r1, g1, b1] ,[r2, g2, b2]]" then it will scale them;
this.barLabels = "";  // either "y", or "xy" for both coords at present

this.showScalex = true;
this.showScaley = true;
this.showEveryx = 1; // allows a tick mark on every 1 grid line
this.showEveryy = 1;
this.startTicksx = 1; // start counting at first
this.startTicksy = 1;
this.switchShownLablesY = false // set to true to reverse which lables shown
this.xTicsRange = [];
this.yTicsRange = [];
this.xTics = []; // for user defined gridlines
this.yTics = []; // format [n, x1, x2, x3, ... xn]
this.gridType = ["line"]; // set to ["tic",length in px] for tickmarks
this.arrowLength = 40; // size of arrowheads
this.LRShadedBWidth = 2; // thickness of lines on left and right of shaded areas
this.textAreasBG = "white"; // clear background of textareas set = "" for none
this.Misc = [0, 0, 0, 0] // store miscellaneous properties here
this.MiscVal = [0, 0, 0, 0];
this.MiscLogic = [false, false, false, false];
this.onClick = "";
this.onMouseMove = "";
this.onMouseDown = "";
this.onMouseUp = "";
this.onMouseOver = ""
this.onMouseOut = "";
this.squeezeFactor = 1 // The larger squeezeFactor is, the more spread out the tick mark labels
this.ignoreXEdge = false;
// if the tickmark labels crash into each other, increase it to at least 1
this.IEFactor = 1; // needed to fix axis lables for specific graphs in IE

this.clipMargins=[0,0,0,0]; // margin before clipping in px
}
this.addToXCoord = 0; // adds to x-coord (pixels); another fix for Internet Explorer

// notice that it is outside of the definition....
// a global now 
// putting it in caused problems..

function graphTag(theGraph,thePath) {
// thePath is the relative path to the xml file
with(theGraph) {
	// preliminaries:
	
	onMouseMove = "alertCoord("+theGraph.name + ", " + decPlacesX + ", " + decPlacesY + "); ";
	if (draggableBars == 1) {
		onMouseDown = "dealWithMouseDownBars(" + id + "); ";
		onMouseMove += "dealWithMouseMoveBars(" + id + "); ";
		onMouseUp = "dealWithMouseUpBars(" + id + "); ";
		} // ifDragableBars
	else if (tracing == 1) {
		if (traceStep == 0) traceStep = (window[1]-window[0])/totWdth;
		onMouseDown = "dealWithMouseDownTrace(" + id + "); ";
// alert(traceStep);
		} // if tracing
// in the following, there are two elements on top of each other: One is the canvas, the other is the"Span" div for writing things.
// in IE, the second appears to be lower than the first.
	

var theString='<iframe id = "' + theGraph.grapherIframeID + '"  src= "' + thePath+'grapherFixed.xml" marginheight="0" frameborder="0" vspace="0" hspace="0" width="' + (10+totWdth+2*theGraph.ifrMargin) + '" height="' + (20+totHt+2*theGraph.ifrMargin) + '" style="overflow:hidden; " scrolling="no"></iframe>'





	return(theString);
	} // with theGraph

} // graphTag



function resizeMe(theGraph,w) {
var theID=theGraph.grapherIframeID;
var frameDoc = getIFrameDocument(theID);
var d= frameDoc.getElementById("graphDiv")
if(w>100)w=100;
var h=w*4.2;
//alert(theGraph)
d.style.height=h.toString()+"px";
d.style.width=h.toString()+"px";
}

function getElement(aID)
    {
        return (document.getElementById) ?
            document.getElementById(aID) : 

document.all[aID];
    }

    function getIFrameDocument(aID){ 
        var rv = null; 
        var frame=getElement(aID);
        // if contentDocument exists, W3C compliant (e.g. Mozilla) 
        if (frame.contentDocument)
            rv = frame.contentDocument;
        else // bad Internet Explorer  ;)
            rv = document.frames[aID].document;
        return rv;
    }


function doActions() {

}//

function adjustGraphHts() {
var numG=graphsOnPage.length;
for(var i=0;i<numG;i++){
	var theID=graphsOnPage[i].grapherIframeID;
	var theWdth=graphsOnPage[i].totWdth+ graphsOnPage[i].leftMargin+graphsOnPage[i].rightMargin;;
	var theHt= graphsOnPage[i].totHt+ graphsOnPage[i].topMargin+graphsOnPage[i].bottomMargin;
	var theifrMar=graphsOnPage[i].ifrMargin
	var maxWdth=theWdth+theifrMar;
	var maxHt=theHt+theifrMar;
	var frame = getElement(theID);
	var frameDoc = getIFrameDocument(theID);
	if (navigator.userAgent.indexOf('Firefox') !=-1) frameDoc.getElementById("graphDiv").style.resize="both";
	frameDoc.getElementById("graphDiv").style.width=theWdth.toString()+"px";
	frameDoc.getElementById("graphDiv").style.height=theHt.toString()+"px";
	frameDoc.getElementById("graphDiv").style.maxWidth=maxWdth.toString()+"px";
	frameDoc.getElementById("graphDiv").style.maxHeight=maxHt.toString()+"px";

	}
}


// *** polygons etc

var currentGraphjs = "";
var directionjs = 0;
// * Now rotation function definitions


function roundSig(n,sigs) {return(parseFloat(n.toPrecision(sigs)))}

//var testing123=false;
function drawVLine(G,xVal,lte,shadeCol,shadeOpacity,borderCol, borderOpacity) {
	
	//testing123=true
	var bottomL=screenCoords(G,xVal,yMMin); // xMMin is global 
	var topL=screenCoords(G,xVal,yMMax);
	//testing123=false

	if(lte) {
		// shade right
	
		
		var topR=screenCoords(G,xMMax,yMMax);
		var bottomR=screenCoords(G,xMMax,yMMin);
		var thePoly=[bottomL,topL,topR,bottomR]
	}
	else {
		// shade left
		var topR=screenCoords(G,xMMin,yMMax);
		var bottomR=screenCoords(G,G.window[0],yMMin);
		var thePoly=[bottomL,topL,topR,bottomR]
	}
	var graphDoc = getDoc (G);
	var theId="vPoly"+graphDoc.getElementById('polygons').length;
	var borderThickness=2;
	if(Math.abs(roundSigDig(xVal-xMin,6))==0) borderThickness=4;
	if(Math.abs(roundSigDig(xVal-xMax,6))==0) borderThickness=4;
	drawSVGFilledPoly(thePoly, G, theId, shadeCol,shadeOpacity,borderCol,borderOpacity,borderThickness)

	
}
// *** various special features:
// *** interactive line and curve: interactiveLine()


// *** end of special features


function setUpGraph(theGraph) {
//alert("in Setup jsRefreshingGraph  is " + jsRefreshingGraph)
if (!jsRefreshingGraph ) computeGridLines(theGraph); 



drawDecorations(theGraph);

// plotPoints(theGraph);
// Now do any actions
for (var i = 0; i <= (theGraph.actionsList).length-1; i++) {
	var doIt = eval(theGraph.actionsList[i])
	}

theGraph.clicked = false;
//alert("setUpGraph Done");
} // saveGraph

// *** erasing functions
function clearAll(G,groupName){
	//clears all the Xs put there by putX
	var graphDoc = getDoc(G);
	var theNode=graphDoc.getElementById(groupName);
	while (theNode.hasChildNodes()) {
		 theNode.removeChild(theNode.lastChild);
	}

}


function eraseGraph(theGraph) {
setUpGraph(theGraph);
} // restoreGraph

// ***  IT ALSO REMAINS TO DO THE TOPMATTER


var e = 2.718281828459045;
var pi = 3.141592653589793;



var theColor = 0; // the color of a pixel
var numColors = 7;
var lineColor = new Array();
	lineColor[0] = 	"red";
	lineColor[1] = 	"blue";
	lineColor[2] = 	"purple";
	lineColor[3] = 	"green";
	lineColor[4] = 	"magenta";
	lineColor[5] = 	"grey";
	lineColor[6] = 	"orange";
	lineColor[7] = 	"yellow";

var counter = 0; // for debugging
var X = 0;
var x = 0;
var y = 0;

var h = 0;
var xh = 0;
var hx = 0;
var t = 0;
var th = 0;
var ht = 0;

var A = 0;
var p1 = 0;

var quoteMark = unescape( '%22' );
var singlequoteMark = unescape( '%27' );


var infinity = 10000000000000  // 10^13;
var windowcropTally = 20; 
	// will not cut a window in half if more than this number of 
     // pixels pop out of range as a result



var autoY = true;
var autoGridline = true;

var okToRoll = true;

var theString = "";

var theFunction = ""; // the function




// var lineColor = 2; // red
// var lineColorLite = lineColor + 7;



var sigDigTotWdth = 2;  // for rounding of tick marks
var sigDigTotHt = 2;
var xVals = new Array(); // to store the values of x for evlauator
var yVals = new Array();  // to store the functions
var tminVals = new Array(); 
var tmaxVals = new Array();

var arraysize = 0; // number of functions
var xArraysize = 0; // number of x-values in evalautor
var maxnum = 5;  // max number of functions allowed
var maxtotWdth = 12; // max number of x-values allowed
var theValues = new makeArray2(maxtotWdth, maxnum); // copy of evalauator data

var fracMode = false; // fraction mode off default
var numSigDigs = 5;  // rounding of y-values default
var maxDenom = 99999;

// *** end globals


// *** Error Handler ******
function myErrorTrap(message,url,linenumber) {
alert("A lo mejor ha ingresadao algo equivocado o tal vez bede probar una version mas viejo. Pulse 'Muestra Ejemplos' para ver ejemplos de funciones correctamente formateadas.");
return (true);
} // end of on error

// ********************



// **************** Plot All Curves ********************

function plotAllCurves(theGraph){
var L=theGraph.plottedCurves.length;
if(L==0) return false;

var graphDoc = getDoc (theGraph);
removeChilddren(graphDoc,"curves");
var theCurve, theName;
for (var i = 0; i<L; i++) {
	theCurve = theGraph.plottedCurves [i];
	if(theGraph.plottedCurves [i].length==0) break;
	theName="y"+(i+1);
//alert (theCurve);
	var p = drawCurve(theGraph, theCurve, theGraph.curvesColors [i%12],theName);
	} // i
} // end of plot

// ******************End of Plot All Curves ***********

// **************** DRAWCURVE ******************************
// *** Draws a graph of a given funtion

function drawSVGCurve(testData, theGraph, theCurveName, theCurveColor,leftDec,rightDec) {
// leftDec and rightDec = "" or "arrow"
// Note for popup graphs, this needs to be called onload in the popup
// M = move to
// C = curve to
// use a 500 x 500 standard for eveyhting
// that is, assume the width = ht = 5000

//alert(testData)

// ** testing data

var mStr="M"+testData[0][0]+" "+testData[0][1] +" ";
for (var i=1;i<testData.length;i++) {
	mStr+= "L"+testData[i][0]+" "+testData[i][1] +" ";
	}
// mStr+= "Z"; // this only if you want to close the path back to the start point
// ** end of testing data

//alert(mStr)

var graphDoc = getDoc (theGraph);

var newG=graphDoc.createElementNS(svgNS,"g");
newG.setAttributeNS(null,"id", theCurveName);
graphDoc.getElementById('curves').appendChild(newG);
var pathElt= graphDoc.createElementNS(svgNS,"path");
pathElt.setAttributeNS(null,"d",mStr);
pathElt.setAttributeNS(null,"stroke",theCurveColor);
pathElt.setAttributeNS(null,"stroke-width",(theGraph.curveWt).toString());
pathElt.setAttributeNS(null,"style","fill:none;");
pathElt.setAttributeNS(null,"clip-path","url(#rectClip)");
if (rightDec=="arrow") {
	var mW=theGraph.arrowLength.toString(), mH=Math.round(mW/2);
	var theArr=graphDoc.createElementNS(svgNS,"marker");
	theArr.setAttributeNS(null,"id",theCurveName+"ra");
	theArr.setAttributeNS(null,"viewBox","0 0 10 10");
	theArr.setAttributeNS(null,"refX","10");
	theArr.setAttributeNS(null,"refY","5");
	theArr.setAttributeNS(null,"markerUnits","strokeWidth");
	theArr.setAttributeNS(null,"orient","auto");
	theArr.setAttributeNS(null,"markerWidth",mW)
	theArr.setAttributeNS(null,"markerHeight",mH);
	var aHead=graphDoc.createElementNS(svgNS,"polyline");
	aHead.setAttributeNS(null,"points","0,0 10,5 0,10 3,6 0,5 3,4");
	aHead.setAttributeNS(null,"stroke",theCurveColor);
	aHead.setAttributeNS(null,"fill",theCurveColor);
	theArr.appendChild(aHead);
	graphDoc.getElementById('graphdefs').appendChild(theArr);
	pathElt.setAttributeNS(null,"marker-end","url(#"+theCurveName+"ra)");
}
if (leftDec=="arrow") {
	var theArr=graphDoc.createElementNS(svgNS,"marker");
	theArr.setAttributeNS(null,"id",theCurveName+"la");
	theArr.setAttributeNS(null,"viewBox","0 0 10 10");
	theArr.setAttributeNS(null,"refX","0");
	theArr.setAttributeNS(null,"refY","5");
	theArr.setAttributeNS(null,"markerUnits","strokeWidth");
	theArr.setAttributeNS(null,"orient","auto");
	theArr.setAttributeNS(null,"markerWidth","40")
	theArr.setAttributeNS(null,"markerHeight","20");
	var aHead=graphDoc.createElementNS(svgNS,"polyline");
	aHead.setAttributeNS(null,"points","10,0 0,5 10,10 7,6 10,5 7,4");
	aHead.setAttributeNS(null,"stroke",theCurveColor);
	aHead.setAttributeNS(null,"fill",theCurveColor);
	theArr.appendChild(aHead);
	graphDoc.getElementById('graphdefs').appendChild(theArr);
	pathElt.setAttributeNS(null,"marker-start","url(#"+theCurveName+"la)");
}

graphDoc.getElementById(theCurveName).appendChild(pathElt);





//'<line x1="10%" y1="10%" x2="50%" y2="10%" style="stroke: red; stroke-
// <path d="M250 150 L150 350 L350 350 Z" />

} // drawSVGCurve


function drawSVGFilledPoly(inP, theGraph, thePolyName, theFillColor,theFillOpacity,theBcolor,theBopacity,strokeWidth) {

var pStr="", numPts=inP.length;
for (var i=0;i<numPts;i++) {
	pStr+= inP[i][0]+","+inP[i][1];
	if (i<numPts-1) pStr+=" ";
	}
//alert(inP)
	//***TESTING
	//pStr="10,10 10,100 100,100 100,10";
	//***END TESTING
var graphDoc = getDoc (theGraph);

var newG=graphDoc.createElementNS(svgNS,"g");
newG.setAttributeNS(null,"id", thePolyName);
graphDoc.getElementById('polygons').appendChild(newG);
var thePoly= graphDoc.createElementNS(svgNS,"polygon");
thePoly.setAttributeNS(null,"points",pStr);

//alert(theBcolor)
if (typeof theBcolor=="string") {
	
	thePoly.setAttributeNS(null,"stroke",theBcolor);
	thePoly.setAttributeNS(null,"stroke-opacity",theBopacity);
	thePoly.setAttributeNS(null,"stroke-width",strokeWidth);
}
else thePoly.setAttributeNS(null,"stroke-width",strokeWidth);
thePoly.setAttributeNS(null,"fill",theFillColor);
thePoly.setAttributeNS(null,"fill-opacity",theFillOpacity);

thePoly.setAttributeNS(null,"clip-path","url(#rectClip)");

graphDoc.getElementById(thePolyName).appendChild(thePoly);
}



function drawCurve(theGraph, theCurve, theCurveColor, theName) {

okToRoll = true;
var mStr="M";
var graphSegments = []; // will be an array of poly arrays
var filledPolys = []; // each element is just a sequence of points defining a poly
var numGraphSegments = 0;
var numFilledPolys = 0;
var noGo = false; // for a specific segment of the curve
var screen1, screen2;

var thexMin = theCurve [1];
var thexMax = theCurve [2];

var theyString = theCurve [0];
var theLeftDecoration = theCurve[3];
var theRightDecoration = theCurve[4];
var mustShade = false; 
var theShadeTermination = "0";

try {
	mustShade = (theCurve[5].length>0);
	}
catch(error) {};
// for shading to a curve

var theStrg = simpleParse(theyString);
//alert(theStrg)
var numDivisions = theGraph.pointsPerCurve; // for each curve
if (okToRoll) {
	// Search for a place to start the graph 
	// (in case initial y-coords are undefined or infinite.)
	var deltax = (thexMax - thexMin)/numDivisions;
	var LRBwidth = theGraph.LRShadedBWidth*(theGraph.window[1]-theGraph.window[2])/theGraph.totWdth;
//alert(deltax);
//deltax =.5; // testing
	x1 = thexMin;
	x = x1;
	y1 = checkEval(theStrg);
	} // if OKtoRoll

if (okToRoll) {
		// now plot the points
	// at this point (x1, y1) is the acceptable starting point
	if (theLeftDecoration == "dot") putDot(theGraph, x1,y1, theCurveColor,false);
	else if (theLeftDecoration == "circle") putDot(theGraph, x1,y1, theCurveColor,true);
	else if (theLeftDecoration == "x") putX(theGraph, x1,y1, theCurveColor);
	// need to check if the y-coords are acceptable
	
	var xStartC = x1, yStartC = y1 // remember these for later
	screen1 = screenCoords(theGraph, x1, y1);
	

	
	if (theRightDecoration=='circle') {
		// store endpoint screenc oored for later
		var xtemp=x;
		x=thexMax;ykk=checkEval(theStrg);
		var tee=screenCoords(theGraph,thexMax,ykk);
		x=xtemp;
	}
	numGraphSegments+=1;
	graphSegments[numGraphSegments]=[[ screen1[0], screen1[1]]];



	
	// now change

// alert(x);	
		var isFirstSegment = true, isLastSegment = false; // for arrowheads
		var thecount = 0; /// testing
		var startingX = x + deltax;
		for (var k = startingX; k <= thexMax; k+=deltax) {
			thecount++;
// if (thecount == 35) alert("thcount = " + thecount + "k = "+k);
// if (thecount == 41) alert("thcount = " + thecount + "k = "+k);
			x2 = k;
			x = x2;
			y2 = checkEval(theStrg);
			if (!isNaN(y2)) {
				if (y2 > infinity) y2 = infinity;
				else if (y2 < - infinity) y2 = - infinity; 
// alert(x1 + "," + y1 + "," + x2 + "," + y2);

					if (theGraph.adaptive) var p = adaptiveSegment(theGraph,x1,y1,x2,y2,theStrg, theCurveColor);
					else {	
						screen2 = screenCoords(theGraph, x2, y2);
						noGo = false;
						if(theGraph.stopOnCutoff) {
							if (y1 >= yMax*.99) noGo = true;
							else if (y1 <= yMin*.99) noGo = true;
							else if ( (theGraph.mode == "polar") && ((y1 >=yMax)|| (y2 >= yMax)) ) noGo = true;
						}
						
						if (!noGo) {
							var x2bar = screen2[0];
							var y2bar = screen2[1];
							// check if a right circle
							if ((theRightDecoration == "circle") && (x2bar-tee[0]< dotRadius)){
								if ((x2bar-tee[0])*(x2bar-tee[0])+(y2bar-tee[1])*(y2bar-tee[1])>=dotRadius*dotRadius) graphSegments[numGraphSegments].push([x2bar, y2bar])
							}
							else graphSegments[numGraphSegments].push([x2bar, y2bar])
							} // if not noGo
						else {
							if(theGraph.stopOnCutoff) {
								// do nothing, it seems...
							}

							else numGraphSegments+=1;

						} // if no go

						} // if not adaptive


				// now put in arrows if necessary
				//if ((theLeftDecoration == "arrow") && (isFirstSegment) ) putArrow(theGraph, theCurve, x1, y1, x2, y2, theCurveColor, "left");
			isFirstSegment = false;
			if (k + deltax > thexMax) isLastSegment = true;
			//if ((theRightDecoration == "arrow") && (isLastSegment) ) putArrow(theGraph, theCurve, x1, y1, x2, y2, theCurveColor, "right");
				x1 = x2;
				y1 = y2;
				} // If second point is defined
			else {
				for (var p = x2+deltax; p <= thexMax; p+=deltax) {
					x = p;
					y1 = checkEval(theStrg);
					if(!isNaN(y1)) break;
					} // end count
				k = p; // reset k further along the loop
				x1 = p;  // y1 is already what it is supposed to be
				} // second point was undefined
				
			
			if(thecount >= numDivisions + 2) k = thexMax+1;

			} // k
// put in right end-points
	if (theRightDecoration == "dot") putDot(theGraph, x1,y1, theCurveColor,false);
	else if (theRightDecoration == "circle") putDot(theGraph, x1,y1, theCurveColor,true);
	else if (theRightDecoration == "x") putX(theGraph, x1,y1, theCurveColor);
// redraw the left end-circles to prevent cures originating inside circles 
	

// now shading
	if(mustShade) {
	var numPolysToShade=theCurve[5].length;
	//alert(numPolysToShade)
	for (var h=0;h<numPolysToShade;h++) {
		
		numFilledPolys+=1;
		filledPolys[numFilledPolys]=[];

		var xStartS=theCurve[5][h][0], xEndS=theCurve[5][h][1];
		var xScrStart=screenCoords(theGraph, xStartS, 0)[0];
		var xScrEnd=screenCoords(theGraph, xEndS, 0)[0];
		// look for those in the curve array
		var iStart=0, iEnd=0;
		
		var arrLen=graphSegments[numGraphSegments].length;
		for (var i=0;i<arrLen;i++) {
			if ((xScrStart<=graphSegments[numGraphSegments][i][0])&&(graphSegments[numGraphSegments][i][0]<=xScrEnd)) filledPolys[numFilledPolys].push(graphSegments[numGraphSegments][i])
		}
		//alert(filledPolys[numFilledPolys].length)
		// now add additional points
		var theShadeTermination=theCurve[5][h][4];
		var theThickness=theCurve[5][h][7];
		
		var p1 = screenCoords(theGraph, xEndS, theShadeTermination);
		filledPolys[numFilledPolys].push([p1[0],p1[1]]);
		var p2 = screenCoords(theGraph, xStartS, theShadeTermination);
		filledPolys[numFilledPolys].push([p2[0],p2[1]]);
		// now actually draw this before drawing anything
		var theShadeCol=theCurve[5][h][2];
		var theShadeOpacity=theCurve[5][h][3];
		
		try{
			var theShadeBorderCol=theCurve[5][h][5];
			var theShadeBorderOpacity=theCurve[5][h][6];
		}
		catch(error) {}
		
		if ((typeof theShadeBorderCol == "string")&&(theShadeBorderCol !="")) drawSVGFilledPoly(filledPolys[numFilledPolys], theGraph, "P"+numFilledPolys, theShadeCol,theShadeOpacity,theShadeBorderCol,theShadeBorderOpacity,theThickness);
		else drawSVGFilledPoly(filledPolys[numFilledPolys], theGraph, "P"+numFilledPolys, theShadeCol,theShadeOpacity,theThickness);
	} //h

							
                                } // shading
	

// alert("k over");
	} // if okToRoll

	

// now draw the curves
//alert(graphSegments)
var lD=theLeftDecoration,rD=theRightDecoration;
if (numGraphSegments==1) drawSVGCurve(graphSegments[1], theGraph, theName, theCurveColor,lD,rD);
else {
	for (var i=1;i<= numGraphSegments;i++) {
	if (i==1) drawSVGCurve(graphSegments[i], theGraph, theName, theCurveColor,lD,"");
	else if (i==n) drawSVGCurve(graphSegments[i], theGraph, theName, theCurveColor,"","");
	else drawSVGCurve(graphSegments[i], theGraph, theName, theCurveColor,"",rD);
	}
}



//alert(graphSegments[numGraphSegments])
} // function drawCurve


// ************** end of draw Curve *************


function getDoc(theGraph){
if (graphDocNameGiven) return theDocObj;
if(theGraph.isPopup) {
	var theCmd="var popupDoc = " + theGraph.popupWinName + ".document";
	var doIt=eval(theCmd);
	var a = popupDoc.getElementById("svgImageID");
    var graphDoc = a.getSVGDocument();
// graphDoc = a.contentDocument;   
// works only in mozilla for actual SVGs
	}
else {
	var theID=theGraph.grapherIframeID;
	var frame = getElement(theID);
	var graphDoc = getIFrameDocument(theID);
	}
//alert(theID)
return(graphDoc)
}


function drawBackgrounds(theGraph) {
var graphDoc = getDoc (theGraph);
removeChilddren(graphDoc,"gridGroup");
with(theGraph){
	if (mode == "polar") {
		drawPolarDecorations(theGraph);
		return(true); // this gets us out of here
		}
	else {
//alert(jsGridHtPc)
		var lm=wtSpace+leftMargin+jsYLabelMargin, tm=wtSpace+topMargin
		var lmPC=100*(wtSpace+leftMargin+jsYLabelMargin)/totWdth, rmPC= 100*rightMargin/totWdth
		var tmPC= 100*(wtSpace+topMargin)/totHt, bmPC= 100*bottomMargin/totHt;
		var graphDoc=getDoc(theGraph);
		var surroundBox=graphDoc.getElementById("gSurround");
		surroundBox.setAttributeNS(null,"fill",surroundColor);
		surroundBox.setAttributeNS(null,"width", totWdth);
		surroundBox.setAttributeNS(null,"height", totHt);
		var gridBox=graphDoc.getElementById("grid");
		gridBox.setAttributeNS(null,"x",lm);
		gridBox.setAttributeNS(null,"y",tm);
//alert(jsGridWdth + ", " + jsGridHt );
		gridBox.setAttributeNS(null,"width",jsGridWdth.toString());
		gridBox.setAttributeNS(null,"height",jsGridHt.toString());
		gridBox.setAttributeNS(null,"fill",backgroundColor);
		var clippingRect=graphDoc.getElementById("cliprect");
		clippingRect.setAttributeNS(null,"width", jsGridWdth + theGraph.clipMargins[0]+ theGraph.clipMargins[1]);
		clippingRect.setAttributeNS(null,"height", jsGridHt + theGraph.clipMargins[2]+ theGraph.clipMargins[3]);
		clippingRect.setAttributeNS(null,"x",lm-theGraph.clipMargins[0]);
		clippingRect.setAttributeNS(null,"y",tm-theGraph.clipMargins[2]);
		clippingRect.setAttributeNS(null,"fill",backgroundColor);
		var graphElt= graphDoc.getElementById("myGraph");
		//graphElt.setAttributeNS(null,"viewBox","0 0 " + jsGridWdthPc + " " + jsGridHtPc);


		if(borderColor != "") {
			gridBox.setAttributeNS(null,"stroke",borderColor);
			gridBox.setAttributeNS(null,"stroke-width",borderWt.toString());
			}
		}
	} // with(theGraph)
}// drawBackgrounds


function underGp(theGraph) {
//computes gap under grid
return (theGraph.xLabelGap+theGraph.xLabelFontSize+theGraph.wtSpace);
} // underGp

function leftGp(theGraph) {
//computes gap left of grid assuming one character-wide label
return (theGraph.yLabelGap+theGraph.yLabelFontSize+theGraph.wtSpace);
} // underGp



// *************** Draw Gridlines, Axes, and Labels ***********
function drawDecorations(theGraph) {


//alert(theGraph.xLabelsBelow)
// Axis Label Positions
var graphDoc = getDoc (theGraph);
//alert([xMin,xMax,yMin,yMax]);
theGraph.window.length=0;
theGraph.window=[xMin,xMax,yMin,yMax];
var a = xMin;
var b = xMax;
var c = yMin;
var d = yMax;

//alert(theGraph.yTicsRange)

theGraph.xTicsRange  = theGraph.window.slice(0,2);
theGraph.yTicsRange = theGraph.window.slice(2,4);

// First the gridlines themselves
// Compute screen coords of gridlines and draw them

// x gridlines first:


// now y gridlines

// end of gridline calculations


//alert(JsYGridLinesActual);



// Next, the x-tick marks or x-axis labels
JstheFontsize=3.5;
var theStyle="font-size: "+ theGraph.xLabelFontSize +"px";
if (theGraph.xLabels.length > 0) {
// alert(theGraph.xLabelPosition);
	jsPuttingXLabels = true;
	var halfGLine = (JsXGridLines[2] - JsXGridLines[1])/2;
	for (var i = 1; i <= JsXGridLines[0]; i++) {
		if (theGraph.xLabelPosition == "onLines") putText(theGraph, theGraph.xLabels[i-1], theStyle, theGraph.xLabelFontSize, JsXGridLines[i] + theGraph.nudgeRightxValues, xLabelsPosn, 0, -10, false);
		else {
	if (theGraph.xLabelPosition == "midLines") putText(theGraph, theGraph.xLabels[i-1], theStyle, JsXGridLines[i] + halfGLine + theGraph.nudgeRightxValues, xLabelsPosn, 0, -10, true);
	}

		} // i
	jsPuttingXLabels = false;
//alert(JsXGridLinesActual);
// place the labels at (xLabelsPosn, centering automatic);


	} // putting labels


else if (theGraph.showScalex) {
//alert(JsXGridLinesActual);


// ***TESTING
var st = '';
//for (var k = 0; k <= JsXGridLines[0]; k++) st += JsXGridLines[k].toString() + ", ";
//alert(st);
//***END TESTING
	// set up array of ones to skip
	var skipArrayx = new Array();
	// first figure out how many significant digits to display
	sigDigTotWdth = 2;// minimum
	var mustIncrease = true;
	for (var i = sigDigTotWdth; i <= 12; i++) { 
		sigDigTotWdth = i;
	 	if(!mustIncrease) break;
	 	else {
		 for (var j = 1; j <= JsXGridLinesActual[0]-1; j++) {
	 		if (roundSig(JsXGridLinesActual[j],i) != roundSig(JsXGridLinesActual[j+1],i)) {mustIncrease = false;break }
				} // j
			} // if mustIncrease
		} // i
//alert(sigDigTotWdth)

// Also look into why JsXaxisPosition is -1 when it should be 0 for the default settings


	// now nudge left or right of axis if necessary:
//alert(graphDoc)
	var nudgeUp=0;
	var theHeight=getHeight("0", theStyle, graphDoc)*(d-c)/theGraph.jsGridHt;
//alert("here")
	if (JsXaxisPosition  != jsBeastNum) {
		//if ((c*d<0)&&(d>-2*c)) nudgeUp = JsNudgeY;
		//else nudgeUp = - JsNudgeY;
		}
//alert(JsXaxisPosition)
	var thexMultiple=1; // actually undefined here
	if (thexMultiple < 6666) {
		// now actually put in the tick marks
			var theCharPosn = 0; 
			var deltaCharPos =0;
			var skipThis = false;
//alert(JsXGridLinesActual[0] + ", " + thexMultiple + ", start ticksx = " + theGraph.startTicksx);
		for (var i = theGraph.startTicksx; i <= JsXGridLinesActual[0]; i+= thexMultiple) {
			
			if ((theGraph.xValuesShown).length == 0) {
				skipThis = false;
				if ((i > theGraph.Misc[0] ) && (i - thexMultiple < theGraph.Misc[0])) i = theGraph.Misc[0];
				var jsEpsilon = theGraph.minDeltaXFactor*(theGraph.window[1]- theGraph.window[0]);
				if (!theGraph.xLabelsBelow) {
					if ((JsXGridLinesActual[i]<a) || (JsXGridLinesActual[i]>b) || (JsXGridLinesActual[i] > theGraph.xTicsRange[1] + jsEpsilon) || (JsXGridLinesActual [i] < theGraph.xTicsRange[0]- jsEpsilon)) skipThis = true;
					}
				else {
					if ((JsXGridLinesActual[i]<a) || (JsXGridLinesActual[i]>b) || (JsXGridLinesActual [i] > theGraph.xTicsRange[1] + jsEpsilon) || (JsXGridLinesActual [i] < theGraph.xTicsRange[0] - jsEpsilon)) skipThis = true;
					}
		} // if xValuesShown is empty

		else {
//alert(JsXGridLinesActual[0])
			skipThis = true;
			for (var j = 0; j <= (theGraph.xValuesShown).length-1; j++) {
				if (roundSig(JsXGridLinesActual[i], sigDigTotWdth) == theGraph.xValuesShown[j]) {
					skipThis = false;
//alert("Skipped")
					}
				}
			} // if xValuesShown is nonempty
			if ((JsXGridLinesActual[i]==0)&&(a*b<=0)&&(c*d<=0)) skipArrayx[i]=true;
			if(skipThis)skipArrayx[i]=true;
//alert(skipArrayx[i]);
//alert(theGraph.xLabelsBelow)
			
			} // i
		} // if thexMultiple < 6666
	} // if showScalex
//alert(xLabelsPosn)
// *** End of the x-tick marks ***


// *** Now the origin if it is in bottom left corner
if((theGraph.showScalex)&& (theGraph.showScaley)) {
	if ((theGraph.window[0] == 0)&& (theGraph.window[2] == 0))
		{
		if ((theGraph.yLabelsLeft)&&( theGraph.xLabelsBelow)) {
			putText(theGraph,theStr,theStyle, theGraph.yLabelFontSize, 0,0, 0, 0, false,true);
		}
		}
	}

// alert("about to put in Y tick markes")

// *** Now the y-tick marks first compute them ***
theStyle="font-size:"+ theGraph.yLabelFontSize +"px";
jsYLabelMargin=0; // adjusted if needs be
var skipArrayy = new Array();
if (theGraph.showScaley){
//alert("here")
// alert(JsYGridLinesActual);

	// first figure out how many significant digits to display
	//alert(JsYGridLinesActual)
	sigDigTotHt = 2;// minimum
	var mustIncrease = true;
	for (var i = sigDigTotHt; i <= 12; i++) { 
		sigDigTotHt = i;
		if(!mustIncrease) break;
		else {
			for (var j = 1; j <= JsYGridLinesActual[0]-1; j++) {
				if ((roundSig(JsYGridLinesActual[j],i) == roundSig(JsYGridLinesActual[j+1],i)) && (JsYGridLinesActual[j] != JsYGridLinesActual[j+1])) break;
				mustIncrease = false;
				} // j
			} // if mustIncrease
		} // i

	for (var i = 1; i <= JsYGridLinesActual[0]; i++) {
		if ( ((i+1-theGraph.startTicksy) % theGraph.showEveryy == 0)&& (i >= theGraph.startTicksy) ) skipArrayy[i] = false; else skipArrayy[i] = true;
		} // i

		if (theGraph.switchShownLablesY) {
//alert(JsYGridLines);
			for (var i = 1; i <= JsYGridLinesActual[0]; i++) {
				if(skipArrayy[i] ) skipArrayy[i] = false;
				else skipArrayy[i] = true}
			}
//alert(skipArrayy)
// if the origin is bottom left, it should not also appear in the y-coordinates:
// (in this case it appears last in the gridLines array....)
if((theGraph.showScalex)&&(theGraph.showScaley)) {
	if ((theGraph.window[0] == 0)&& (theGraph.window[2] == 0))
		{
		if (JsYGridLinesActual[JsYGridLinesActual[0]] == 0) skipArrayy[JsYGridLinesActual[0]] = true;
		}
	}

	var theHeight=getHeight("0", theStyle, graphDoc)*(d-c)/theGraph.jsGridHt;

//alert("theGraph.yGridStep  = " + theGraph.yGridStep  + ", " + theGraph.showEveryy  + "," + theyMultiple);


//alert(JsYGridLinesActual[0])

		// first estimate longest label
		var maxLen = 0;
		for (var i = 1; i <= JsYGridLinesActual[0]; i++) {
			var theStr = (roundSig(JsYGridLinesActual[i], sigDigTotHt)).toString();
			var theLen = getWidth(theStr, theStyle, graphDoc)
			if (theLen > maxLen) maxLen = theLen;
//alert(theStr + " has a width of " + theLen);
			} // i
			var theCharPosn = 0; 
			var deltaCharPos =0;
			var skipThis = false;
//alert(maxLen)
	if(theGraph.yLabelsLeft)jsYLabelMargin = maxLen;
	


// *** End of the y-tick marks ***
} // if showScaley




//**** drawing part *******************
with(theGraph) {
//alert("in the drawing part")

	jSGridBeginL=leftMargin+wtSpace+jsYLabelMargin;
	jSGridBeginT=topMargin+wtSpace;
	jSGridBeginLPc=100*jSGridBeginL/totWdth;
	jSGridBeginTPc=100*jSGridBeginT/totHt;
//alert(jsYLabelMargin);
	if ((theGraph.xLabelsBelow)||(c > 0)||(d < 0)){
//alert("here")
		var underGap=underGp(theGraph);
		jsGridHt=totHt-2*wtSpace-topMargin-bottomMargin; // subtract top gap and underGap
//alert(jsGridHt)
		jsGridWdth=totWdth-2*wtSpace-leftMargin-rightMargin;
//alert(jsGridWdth)
		}
	else {
//alert(jsYLabelMargin);
		jsGridWdth= totWdth-2*wtSpace - yLabelGap - leftMargin - rightMargin-jsYLabelMargin;
		jsGridHt= totHt-2*wtSpace - xLabelGap  - topMargin - bottomMargin;
		}
//alert(theGraph.jsGridHt);
//alert(theGraph. totHt);
//alert("jsGridWdth = " + jsGridWdth)
	jsGridWdthPc=(jsGridWdth/jsGridHt)*100*jsGridWdth/totWdth;
	jsGridHtPc=100*jsGridHt/totHt;
//alert(jsGridWdthPc + ", " + jsGridHtPc );



	} // with(theGraph)
//alert("grid width = " + theGraph.jsGridWdth)
drawBackgrounds(theGraph);

// now actually draw the gridlines:

// x gridlines first:
if ((theGraph.xGridStep > 0)&&(theGraph.xGrid == "on")) {
	// compute y-coords of the gridline endpoints
	var xC="0"; // x-coord of gridline on screen
	
	if(theGraph.gridType[0] == "line") {
		
		var yst=screenCoords(theGraph,0,c)[1];
		var yend=screenCoords(theGraph,0,d)[1];
	//alert("grid width = " + theGraph.jsGridWdth)
	//alert(JsXGridLinesActual)
			}
		
	for (var i = 1; i <= JsXGridLinesActual[0]; i++) 
			{
			if ((JsXGridLinesActual [i]!=0)||(theGraph.yAxis=="off")) {
				xC=(screenCoords(theGraph, JsXGridLinesActual[i], 0)[0]).toString();
				var lnE=graphDoc.createElementNS(svgNS,"line");
				lnE.setAttributeNS(null,"x1",xC);
				lnE.setAttributeNS(null,"y1",yst.toString());
				lnE.setAttributeNS(null,"x2", xC);
				lnE.setAttributeNS(null,"y2",yend.toString());
				lnE.setAttributeNS(null,"stroke-width", (theGraph.curveWt).toString());
				lnE.setAttributeNS(null,"stroke",theGraph.gridColor);
				lnE.setAttributeNS(null,"style","fill:none;");
				graphDoc.getElementById("gridGroup").appendChild(lnE);
				} // if not the axis
			}//i
} //if xGridStep>0 etc
// y gridlines
if ((theGraph.yGridStep > 0)&&(theGraph.yGrid == "on")) {
	// compute y-coords of the gridline endpoints
	var yC="0"; // y-coord of gridline on screen
	var graphDoc = getDoc (theGraph);
	if(theGraph.gridType[0] == "line") {
		var xst=screenCoords(theGraph,a,0)[0];
		var xend=screenCoords(theGraph,b,0)[0];
		}
	
//alert("got here")

for (var i = 1; i <= JsYGridLinesActual[0]; i++) 
		{
		if ((JsYGridLinesActual[0]!=0)||(theGraph.xAxis=="off")) {
			yC=(screenCoords(theGraph, 0, JsYGridLinesActual[i])[1]).toString();
			var lnE=graphDoc.createElementNS(svgNS,"line");
			lnE.setAttributeNS(null,"y1",yC);
			lnE.setAttributeNS(null,"x1",xst.toString());
			lnE.setAttributeNS(null,"y2", yC);
			lnE.setAttributeNS(null,"x2",xend.toString());
			lnE.setAttributeNS(null,"stroke-width", (theGraph.curveWt).toString());
			lnE.setAttributeNS(null,"stroke",theGraph.gridColor);
			lnE.setAttributeNS(null,"style","fill:none;");
			graphDoc.getElementById("gridGroup").appendChild(lnE);
			} // if not the axis
		}//i

// xtic marks
} //if yGridStep>0 etc
//alert("got there")

	// need max length of the labels first -- roughly 6 pts/char
	var maxLength = 0;
if (theGraph.showScalex) {
//alert(JsXGridLinesActual[0]);
	for (var i = theGraph.startTicksx; i <= JsXGridLinesActual[0]; i++) {

		if ( ( (i- theGraph.startTicksx) % theGraph.showEveryx == 0)&& (i >= theGraph.startTicksx) ) skipArrayx[i] = false; else skipArrayx[i] = true;
//alert(skipArrayx[i]);
		var theStr = (roundSig(JsXGridLinesActual[i], sigDigTotWdth)).toString();
		var graphDoc = getDoc (theGraph);
		var theLen = getWidth(theStr, theStyle, graphDoc)*(b-a)/theGraph.jsGridWdth; 
//alert(theStr + " has length " + theLen)
		if(theLen > maxLength) maxLength = theLen;
		}// i

	var thexMultiple = 6666;
//alert(maxLength*theGraph.squeezeFactor);
	if (theGraph.xGridStep > 0) thexMultiple  = Math.round(maxLength*theGraph.squeezeFactor/theGraph.xGridStep + .5);
if (theGraph.xValuesShown.length > 0) thexMultiple = 1;
//alert(thexMultiple);
//alert(xLabelsPosn)
//alert(theGraph.xValuesShown.length)
for (var i = theGraph.startTicksx; i <= JsXGridLinesActual[0]; i+= thexMultiple){
	if ( (!skipArrayx[i])) {
				var theStr = (roundSig(JsXGridLinesActual[i], sigDigTotWdth)).toString();


				var hitEdge = false;
				if ((theGraph.ignoreXEdge) || (!hitEdge)) {
					
					if (theGraph.xValuesRange.length==0) putText(theGraph,theStr,theStyle, theGraph.xLabelFontSize, (JsXGridLinesActual [i] + theGraph.nudgeRightxValues), xLabelsPosn, 0, nudgeUp, false,true,"","center");
					else if ((JsXGridLinesActual [i]>=theGraph.xValuesRange[0])&&(JsXGridLinesActual [i]<=theGraph.xValuesRange[1])) putText(theGraph,theStr,theStyle, theGraph.xLabelFontSize, (JsXGridLinesActual [i] + theGraph.nudgeRightxValues), xLabelsPosn, 0, nudgeUp, false,true,"","center");
// make the last false true to not the border
					} // if not hitEdge
				} // if not skipThis

	} //i

}

// **** write the ytic marks:
if (theGraph.showScaley){
//alert("theGraph.startTicksy = " + theGraph.startTicksy + ",  JsYGridLinesActual[0] = " + JsYGridLinesActual[0] + ", theyMultiple = " + theyMultiple)
// need maxlength for y

var maxLeny=0;
maxLength=0;
var theLeny;
var graphDoc = getDoc (theGraph);
for (var i = theGraph.startTicksy; i <= JsYGridLinesActual[0]; i++)  	{
	var theStr = (roundSig(JsYGridLinesActual[i], sigDigTotHt)).toString();
	theLeny = getWidth(theStr, theStyle, graphDoc);
//alert(theStr + " has length " + theLeny)
	if(theLeny > maxLength) maxLength = theLeny;
		}// i
maxLeny= maxLength;

//alert((theGraph.yTicsRange))
for (var i = theGraph.startTicksy; i <= JsYGridLinesActual[0]; i+= 1) 	{

	if ((theGraph.yValuesShown).length == 0) {
		skipThis = false;
		if ((JsYGridLinesActual [i] > theGraph.yTicsRange[1]) || (JsYGridLinesActual [i] < theGraph.yTicsRange[0])) skipThis = true;
		} // if yValuesShown is empty
	else {
		skipThis = true;
		for (var j = 0; j <= (theGraph.yValuesShown).length-1; j++) {
			if (roundSig((JsYGridLinesActual[i]- theGraph.yValuesShown[j]), sigDigTotHt) == 0) skipThis = false;
			}
		} // if yValuesShown is nonempty
	if ((JsYGridLinesActual[i]==0)&&(a*b<=0)&&(c*d<=0)) skipThis=true;
// no origin if both axis showing
//alert(skipArrayy)

		if ((!skipThis) && (!skipArrayy[i]))  {
			var theStr = (roundSig(JsYGridLinesActual[i], sigDigTotHt)).toString();
//alert(theStr)
			var theLen = theStr.length;

			var nudgeRt=0;
			if(theGraph.yLabelsLeft) nudgeRt+=1;
//FIX THIS FOR CASE WHEN AXIS IS NOT SHOWING - eg 4 < x < 5

	
					//alert("there")
					nudgeRt-=JsNudgeX-maxLeny/100;
					
//alert(JsYGridLinesActual [i])
					if (theGraph.yValuesRange.length==0) putText(theGraph,theStr,theStyle, theGraph.yLabelFontSize, yLabelsPosn, (JsYGridLinesActual[i] + theGraph.nudgeRightyValues), nudgeRt,0, false,true,"","right")
					else if ((JsYGridLinesActual[i]>=theGraph.yValuesRange[0])&&(JsYGridLinesActual[i]<=theGraph.yValuesRange[1])) putText(theGraph,theStr,theStyle, theGraph.yLabelFontSize, yLabelsPosn, (JsYGridLinesActual[i] + theGraph.nudgeRightyValues), nudgeRt,0, false,true,"","right")
					
			} // if not skipThis

	} // i

} // if showScaley
//alert("got there 3")


// Next the axes
// Location LAxis
//alert("Location LAxis; JsYaxisPosition  = " + JsYaxisPosition );
var xAxisPlease = false, yAxisPlease = false;

if ((JsYaxisPosition  != jsBeastNum)&&(theGraph.yAxis == "on")) yAxisPlease = true;
if ((JsXaxisPosition  != jsBeastNum) &&(theGraph.xAxis == "on")) xAxisPlease = true;
drawAxes(theGraph, xAxisPlease, yAxisPlease)
//alert("got to end of drawDecorations")
} // drawDecorations


function drawAxes(theGraph, xAxisPlease, yAxisPlease) {
// x, y = 0 for no axis, 1 for yes

//alert(JsYaxisPosition );

// draw the axes
var graphDoc = getDoc (theGraph);

if (xAxisPlease) {
	var xAxY=theGraph.xAxisPosn;
	var bP=screenCoords(theGraph,theGraph.window[0],xAxY);
	var eP=screenCoords(theGraph,theGraph.window[1],xAxY);
	var xst=bP[0].toString(),xend=(eP[0]-1.8).toString(),yC=bP[1].toString();
	var lnE=graphDoc.createElementNS(svgNS,"line");
	lnE.setAttributeNS(null,"y1",yC);
	lnE.setAttributeNS(null,"x1",xst);
	lnE.setAttributeNS(null,"y2",yC);
	lnE.setAttributeNS(null,"x2",xend);
	lnE.setAttributeNS(null,"stroke-width",(theGraph.curveWt).toString());
	lnE.setAttributeNS(null,"stroke","black");
	lnE.setAttributeNS(null,"style","fill:none;");
// set arrowhead color
	graphDoc.getElementById("myArr").setAttributeNS(null,"stroke","black");
	graphDoc.getElementById("myArr").setAttributeNS(null,"fill","black");
	lnE.setAttributeNS(null,"marker-end","url(#arrowHead)");
	graphDoc.getElementById("gridGroup").appendChild(lnE);
	} // x axis


if (yAxisPlease) {
	var yAxX=theGraph.yAxisPosn;
	var bP=screenCoords(theGraph,yAxX,theGraph.window[2]);
	var eP=screenCoords(theGraph,yAxX,theGraph.window[3]);
	var yst=bP[1].toString(),yend=(eP[1]+1.8).toString(),xC=bP[0].toString();
	var lnE=graphDoc.createElementNS(svgNS,"line");
	lnE.setAttributeNS(null,"x1",xC);
	lnE.setAttributeNS(null,"y1",yst);
	lnE.setAttributeNS(null,"x2",xC);
	lnE.setAttributeNS(null,"y2",yend);
	lnE.setAttributeNS(null,"stroke-width",(theGraph.curveWt).toString());
	lnE.setAttributeNS(null,"stroke","black");
	lnE.setAttributeNS(null,"style","fill:none;");
	lnE.setAttributeNS(null,"marker-end","url(#arrowHead)")
	graphDoc.getElementById("gridGroup").appendChild(lnE);
	} // x axis
//alert("got there 4")
} // drawAxes









// ******************Enf of Draw Gridlines and Axes ***********

// *************** Utilities follow ***************************





// Notes Nov 21 2012
// jsXLabelMargin iis never set anywhere to anything but zero

function screenCoords(theGraph, x1, y1) {
// returns the screen coordinates as an array [0] = x [1] = y
if (theGraph.mode == "cartesian") {
//if(testing123) alert("y = " + y1 + "window top = " + d)
	var a = theGraph.window[0];
	var b = theGraph.window[1];
	var c = theGraph.window[2];
	var d = theGraph.window[3];
	var theWidth = grapher1.jsGridWdth; 
	var theHeight = grapher1.jsGridHt;
//alert("theWidth = " + theWidth + ". theHeight = " + theHeight)
	var x1bar = theGraph.leftMargin + theGraph.wtSpace + jsYLabelMargin + theWidth*(x1-a)/(b-a);
	var y1bar = theGraph.topMargin  + theGraph.wtSpace  + theHeight*(d-y1)/(d-c);
	if(y1bar>jsBeastNum) y1bar=jsBeastNum;
	if(y1bar<-jsBeastNum) y1bar=-jsBeastNum;
	return([x1bar, y1bar]);
	}
else {}
} // screenCoords


function sesameG(winName, pageURL, title, h,w){ 
// note winName need to be global in the document
var theCmd=winName + " = window.open ('" + pageURL + "', '" + title + "', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + w + ", height=" + h + "'); " + winName + ".focus();";
//alert(theCmd)
var doIt=eval(theCmd);
}





// ********* FUNCTION PARSER ***********



function checkEval(theString) {
		try
		{
 		return(eval(theString));
		}
	catch (error)
		{
 		 return("not a number");
		}
}



// ***********************************************
// **** Graphing Routine
// ***********************************************

// ********************************************************************
// *********** Initilaize the Canvas & Set up the Axes and Gridlines ****
// ********************************************************************

function computeGridLines(theGraph) {
// actually computes gridbox dimensions as well

// alert("Entered computeGridLines")
if (okToRoll) {
var a = theGraph.window[0];
var b = theGraph.window[1];
var c = theGraph.window[2];
var d = theGraph.window[3];
if ((a > 0)||(b < 0)||(theGraph.yLabelsLeft)) yLabelsPosn = a-0.01*(b-a);
else yLabelsPosn = 0;
if ((c > 0)||(d < 0)||(theGraph.xLabelsBelow)) xLabelsPosn = c-0.045*(d-c);
else xLabelsPosn = 0;

xLabelsPosn += theGraph.nudgeDownxValues;
yLabelsPosn += theGraph.nudgeRightyValues;


var epsilonXJS=epsilonjs*(b-a), epsilonYJS=epsilonjs*(d-c);



// Axes & gridlines
//JsXGridLines are screen coords, JsXGridLinesActual are actual coords
with(theGraph){
	
	if (xTics.length > 1) jsXGridAuto = false;
	if (yTics.length > 1) jsYGridAuto = false;
	

	// Auto x gridlines begin
	if (jsXGridAuto){
		
		var numXLines=0, dX=0;
		theGraph.Misc[0] = 6660000000;
		if (a*b>0) {
			// no y-axis appears in the interior in this case
			
			if (xGridStep > 0) numXLines = 1+Math.floor((b-a)/xGridStep+epsilonXJS); // number of gridlines
			JsXGridLinesActual[0]=numXLines;
			if (numXLines==1) {numXLines=2}// should not happen..
			dX=xGridStep;
			for(var i=0;i<numXLines;i++){
				JsXGridLinesActual[i+1]= roundSig((a+dX*i),precisionX);
				}
			} //if (a*b>0)
		else {
			// in auto mode include y=0 as one of them
			var tempArr=[0], xk=0;
			dX=xGridStep;

			numXLines=1;
			while ((dX>0)&&(xk<=b-dX+epsilonXJS)) { 
				xk+=dX;
				numXLines+=1;
				tempArr.push(roundSig(xk,precisionX));
				} // while
			xk=0;
			while ((dX>0)&&(xk>=a+dX-epsilonXJS)) { 
				xk-=dX;
				numXLines+=1;
				tempArr.push(roundSig(xk,precisionX));
				} // while
			tempArr.sort(function(p,q){return p - q})
			JsXGridLinesActual[0]=numXLines;
			for (var i=1;i<=numXLines;i++) JsXGridLinesActual[i]=tempArr[i-1]
			} // (a*b<0)
		} // if jsXGridAuto

	if (jsYGridAuto){
		var numYLines=0, dY=0;
		if (c*d>0) {
			// no x-axis appears in the interior in this case
			if (yGridStep > 0) numYLines = 1+Math.floor((d-c)/yGridStep+epsilonYJS); // number of gridlines
			JsYGridLinesActual[0]=numYLines;
			if (numYLines==1) {numYLines=2}// should not happen..
			dY=yGridStep;
			for(var i=0;i<numYLines;i++){
				JsYGridLinesActual[i+1]= roundSig((c+dY*i),precisionY);
				}
			} //if (c*d>0)
		else {
			// in auto mode include x=0 as one of them
			var tempArr=[0], yk=0;
			dY=yGridStep;
			numYLines=1;
			while ((dY>0)&&(yk<=d-dY+epsilonYJS)) { 
				yk+=dY;
				numYLines+=1;
				tempArr.push(roundSig(yk,precisionY));
				} // while
			yk=0;
			while ((dY>0)&&(yk>=c+dY-epsilonYJS)) { 
				yk-=dY;
				numYLines+=1;
				tempArr.push(roundSig(yk,precisionY));
				} // while
			tempArr.sort(function(p,q){return p - q})
			JsYGridLinesActual[0]=numYLines;
			for (var i=1;i<=numYLines;i++) JsYGridLinesActual[i]=tempArr[i-1]
			} // (c*d<0)
			//alert(JsYGridLinesActual)
		} // if jsYGridAuto
	} // with(theGraph)

//alert(JsYGridLinesActual)


// compute preliminary grid dimensions (assuming no y labels left)
// Now compute the grid dimensions

// need to first set gridwidth for later use





// compute preliminary axis positions (assuming no y labels left)

var a0=theGraph.yAxisPosn, c0=theGraph.xAxisPosn
if ((theGraph.yAxis=="on")&&((a-a0)*(b-a0)<=0)) JsYaxisPosition=a0; else JsYaxisPosition=jsBeastNum;
if ((theGraph.xAxis=="on")&&((c-c0)*(d-c0)<=0)) JsXaxisPosition=c0; else JsXaxisPosition=jsBeastNum;


//alert(JsYaxisPosition)




// NOTE: jsXGridAuto and jsYGridAuto are set to true for automatically determining gridline positions. This **always** happens unless there are given tics positions in the grapher structure (and nothing to to whether 'auto" ison or off in the grapher and evaluator window -- see functionGrapherCose1)



	} // if okToRoll
} // computeGridLines





// ************** SEGMENT *************
// creates a clipped segment in the window
// note that the segment is automatically clipped by excanvas 
// so there is no work for us here
// surveName will be, say, "y1", "y2" etc
function segment(theGraph, x1,y1,x2,y2, theCurveName) {
var screen1 = screenCoords(theGraph, x1, y1);
var screen2 = screenCoords(theGraph, x2, y2);

// do some clipping for Windoze
var xMin = theGraph.window[0];
var xMax = theGraph.window[1];
var yMin = theGraph.window[2];
var yMax = theGraph.window[3];
var noGo = false;
if ((y1 > yMax) && (y2 > yMax)) noGo = true;
else if ((y1 < yMin) && (y2 < yMin)) noGo = true;
else if  ((x1 > xMax) && (x2 > xMax)) noGo = true;
else if  ((x1 < xMin) && (x2 < xMin)) noGo = true;
else if ( (theGraph.mode == "polar") && ((y1 > yMax) || (y2 > yMax)) ) noGo = true;

if (!noGo) {
	
	var x1bar = screen1[0];
	var x2bar = screen2[0];this.linest
	var y1bar = screen1[1];
	var y2bar = screen2[1];
	
	var graphDoc = getDoc (theGraph);
	var stroke1= graphDoc.createElementNS(svgNS,"line");
	stroke1.setAttributeNS(null,"id", theCurveName);
	stroke1.setAttributeNS(null,"x1",x1bar);
	stroke1.setAttributeNS(null,"x2",x2bar);
	stroke1.setAttributeNS(null,"y1",y1bar);
	stroke1.setAttributeNS(null,"y2",y2bar);
	stroke1.setAttributeNS(null,"stroke",theGraph.linesColor);
	stroke1.setAttributeNS(null,"stroke-width",theGraph.curveWt.toString());
	stroke1.setAttributeNS(null,"clip-path","url(#rectClip)");
	graphDoc.getElementById("lines").appendChild(stroke1);

	}// if not noGo

} // segment






// ********* Added Routines and globals for Plotting Points
var plottingPoints = false;
var tab = unescape( "%09" );	
var cr = unescape( "%0D" );	
var lf = unescape( "%0A" );
var semicolon = unescape( '%3B' );
var comma = ",";
var textareaText = '';
var maxNumPoints = 100; 
var numPoints = 0;
var thePlottedPoints = new makeArray2(maxNumPoints,2);
var yMaxPoints = 0;
var yMinPoints = 0;
var xHeight = 4; // half-height of the plotted Xs
var dotRadius = 4; // radius of end-point dots
var squareRadius = 4; // radius of end-point dots






function putDot(theGraph, x1,y1, color,isOpen, radius) {
	//if(isOpen) alert("in putDot; open dot")
// returns the index of the dot created
// radius is optional; if unspecified uses dotRadius
// commented out the clip below becaue we dont want half dots on the edge
// instead, do the following
if ((x1<theGraph.window[0])||(x1>theGraph.window[1]))return false;
if ((y1<theGraph.window[2])||(y1>theGraph.window[3]))return false;
var theRadius=(typeof radius!= "number")? dotRadius:radius;
var screen1 = screenCoords(theGraph, x1, y1);
var x1bar = screen1[0];
var y1bar = screen1[1];
var graphDoc = getDoc (theGraph);
var stroke1= graphDoc.createElementNS(svgNS,"circle");
stroke1.setAttributeNS(null,"cx",x1bar);
stroke1.setAttributeNS(null,"cy", y1bar);
stroke1.setAttributeNS(null,"r", theRadius);
stroke1.setAttributeNS(null,"stroke",color);
if(isOpen) stroke1.setAttributeNS(null,"fill","none");
else stroke1.setAttributeNS(null,"fill",color);
stroke1.setAttributeNS(null,"stroke-width",(1.5*theGraph.curveWt).toString());
//stroke1.setAttributeNS(null,"clip-path","url(#rectClip)");
graphDoc.getElementById("dots").appendChild(stroke1);
return(document.getElementsByTagName("circle").length);
} // putDot



//***** Text writing routines
// example: putText(theGraph,"hello","font-size:8px;font-style: italic; fill: #AA00AA", 8, 0, 0, 0, 0, false)

function putText(theGraph, inStr, theStyle, theFontSize,  x1,y1, offsetX, offsetY, areScreenCoords, overrideBorders,bgColor,centering,isCoords) {
//alert(centering)
// centering is "left", "right" or omitted for cetnered
if (typeof centering =="undefined") var centering="center";

offsetY -=theFontSize*1.25
//if(testingFlag) alert(offsetY)
if (typeof bgColor =="undefined") bgColor="";

var ignoreBorders = false;
try	{
 	ignoreBorders = overrideBorders;
	}
catch (error)
	{
 	}

var usingScreenCoords = false;
try	{
 	usingScreenCoords = areScreenCoords;
	}
catch (error)
	{
 	}


var graphDoc = getDoc (theGraph);


//firs need to style the string to get the dimensions
var theHStr = '<span style="' + theStyle + '">'+inStr+'</span>';

var maxWdth=0;
graphDoc.getElementById("scratch").innerHTML= theHStr;
var totHt= graphDoc.getElementById("scratch").clientHeight;
graphDoc.getElementById("scratch").innerHTML = "";
graphDoc.getElementById("ruler").innerHTML = theHStr; // older ones with a span
var totWdth = graphDoc.getElementById("ruler").offsetWidth;
graphDoc.getElementById("ruler").innerHTML = "";
//alert(totWdth); // these are not the correct widths in pixels but seem scaled like the fonts
//if (SAFJS) totWdth =totWdth *.4;
var xv, yv;
//if(testingFlag) alert(yMin)
if (!usingScreenCoords ) {
	var xyv = screenCoords(theGraph, x1, y1);
	xv = xyv[0]; yv = xyv[1];
	} 
else {
	xv = x1; yv = y1;
	}
//if(testingFlag) alert("xv = " + xv + ", yv = " + yv);
//if (SAFJS) xv-=1;
if (centering=="center"){
	//xv-= (SAFJS)? Math.round(.25* totWdth) : Math.round(.5* totWdth);
	xv-= Math.round(.5* totWdth);
	}

else if (centering=="right")xv-=Math.round(totWdth);
//alert("xv = " + xv + ", yv = " + yv);

xv+= offsetX; yv-= totHt+offsetY;
// 2 pixels below away from margins
//
if (!ignoreBorders) {
	// adjust to not go off edge
	if (yv < 2) yv = 2; 
	if (x1 + totWdth/2 > theGraph.window[1]) xv -= (totWdth/2)+.1;
	if (x1 - totWdth/2 < theGraph.window[0]) xv += (totWdth/2)+.1;
	if (xv < 2) xv = 2;

	if (jsPuttingXLabels) {
		if (yv > theGraph.totHt - theGraph.xLabelMargin -15) yv = theGraph.totHt -theGraph.xLabelMargin -15;
		} // if putting labels

	} // if not ignoreBorders
//if(testingFlag) alert("xv = " + xv + ", yv = " + yv);
// now clear a rectangle and position each character
// theGraph.backgroundColor
//if(testingFlag) {xv=50;yv=50}
xv=Math.round(xv);yv=Math.round(yv)
if(bgColor !=""){
	var txtBG=graphDoc.createElementNS(svgNS,"rect");
	txtBG.setAttributeNS(null,"width",totWdth.toString());
	txtBG.setAttributeNS(null,"height",totHt.toString());
	txtBG.setAttributeNS(null,"x",xv.toString());
	txtBG.setAttributeNS(null,"y",(yv-totHt*.75).toString());
	txtBG.setAttributeNS(null,"fill", bgColor);
	// in above replace red by   theGraph.backgroundColor
	graphDoc.getElementById("gridGroup").appendChild(txtBG);
	}
var txtE=graphDoc.createElementNS(svgNS,"text");
//if(testingFlag) alert(theStyle);
txtE.setAttributeNS(null,"style",theStyle);
txtE.setAttributeNS(null,"x",xv.toString());
txtE.setAttributeNS(null,"y",yv.toString());
var filler=graphDoc.createTextNode(inStr);
txtE.appendChild(filler);
if(isCoords)graphDoc.getElementById("text").appendChild(txtE);
else graphDoc.getElementById("gridGroup").appendChild(txtE);
//if(testingFlag) alert("put one")
//alert(txtE.getBBox().width) // gives actual width & ht similar
} // putText


function getWidth(theStr,theStyle,theDoc) {
if(theStyle!="") theDoc.getElementById("ruler").style=theStyle;
theDoc.getElementById("ruler").innerHTML = theStr; // older ones with a span
var totWdth = theDoc.getElementById("ruler").offsetWidth;
theDoc.getElementById("ruler").innerHTML = "";
return totWdth
}

function getHeight(theStr,theStyle,theDoc) {
theDoc.getElementById("scratch").style=theStyle;
theDoc.getElementById("scratch").innerHTML= theStr; 
var totHt = theDoc.getElementById("scratch").clientHeight;
theDoc.getElementById("scratch").innerHTML = "";
return totHt
}


function removeChilddren(theDoc,theID) {
var cell = theDoc.getElementById(theID);
if ((cell != null)&&( cell.hasChildNodes() ))
{
    while ( cell.childNodes.length >= 1 )
    {
        cell.removeChild( cell.firstChild );       
    } 
}

} // removeChilddren



function showSVG(G){
	var grapherDiv=document.getElementById(G.id+'Div');
	//alert(grapherDiv.innerHTML)
	var theStr=grapherDiv.innerHTML;
//document.codeform.codeTxT.value=theStr;
// remove non-svg divs from the end
var theEnd=theStr.indexOf("</svg>");
theStr=theStr.substring(0,theEnd+6);
theStr = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' + '\n<!-- Created by Stefan Waner (http://www.wanermath.com/) -->' + theStr;
var theHt= grapherDiv.clientHeight;
var theWdth= grapherDiv.clientWidth;
//alert(theStr.search(/width=\"100\%\"/));
theStr = theStr.replace(/width=\"100\%\"/,'width="'+theWdth+'px"');
theStr = theStr.replace(/height=\"100\%\"/,'height="'+theHt+'px"');
//document.getElementById("codeformid").value=theStr;

var theHtml='<center><textarea name="codeTxT" rows="25" cols="60" id="codeformid" style="overflow:auto"></textarea></center>';
parent.openText(theHtml,"Paste into a .svg file","white", 500,400)
parent.Win_1.document.getElementById("codeformid").value=theStr;
}

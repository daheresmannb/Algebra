// ***************** COPYRIGHT (c) 2013 STEFAN WANER ******************
// *********************** ALL RIGHTS RESERVED ************************



//*** globals
var maxDenom = 1000;  // for fraction approximation
var tol = .000000001; // for 10 digit accuracy guaranteed cutoff for fractin approx not yet implemented
var e = 2.718281828459045;
var pi = 3.141592653589793;
var theColor = 0; // the color of a pixel
var x = 0;
var A = 0;
var tab = unescape( "%09" );	// these are now the appropriate strings;
var cr = unescape( "%0D" );	
var lf = unescape( "%0A" );
var uniMinus = unescape( "%u2212"); // unicode minus &minus
var usingSettings=false; // set to true in calc(4) and false in calc(2)

// alert( unescape( "%3C" ));
var symb = unescape( "%C5" );
var backSlash = unescape( "%5C" );
//var gteSymbol = unescape( "%B3" ); // made-up symbols
//var lteSymbol = unescape( "%B2" );
var gteSymbol = ">="; // made-up symbols
var lteSymbol = "<=";

var lte = unescape ("%u2264");	// actual symbol in IE
var gte = unescape ("%u2265");
var fractionMode = false;
var singular = false;
var unbounded = false;
var msFormat = false;
var maxRows = 15;
var maxCols = 30;
var numRows = 0;
var numCols = 0;
var numConstraints = 0;
var graphingOnly = false; 	// for pure graphing only
var maximization = true;		// this is a max problem
var objectiveName = "z";
var numVariables = 2;
var variableString = "";
var theTableau = new makeArray2 (1,1);
var theStringTableau = new makeArray2 (1,1); 	// to display steps in the computation
var TableauNumber = 1;				// the number of tableaus
var maxSteps = 15;					// maximum number of tableaux 
var numDecs = 6;					// default accuracy
var theVertexCount = 0;
var fractionMode = false;
var integerMode = false;
var showingVertices=false;
var legendLines=true; // showing lines inthe legend
var vArr=[]; // the vertices to show in the graph
var testingFlag=false; // set to tru for debugs
var verTbl = "" ; //legend of vertices for the graphing window
var lineTbl = ""; //legend of lines for the graphing window
var equationArr=[]; // will consist of the legend items for the lines
var lineColors=[]; // color of ith line
var rLineColors=["",]; // color or reg lines
var vLineColors=["",];// color or vertical lines
var colorCount=0;
var cCols=["red","palegreen","orange","darkviolet","yellow","lightskyblue","green","blue","olive","steelblue","indianred","purple","teal","magenta","cyan","lime","sienna","hotpink"]; // curvescolors for grapher

var MaxNumValues = 15; // maximum # of values of x
var dotColors=[,"blue","red","green","black","orange","lime","hotpink","darkviolet","yellow","sienna","lightskyblue","palegreen","grey","olive"];
var dotColorNames=[,addText("blue","azul"),addText("red","rojo"),addText("green","verde"),addText("black","negro"), addText("orange","naranja"),addText("lime","lima"),addText("pink","rosita"),addText("purple","p&#250;rpura"),addText("yellow","amarillo"), addText("brown","caf&#233;"), addText("light blue","azul claro"),addText("light green","verde claro"),addText("grey","gris"),addText("olive","verde oliva")];



var okToRoll = true;
var theString = "";
var a = 0;
var b = 0; // end points
var c = 0;
var d = 0;
var theFunction = ""; // the function

var exStr=[]
exStr[0] = "2x-y<=4\r2x+3y<=12\ry<=3\rx>=1";
exStr[1] = exStr[0] + "\ry<=2.5\ry>=1.5-x\ry<=1+x";
exStr[2] = "x>=1\ry<=2.5\ry>=1.5-x\ry<=1+x\ry>=0";
exStr[3] = "y<=3, x>=1, y<=2.5, y>=1.5-x, y<=1+x";
var excCycle=0, exL=exStr.length;


var theInstructionString = "Notes on formatting: " + cr + " (1) Variable names must be x and y." + cr + " (2) For fraction inputs, keep the variable on the right." + cr + tab + tab + "    (eg. (1/3)x and not x/3) " + cr + " (3) Both x and y must appear in the objective function," + cr+ "     (but not necessarily in the constraints). " + cr + tab + tab + "    (eg. p = 0x + 2y) " + cr + " (4) The words 'maximize' (or 'minimize') and 'subject to'  " + cr + "     must appear. " + cr + " (5) Each inequality should be on its own line, as shown. " + cr + " (6) No need to enter the default constraints: x >= 0, y >= 0.";


var theGInstructionString = "Notes on formatting: " + cr + " (1) Variable names must be x and y." + cr + " (2) For fraction inputs, keep the variable on the right." + cr + tab + tab + "    (eg. (1/3)x and not x/3) " + cr + " (3) Each inequality should be on its own line, as shown. ";

// Graphical Method Computation Globals
var vertexX = new Array(); // contains the vertices
var vertexY = new Array();
var vertexXBad=[], vertexYBad=[]
var linesThroughVertex1 = new Array(); // a string array showing the lines
var linesThroughVertex2 = new Array();
var valObjective = new Array(); // value of objective for the corresponding vertex
var solutionLocation = 1;
var equation = new Array(); // these are actually the inequaltieis
// Some temporary global variables for testing
// position of gridlines, and expressions for functions, with 
// all are required to be of the form y <= mx + b
// vertical lines in separate array;

var lines = new Array();
var ineq = new Array();  // 0 means y <=, 1 means y >=
var vlines = new Array(); // vertical lines
var vineq = new Array();  // 0 means x <=, 1 means x >=
var lineColor = 4; // blue
var xMin=0, xMax=10,yMin=0,yMax=10;
var xMMin=-1, xMMMax=11,yMin=-1,yMMax=11; // over window bounds for cropped shading
var circling=[]; // which dots are to be circled


lines[0] = 0; // number of inequalities; all understood to be y <= expression;
lines[1] = "0.5*x";
lines[2] = "2*x";
lines[3] = "20-x";
ineq[1] = 1; // 0 means y lte  1 means y gte
ineq[2] = 0;
ineq[3] = 0;
vlines[0] = 0; // number of vertical lines
vlines[1] = 10;
vlines[2] = -13;
vineq[1] = 0;
vineq[2] = 1;

var xAxisPosition = 50; // position of axes = -1 if not visible
var yAxisPosition = 100;
var xGridStep = 10;
var yGridStep = 10;


// *** end globals

function flipLegends() {
	legendLines=!legendLines;
	document.getElementById("routput").innerHTML=(legendLines)?lineTbl:verTbl;
}

// ********* algebra routines
// *** the poly object (polynomial object):
function poly(name,variables) {
// variables is an array of var names eg [x, y, z]fu
this.id=name;
this.varNames = variables; // so, varNames is the array of var names eg [x, y, z]
this.terms=[]; // each term has the form [coeff,exponent1, exponent2,...]
}

function parsePoly(inP,varNames,id) {
//alert(inP)
// assumes a given set of variables varNames
//alert(varNames)
inP=inP.replace(/\ /g,"");
var nV= varNames.length,chr,re,aterms=[];
//}

// reg exps for the varNames
var reVH=[],reVnH=[],reV=[];  //with no hat hats and just letter
for (var j=0;j<nV;j++){
	chr= varNames[j];
	reVH[j]=new RegExp("("+chr+")(\\^)");
	reVnH[j]=new RegExp("("+chr+")([^\\^])");
	reV[j]=new RegExp("("+chr+")");
	}
	// ***THE NEXT STEP IS THE ISSUE FOR NEG EXPONENTS IN BRACKETS
inP= inP.replace(/\+/g," ").replace(/([^\^\{])(\-)/g,"$1 -"); //one space sep terms
var s= inP.split(" ");
if (s[0]=="") s.splice(0,1);
var L=s.length,vStr=[],p=-1,pp=-1,n=0,st2='',ds='', arr=[];
// first do coeff then exponents for each term
for(var i=0;i<L;i++){
	aterms[i]=[];
	var mon=s[i], monL=mon.length;
	p=mon.search(/[a-zA-Z\u00bf-\uffff]/);

	if(p==0) aterms[i][0]=1;
	else if (p==-1) {
		//alert(mon)
		aterms[i][0]=myEval(mon);
	}
	else if ((p==1)&&(mon.charAt(0)=="-")) aterms[i][0]=-1;
	else {
		ds=mon.substring(0,p);
		if (ds.search(/[^0-9.\/\(\)]/)==-1) {
		    
		    aterms[i][0]=myEval(ds);
		}
		else {aterms[i][0]=myEval(ds);}
		}
	
	
	if (isNaN(aterms[i][0])) return false;
	// Fix 03 initialize aterms[i]
	for (var j=0;j<nV;j++) aterms[i][j+1]=0;
	// end of Fix 03
	for (var j=0;j<nV;j++){
		arr=getIndicesOf(varNames[j], mon, true)
		//alert(arr)
		
		// Begin Fix 03 code
		p=arr.length;
		if(p>0) {
			for (var k=0;k<p;k++) {
				if ((monL==arr[k])||(mon.charAt(arr[k]+1)!="^")) aterms[i][j+1]+=1;
				else {
					st2=mon.substring(arr[k]+1,monL);
					pp=st2.search(/[a-zA-Z\u00bf-\uffff]/);
					if(pp!=-1) st2=st2.substring(0,pp);
					n=myEval(st2.replace(/[^0-9.-]+/g,''));
					if (isNaN(n)) return false;
					else aterms[i][j+1]+=n;
				}
			}
		}
		// end Fix 03 code
		

		}
	}
var pOut=new poly(id,varNames);
pOut.terms=aterms;
return(pOut)

} // parsePoly


// the following condenses an array of poly terms
// adds like terms and removes zero terms
function sqzP(inp) {
var f=false;op=[inp[0]],L=inp.length,L2=1,k=inp[0].length,c=0;
if(L==1)return(inp);
for(var i=1;i<L;i++){
	f=false;
	s2=inp[i].slice(1,k+1);
	for(var j=0;j<L2;j++){
		if(op[j].slice(1,k+1).join(";")==s2.join(";")){
			f=true;
			op[j][0]+=inp[i][0];
			break;
			}
		}
		if(!f){op.push(inp[i]);L2+=1}
	}
// eliminate zero terms
for (var i=L2-1;i>-1;i--){
	if((op[i][0]==0)&&(op.length>1)) {op.splice(i,1)}
	}

return(op)
} //  

function pToFracF(p1){
	// returns a string polynomial (due to the fractions)
	var outS=formatP(p1).replace(/([0-9.]+)([xy])/g,function(m) {return toFracMon(m)})
	return(outS)
}

function pRound(p1){
	// returns a string polynomial (due to the fractions)
	var outS=formatP(p1).replace(/([0-9.]+)([xy])/g,function(m) {return roundMon(m)})
	return(outS)
}

function toFracMon(m) {
    var kS=m.replace(/[xy]/g,"");
    var k=(kS=="")? 1: parseFloat(kS);
    //alert(toFrac(k)+m.slice(-1))
    var fr=toFrac(k);
    var rfr=(fr=="1")? "":((fr=="-1")? "-":fr);
    return rfr+m.slice(-1);

}

function roundMon(m) {
    var kS=m.replace(/[xy]/g,"");
    var k=(kS=="")? 1: parseFloat(kS);
    var fr=roundDec(k,numDecs);
    var rfr=(fr=="1")? "":((fr=="-1")? "-":fr);
    return rfr+m.slice(-1);

}

function pSumF(p1,p2) {
// can only add polys with the same variables as of now
var f=false,k=p1.varNames.length,t1=p1.terms.slice(),t2=p2.terms.slice(),L2=t2.length;
if(L2>0){
	var L1=t1.length;
	for (var i=0;i<L2;i++){
		f=false;
		s2=t2[i].slice(1,k+1);
		for (var j=0;j<L1;j++){
			if(t1[j].slice(1,k+1).join(";")==s2.join(";")){
				f=true;
				t1[j][0]+=t2[i][0];
				break;
				}
			}
		if(!f)t1.push(t2[i]);
		}
	}
//eliminate zero terms
var L=t1.length-1;
for(var i=L;i>-1;i--){if(t1[i][0]==0) t1.splice(i,1)}
var pOut=new poly(p1.id+"+"+p2.id,p1.varNames);
pOut.terms=t1;
return(pOut)
} // pSumF


function union(a1,a2){
var L2=a2.length,f=false;
if(L2>0){
	var L1=a1.length;
	for (var i=0;i<L2;i++){
		f=false;
		for (var j=0;j<L1;j++){
			if(a1[j]==a2[i]){f=true;break}
			}
		if(!f)a1.push(a2[i]);
		}
	}
return(a1)
} // union

function pSum(s1,s2,toFr){
// Accepts string polys and add them
//alert("s1 = " + s1 + ", s2 = " + s2)
var v=getVars(s1,s2);
var p1=parsePoly(s1,v,"f");
var p2=parsePoly(s2,v,"g");
var s=pSumF(p1,p2);
if (toFr) return  pToFracF(s)
else return(formatP(s));
} // pSum

function pProd(s1,s2,toFr){
// Accepts string polys and add them
var v=getVars(s1,s2);
var p1=parsePoly(s1,v,"f");
var p2=parsePoly(s2,v,"g");
var s=pProdF(p1,p2);
if (toFr) return pToFracF(s)
else return(formatP(s));
}


function pDiff(s1,s2,toFr){
// Accepts string polys and subtract them
var v=getVars(s1,s2);
var p1=parsePoly(s1,v,"f");
var p2=parsePoly(s2,v,"g");
var m=parsePoly("-1",v,"h");
var q2=pProdF(m,p2)
var s=pSumF(p1,q2);
if (toFr) return pToFracF(s)
else return(formatP(s));
}

function orderTerms(p) {
    //reorders the terms if y happens to be first
    if ((p.terms.length==2)&&(p.terms[0][1]==0)) p.terms.reverse();
}

function formatP(p){
var str="",len=p.terms.length,nV=p.varNames.length;
var v=p.varNames.slice(),d='',ld=0;
for (var i=0;i<len;i++){
	d='';
	var c=p.terms[i][0];
	if (typeof c == "number")  c=roundSigDig(c,13);
	if(i>0)str+="+";
	if ((c!=0)&(c!="0")) {
		d+=c;
		for (var j=0;j<nV;j++){
			var t=p.terms[i][j+1];
			if(t==1)d+=v[j];
			else if(t!=0)d+=v[j]+"^"+t;		
			}
		}
ld=d.length;
if(d.search(/1[a-zA-Z\u00bf-\uffff]/)==0) d=d.substring(1,ld);
else if(d.search(/\-1[a-zA-Z\u00bf-\uffff]/)==0) d="-"+d.substring(2,ld);
str+=d;
	}
if(str=="")str="0";
str=str.replace(/\+\-/g,"-");

if (str.search(/[\u00bf-\uffff]/)>-1) {
//alert(str.replace(/[\u00bf-\uffff]/g,function(m) {return ("ln|"+m.charCodeAt(0) + "|")}))
	str=str.replace(/[\u0160-\uffff]/g,function(m) {return ("ln("+String.fromCharCode(m.charCodeAt(0)-280) + ")")})
	str=str.replace(/[\u00bf-\uffff]/g,function(m) {return ("ln|"+String.fromCharCode(m.charCodeAt(0)-220) + "|")})
	
	}
return(str)
}//formatP

// sorting and removing duplicate chars
function removeDupes(s) {
var a1=s.split('');
a1.sort();
s=a1.join('');
s=s.replace(/([a-zA-z\u00bf-\uffff])\1+/g,"$1");
return(s)
} // remmoveDupes

// testing for the presence of duplicate characters in a polynomial string
function checkDupes(inS) {
	var s=inS.replace(/\^\-/g,"").replace(/\-/g,"+"), a="";
	var a1=s.split('+'),L=a1.length;
	for (var i=0;i<L;i++){
		var k=a1[i].split('');
		k.sort();
		a=k.join('');
		//alert(a)
		//if (a.search(/(\w)\2+/)>-1) {return(true)}
		if (a.search(/([a-zA-Z\u00bf-\uffff])\1+/)>-1) {return(true)}
		//if(a.search(/[^\w\s]|(.)\1/)>-1) {return(true)}
	}
	return false
} // remmoveDupes

function aEval(inS){
// returns numerical value if there are no letters or known functions of numbers
if(!isNaN(inS)) return(eval(inS))
var str=inS.toString();
if (str.search(/[a-zA-Z]/)==-1){
	return(myEval(str));
	}
else return(str);
} // aEval

//alert(aEval("x-y"))

function getVars(in1,in2){
var st=in1+in2;
st=st.replace(/[^a-zA-Z\u00bf-\uffff]/g,'');
return(removeDupes(st).split(''));
}//getvars


function convertToStForm(inS){
	//alert(inS)
	// converts ax/b to a/bx

	
	// ax/b -> a/bx:
	inS=inS.replace(/([0-9.]+)([xy])(\/)([0-9.]+)/g,"$1/$4$2");
	// (ax)/b -> a/bx:
	inS=inS.replace(/(\()([0-9.]+)([xy])(\))(\/)([0-9.]+)/g,"$2/$6$3");
	
	// x/b -> 1/bx:
	inS=inS.replace(/([xy])(\/)([0-9.]+)/g,"1/$3$1");

	return inS
	
}

//alert("x/3 - (6y)/3  -> " + convertToStForm("x/3-6y/3"))

function simplifyInequality(inE){
    // convets an inequality into the form "ax + by <= or >= c with c >= 0
    // returns array;
    //[0]: the redone inequality
    //[1]: the terms array of the lhs poly object
    //[2] the inequality <= or >=
    //[3] the rhs
    inE=convertToStForm(inE)
    var lEq=false;
    if (inE.indexOf("<=")>-1) lEq=true;
    else if (inE.indexOf(">=")==-1) {
	okToRoll=false;
	myAlert(addText("The expression ","La expresi&#243;n") + inE + addText(" does not look like an inequality of the right type to me."," a mi no parece una desigualdad."))
    }
    var pr=(lEq)? inE.split("<="):inE.split(">=");
    // check if there are terms other than x and y
    pr[0]=pr[0].replace(/\ /g,"");
    pr[1]=pr[1].replace(/\ /g,"");
    var v=getVars(pr[0],pr[1]);

    if (v.length>2) {
	myAlert(addText("The expression '","La expresi&#243;n '") + inE.replace(/\</g,"LESSTHAN").replace(/\>/g,"GREATERTHAN") + addText("' seems to have more than two variables.","' parece tener m&#225;s que dos variables."));
	okToRoll=false;
    }
    else if (v.length==0) {
	myAlert(addText("The expression '","La expresi&#243;n '") + inE.replace(/\</g,"LESSTHAN").replace(/\>/g,"GREATERTHAN") + addText("' seems to have no variables.","' parece tener ningunas variables."));
	okToRoll=false;
    }
    else if ((v.join() != "x,y")&&(v.join() != "y,x")&&(v.join() != "x")&&(v.join() != "y")) {
	myAlert(addText("The expression '","La expresi&#243;n '") + inE.replace(/\</g,"LESSTHAN").replace(/\>/g,"GREATERTHAN") + addText("' seems to have variables other than x and y.","' parece tener variables distintas de x e y."));
	okToRoll=false;
    }
    
    if(!okToRoll) return(["no go",[],"",0]);
    var lhs=parsePoly(pr[0],["x","y"],"f");
    
    var rhs=parsePoly(pr[1],["x","y"],"f");
    // gather constant terms
    var outLhs=new poly("Left",["x","y"]);
    var T=[]; // will be the terms'
    var theRightK=0;
    for (var k=0;k<lhs.terms.length;k++) {
	if ((lhs.terms[k][1]==0)&&(lhs.terms[k][2]==0)) {

	    theRightK-=lhs.terms[k][0];
	}
	else T.push(lhs.terms[k]);
    }
    
    for (var k=0;k<rhs.terms.length;k++) {
	if ((rhs.terms[k][1]==0)&&(rhs.terms[k][2]==0)) {

	    theRightK+=rhs.terms[k][0];
	}
	else {
	    rhs.terms[k][0]=-rhs.terms[k][0];
	    T.push(rhs.terms[k]);
	}
    }
    outLhs.terms=sqzP(T).slice();
    orderTerms(outLhs);
    //alert(formatP(outLhs) + ((lEq)? "<=":">=") + ((fractionMode)? toFrac(theRightK):theRightK))
    //return formatP(outLhs) + ((lEq)? "<=":">=") + ((fractionMode)? toFrac(theRightK):theRightK);
    var outArr=[];
    outArr[0]=(fractionMode)? (pToFracF(outLhs) + ((lEq)? "<=":">=") + toFrac(theRightK)) : (pRound(outLhs) + ((lEq)? "<=":">=") + roundDec(theRightK,numDecs));
    
    
    formatP(outLhs) + ((lEq)? "<=":">=") + ((fractionMode)? toFrac(theRightK):theRightK);
    outArr[1]=outLhs.terms;
    outArr[2]=(lEq)? "<=":">=";
    outArr[3]=theRightK;
    return(outArr);

}


function myAlert(inString) {
var y=document.createElement('span');
y.innerHTML = inString;
alert(y.innerHTML.replace(/LESSTHAN/g,"<").replace(/GREATERTHAN/g,">"));
} // myAlert()

function addTextF(e,s){
	var y=document.createElement('span');
	y.innerHTML = (theLanguage=="en")?e:s;
	return(y.innerHTML)
}

function getIndicesOf(what, str, caseSensitive) {
    var startIndex = 0, searchStrLen = what.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        what = what.toLowerCase();
    }
    while ((index = str.indexOf(what,startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}


function putProduct(inStr) {
// puts products in every letter pair except known functions
inStr=inStr.replace(/\ /g,""); 
inStr=inStr.replace(/pi/g,"PI");
inStr=inStr.replace(/([a-z\)])([a-z\(])/g,"$1*$2");
inStr=inStr.replace(/([0-9.]+)([a-z\(])/g,"$1*$2");
inStr=inStr.replace(/([a-z\)])([a-z\(])/g,"$1*$2");
inStr=inStr.replace(/(\))([0-9.])/g,"$1*$2");
inStr=inStr.replace(/PI/g,"pi");
//alert(inStr)
return (inStr)
}

function simpleParse(expr){
// alert('here')
	var s = stripSpaces(expr);
// ln abs fix May 2 2012
	s=s.replace(/\-\-/g,"+");
	// now convert formatting from GC formatting		
	s = putProduct(s);
	s = s.toLowerCase();

	return(s);
} // myParse

function myEval(S){
var F=new Function("return("+simpleParse(S)+")");
return(F())
}
// ***** testing poly
function testing() {
// ***** testing convert to poly
var myPol=" 3x+y+4 <= 4x-y-1/4";
//alert(myPol + " -> " + simplifyInequality(myPol))
//alert(c)
//var t=getVars(myPol,"")
//var k = parsePoly(myPol,t,"f");
} // test
testing()



// ****************** ERROR HANDLER *************
function myErrorTrap(message,url,linenumber) {
alert("Whoops! I can't process this!" + cr +" Press 'Example' for formatting information.");
return (true);
} // end of on error
// ***********************************************

function makeArray2 (X,Y)
	{
	var count;
	this.length = X+1;
	for (var count = 1; count <= X+1; count++)
		// to allow starting at 1
		this[count] = new makeArray(Y);
	} // makeArray2

function makeArray (Y)
	{
	var count;
	this.length = Y+1;
	for (var count = 1; count <= Y+1; count++)
		this[count] = 0;
	} // makeArray


// ******* Graphing routine
// *** the following functions are required for the grapher

function myParse(expression)
{
		theString = stripSpaces(expression);		
		with (Math)
			{
		// now convert formatting from GC formatting		
		theString = putProduct(theString);
		theString = replaceSubstring(theString,"log","(1/log(10))*log");
		theString = replaceSubstring(theString,"ln","log");
			while (powCheck(theString))
				{
				theString = powFix2(theString);
				// alert (theString);
				}
		theString = replaceChar(theString,"X","x");
			} // with Math
	return(theString);
} // myParse



function makeGraph()
{
if(!okToRoll) return false;
// first decide on xMin etc
//alert(vertexY.slice(1))
//alert(graphingOnly)
if(!usingSettings){
  
  var minX=-5;
	var minY=-5;
	var maxX=5;
	var maxY=5;
    
  if ((theVertexCount==0)&&(vertexXBad.length==0)) {
    // have some parallel lines or the feasible region is emt and all the vertices are bad
    //just use he x-and y-intercepts of all the lines so create a set of x- and y-values
    var xInts=[0], yInts=[0];
    for (var i=1;i<=numRows-1;i++) {
      var aL = theTableau[i][1];
      var bL = theTableau[i][2];
      var pL = theTableau[i][numCols];
      if (Math.abs(aL)>.00000000001) xInts.push(pL/aL);
      if(Math.abs(bL)>.00000000001) yInts.push(pL/bL);
      if (xInts.length==1) xInts=[-5,0,5];
      if (yInts.length==1) yInts=[-5,0,5];
      minX=Math.min.apply(null, xInts);
      maxX=Math.max.apply(null, xInts);
      minY=Math.min.apply(null, yInts);
      maxY=Math.max.apply(null, yInts);
      } 
  } // no good or bad vertices
  
	else if(theVertexCount==1) {
		 minX=vertexX[1]-5;
		 minY=vertexY[1]-5;
		 maxX=vertexX[1]+5;
		 maxY=vertexY[1]+5;
	}
  
	else if(theVertexCount>0) {
			 minX=Math.min.apply(null, vertexX.slice(1,theVertexCount+1));
			 maxX=Math.max.apply(null, vertexX.slice(1,theVertexCount+1));
			 minY=Math.min.apply(null, vertexY.slice(1,theVertexCount+1));
			 maxY=Math.max.apply(null, vertexY.slice(1,theVertexCount+1));
		}
	else if (vertexXBad.length>0) {
			 minX=Math.min.apply(null, vertexXBad.slice(0));
			 maxX=Math.max.apply(null, vertexXBad.slice(0));
			 minY=Math.min.apply(null, vertexYBad.slice(0));
			 maxY=Math.max.apply(null, vertexYBad.slice(0));
		}

	var maxAbsX=Math.max(Math.abs(minX),Math.abs(maxX));
	var maxAbsY=Math.max(Math.abs(minY),Math.abs(maxY));
	var numZerosX=(maxAbsX<.00000000001)?0:Math.floor(Math.log(maxAbsX)/Math.log(11));
	var numZerosY=(maxAbsY<.00000000001)?0:Math.floor(Math.log(maxAbsY)/Math.log(11));
	// note that numZerosX may be -Infinity if maxAbsX is zero, hence the above
	//alert(numZerosY)
	    xMax=Math.ceil(Math.round(Math.pow(10,numZerosX)) + maxX);
	    yMax=Math.ceil(Math.round(Math.pow(10,numZerosY)) + maxY);
	if(graphingOnly) {
	    xMin=Math.floor(minX - Math.round(Math.pow(10,numZerosX)));
	    yMin=Math.floor(minY - Math.round(Math.pow(10,numZerosY)));
	//alert(yMin)
	}
	else {
		xMin=0;
		yMin=0;
		if(xMax<=0){xMax=1;numZerosX=0}
		if(yMax<=0){yMax=1;numZerosY=0}
	}
	
	// some instances with no vertices and only a line
	if (isNaN(xMin)||isNaN(xMax)) {
		xMin=(graphingOnly)?-5:0;
		xMax=5;
	}
	if (isNaN(yMin)||isNaN(yMax)) {
		yMin=(graphingOnly)?-5:0;
		yMax=5;
	}
	
	//alert([xMin,xMax,yMin,yMax])
	// some adjustments for nice grid steps
	var theXRange=roundSigDig((xMax-xMin)/Math.pow(10,numZerosX),6);
	var theYRange=roundSigDig((yMax-yMin)/Math.pow(10,numZerosY),6);
	
	//alert(theYRange)
	var theXDiv=10, theYDiv=10;
	if(theXRange%3==0) theXDiv=12;
	if(theYRange%3==0) theYDiv=12;
	if(theXRange%4==0) theXDiv=8;
	if(theYRange%4==0) theYDiv=8;
	if(theXRange%9==0) theXDiv=9;
	if(theYRange%9==0) theYDiv=9;
	if(theXRange%5==0) theXDiv=5;
	if(theYRange%5==0) theYDiv=5;
	if(10*theXRange%7==0) theXDiv=7;
	if(10*theYRange%7==0) theYDiv=7;
	if(theXRange%15==0) theXDiv=15;
	if(theYRange%15==0) theYDiv=15;
	if(theXRange%11==0) theXDiv=11;
	if(theYRange%11==0) theYDiv=11;
	if(theXRange%12==0) theXDiv=12;
	if(theYRange%12==0) theYDiv=12;
	if(theXRange%13==0) theXDiv=13;
	if(theYRange%13==0) theYDiv=13;
	
	
	
	grapher1.xGrid = "on";
	grapher1.yGrid = "on";
	grapher1.showScalex=true;
	grapher1.showScaley=true;
	
	xGridStep = roundSigDig((xMax-xMin)/theXDiv,6);
	yGridStep = roundSigDig((yMax-yMin)/theYDiv,6);
	// put those values in the grapher setup
	//var XMLWind=parent.document.getElementById('grapherframe').contentWindow;
	//var XMLDoc=parent.document.getElementById('grapherframe').contentWindow.document;
	document.getElementById("xMinVal").value=xMin;
	document.getElementById("xMaxVal").value=xMax;
	document.getElementById("yMinVal").value=yMin;
	document.getElementById("yMaxVal").value=yMax;
	document.getElementById("xGridVal").value=xGridStep;
	document.getElementById("yGridVal").value=yGridStep;
	// now talk to the grapher
	//var G=parent.document.getElementById('grapherframe').contentWindow['grapher1'];
	grapher1.window=[xMin,xMax,yMin,yMax];
	grapher1.xGridStep=xGridStep;
	grapher1.yGridStep=yGridStep;
} // if not usingSettings
else {
	grapher1.window=[xMin,xMax,yMin,yMax]; // set in calc(4)
	a=xMin;b=xMax;c=yMin;d=yMax; // redundancy of the code...
	//alert([a,b,c,d])
//alert(grapher1.window)
}

if (okToRoll) {
	// draw the lines & shaded regions
	grapher1.plottedCurves.length=0; // wipe them all out
	equationArr.length=0;
	xMMax=xMax+.1*(xMax-xMin), xMMin=xMin-.1*(xMax-xMin);
	yMMax=yMax+.1*(yMax-yMin), yMMin=yMin-.1*(yMax-yMin);
	//alert(lines)
	for (var k = 1; k <= lines[0]; k++) {
		var theThickness=2;
		//alert(lines[k])
		if((lines[k]=="0*x+"+yMin.toString())||(lines[k]=="0*x+"+yMax.toString())) theThickness=4;
		//exclude the axes when doing LP
		if((!graphingOnly)&&(yMin==0)&&(lines[k]=="0*x+0")&&(ineq[k]!=0)) {}
	    else {
		//alert(numDecs)
		grapher1.plottedCurves.push([lines[k],xMMin,xMMax,"","",[[xMMin,xMMax,"grey",.5,(ineq[k]==0)?yMMax:yMMin,rLineColors[k],1,theThickness]]]);
		//alert('<span style="color:' + grapher1.curvesColors[k] + ';position:relative;bottom:5px;font-weight:bold;font-size:20px">___ </span>' + lines[k])
		var formEq=(fractionMode)? (lines[k].replace(/\*/g,"").replace(/([0-9.]+)([xy])/g,function(m) {return toFracMon(m)})):(lines[k].replace(/\*/g,"").replace(/([0-9.]+)([xy])/g,function(m) {return roundMon(m)}));
		formEq=formEq.replace("0x+","").replace("+-"," - ").replace("+"," + ");
		equationArr.push ('<span style="color:' + rLineColors[k] + ';position:relative;bottom:6px;font-weight:bold;font-size:30px;line-height:5px;">___ </span>' + formatChars('y = ' + formEq))
	    }
	    //[xStart,xEnd,shade color, chade opacity, shade-to, shade border color, shade border opacity, shade border thickness]
	    
	}
	//var setUpGrapher=XMLWind['setUpGraph'];
	//var plotCurves=XMLWind['plotAllCurves'];
	
	var graphDoc = getDoc (grapher1);
	removeChilddren(graphDoc,"curves");
	removeChilddren(graphDoc,"dots");
	removeChilddren(graphDoc,"polygons")
	removeChilddren(graphDoc,"lines");
	removeChilddren(graphDoc,"text");
	
	setUpGraph(grapher1);
	plotAllCurves(grapher1);
	var L=grapher1.plottedCurves.length;
	//[string, xMin, xMax,"dot/circle/arrow","dot/circle/arrow", [shade (t/f), color, opacity, shade-to-curve], [detltaLeftArrow, deltaRightArrow]
	for (var k = 1; k <= vlines[0]; k++) {
		//alert(grapher1.curvesColors[L+k])
		if((!graphingOnly)&&(xMin==0)&&(vlines[k]=="0")&&(vineq[k]!=0)) {}
		else {
			drawVLine(grapher1,vlines[k],(vineq[k]==0),"grey",.5,vLineColors[k],1);
			var xV=(fractionMode)?toFrac(vlines[k]):roundDec(vlines[k],numDecs);
			equationArr.push ('<span style="color:' + vLineColors[k] + ';position:relative;bottom:6px;font-weight:bold;font-size:30px;line-height:5px;">__ </span>' + formatChars('x = ' + xV))
			
		}
//alert(vlines[k] + " ' " + vineq[k]);
		} // k
    }
// now put up the colored dots
for (var i=1;i<=theVertexCount;i++){
	if(circling[i]) putDot(grapher1,vertexX[i],vertexY[i],dotColors[i],true,10);
	putDot(grapher1,vertexX[i],vertexY[i],dotColors[i],false,5);
	
}


// put the vertices on the graph;

if(showingVertices) {
	testingFlag=true;
	var v=vArr.length;
	for (var i=1;i<v;i++) {
		var centering="center",offsetX=0,offsetY=-5
		if(roundDec(vertexX[i]-grapher1.window[0],5)==0) {centering="left";offsetX+=3}
		if(roundDec(vertexY[i]-grapher1.window[2],5)==0) {offsetY+=25}
		
		putText(grapher1,vArr[i],"",14,vertexX[i],vertexY[i],offsetX,offsetY,false,true,"",centering,true)
		//putText(theGraph, inStr, theStyle, theFontSize,  x1,y1, offsetX, offsetY, areScreenCoords, overrideBorders,bgColor,centering)
	}
}

// now get the equation widths for the graping window
var equationWidths=[];
var numEqns=lines[0];
//alert(equationArr)
for (var i=1;i<numEqns;i++) {

	equationWidths[i]= 4+getW(equationArr[i])
	//alert(equationArr[i])
}


var maxEW=Math.max.apply(null, equationWidths.slice(1));
var numKeyLineCols=Math.max(1,Math.floor(boxWidths/(maxEW+20))); // at least one column!!!
var numLines = equationArr.length;
//alert(numLines)
lineTbl="";
lineTbl="<center><table><tr>";
for (var i=0;i<numLines;i++) {
	lineTbl+="<td  style='text-align:left; white-space:nowrap;padding-left: 3px; width:" + maxEW + "px'>" + equationArr[i] + "</td>";
	if(((i+1)%numKeyLineCols==0)&&(i+1<numLines)) lineTbl+="</tr><tr>";
}
lineTbl+="</tr></table></center>";
//alert(lineTbl)
if(showingVertices) {legendLines=true;  document.getElementById("routput").innerHTML=lineTbl}

} // makeGraph

// *********end of graphing routines


// ********* utilities
function stripChar (InString,symbol)  {
	OutString="";
	for (Count=0; Count < InString.length; Count++)  {
		TempChar=InString.substring (Count, Count+1);
		if (TempChar!=symbol)
			OutString=OutString+TempChar;
	}
	return (OutString);
}

function lastChar(theString) {
if (theString == "") return(theString);
var len = theString.length;
return theString.charAt(len-1); 
}



function rightString (InString, num)  {
	OutString=InString.substring (InString.length-num, InString.length);
	return (OutString);
}

function rightTrim (InString)  {
	var length = InString.length;
	OutString=InString.substring(0,length-1);
	return (OutString);
}

function replaceChar (InString,oldSymbol,newSymbol)  {
	var OutString="";
	var TempChar = "";
	for (Count=0; Count < InString.length; Count++)  {
		TempChar=InString.substring (Count, Count+1);
		if (TempChar!=oldSymbol)
			OutString=OutString+TempChar
		else OutString=OutString+newSymbol;
	}
	return (OutString);
}

function replaceSubstring (InString,oldSubstring,newSubstring)  {
	OutString="";
	var sublength = oldSubstring.length;
	for (Count=0; Count < InString.length; Count++)  {
		TempStr=InString.substring (Count, Count+sublength);
		TempChar=InString.substring (Count, Count+1);
		if (TempStr!= oldSubstring)
			OutString=OutString+TempChar
		else 
			{
			OutString=OutString+ newSubstring;
			Count +=sublength-1
			}

	}
	return (OutString);
}

// ************GRAPHICAL METHOD SOLVER ***************
function solveGraphical() {
// This uses the formatted first tableau theTableau-- a global 
// array of type makeArray2 (numRows,numCols) and extracts the
// requisite information to find the vertices.
// the output lives in several regular global arrays: 
// 1. vertexX, vertexY -- contains the vertices
// 2. linesThroughVertex -- a string array showing the lines in the same format as entered
//     by the user
// 3. valObjective -- contains the value of objective for the corresponding vertex
// 
// There is another global called solutionLocation saying which one has the optimal solution
theVertexCount = 0;
vertexX.length=0;
vertexY.length=0;
vertexXBad.length=0;
vertexYBad.length=0;
var skipThis = false; // for repeated vertices
var a1 = 0, b1 = 0, c1 = 0, d1 = 0, det = 0, p1 = 0, q1 = 0, x1 = 0, y1 = 0, coeff = 0;
var feasible = true;
for (var i = 1; i <= numRows-1; i++)
	{
	for (var j = i+1; j <= numRows-1; j++)
		{
		feasible = false;
		a1 = theTableau[i][1];
		b1 = theTableau[i][2];
		p1 = theTableau[i][numCols];
		c1 = theTableau[j][1];
		d1 = theTableau[j][2];
		q1 = theTableau[j][numCols];
		det = a1*d1-b1*c1
		if (det != 0)
			{
			x1 = (d1*p1-b1*q1)/det;
			y1 = (-c1*p1+a1*q1)/det;
// alert("matrix is:" + cr + a1 + " " + b1 + " " + p1  + cr  + c1 + " " + d1 + " " + q1 );
// alert(" x1 = " + x1 + "y1 = "+ y1);
			// test feasibility
			feasible = true;
			for (var k = 1; k <= numRows-1; k++)
				{
				coeff = theTableau[k][2+k];
				if (  ( ( coeff > 0) && (roundSigDig(theTableau[k][1]*x1 + theTableau[k][2]*y1,10) - roundSigDig(theTableau[k][numCols],10) > 0 ))  ||  ((coeff < 0) && (roundSigDig(theTableau[k][1]*x1 + theTableau[k][2]*y1, 10) - roundSigDig(theTableau[k][numCols],10) < 0))  )
					{
					feasible = false;
					// put on list of unfeasible vertices (in case graphing an empty regio)
					vertexXBad.push(x1),vertexYBad.push(y1)
// alert(roundSigDig(theTableau[k][1]*x1 + theTableau[k][2]*y1,10) - roundSigDig(theTableau[k][numCols],10) );
					k = numRows-1;
					}
				} // k
			} // if det
		if (feasible)
			{
			// check that it is not already on the list
			skipThis = false;
// alert(" x1 = " + x1 + "y1 = "+ y1);
			for (var h = 1; h <= theVertexCount; h++)
				{
				if ( ( vertexX[h] == x1) && ( vertexY[h] == y1) ) skipThis = true;
				} // h
			if (!skipThis)
				{
				theVertexCount++;
				vertexX[theVertexCount] = x1;
				vertexY[theVertexCount] = y1;
				var str = equation[i].replace(/\<\=/g," = ").replace(/\>\=/g,"=");
				linesThroughVertex1[theVertexCount]  = str;
				str = equation[j].replace(/\<\=/g," = ").replace(/\>\=/g,"=");
				linesThroughVertex2[theVertexCount]  = str;
				if (maximization) valObjective[theVertexCount] = -theTableau[numRows][1]*x1- theTableau[numRows][2]*y1;
				else valObjective[theVertexCount] = theTableau[numRows][1]*x1+theTableau[numRows][2]*y1;
				} // if not skip this
			}
		} // j
// alert ("HERE");
	} // i

// now check for unboundedness by adding new constraint lines outside all the vertices.
// but only if not graphing only
if(!graphingOnly) {
	var maxXcoord = 0;
	var maxYcoord = 0;
	for (var i = 1; i <= theVertexCount; i++)
		{
		if (vertexX[i] > maxXcoord) maxXcoord = vertexX[i];
		if (vertexY[i] > maxYcoord) maxYcoord = vertexY[i];
		} // i
	maxXcoord += 100;
	maxYcoord += 100;
	// now solve to get new vertices
	unbounded = false;
	var theExtraVertexCount = 0;
	for (var i = 1; i <= numRows-1; i++)
		{
		for (var k = 1; k <= 3; k++)
			{
			if (k == 1)
				{
				a1 = theTableau[i][1];
				b1 = theTableau[i][2];
				p1 = theTableau[i][numCols];
				c1 = 1;
				d1 = 0;
				q1 = maxXcoord;
				}
			else if (k == 2)
				{
				a1 = theTableau[i][1];
				b1 = theTableau[i][2];
				p1 = theTableau[i][numCols];
				c1 = 0;
				d1 = 1;
				q1 = maxYcoord;
				}
			else if (k == 3)
				{ 
				a1 = 1;
				b1 = 0;
				p1 = maxXcoord
				c1 = 0;
				d1 = 1; 
				q1 = maxYcoord;
				i = numRows; // to force end of loop here
				} 
			det = a1*d1-b1*c1
			if (det != 0)
				{
				x1 = (d1*p1-b1*q1)/det;
				y1 = (-c1*p1+a1*q1)/det;
	// alert("matrix is:" + cr + a1 + " " + b1 + " " + p1  + cr  + c1 + " " + d1 + " " + q1 );
	// alert(" x1 = " + x1 + "y1 = "+ y1);
				// test feasibility
				feasible = true;
				for (var k = 1; k <= numRows-1; k++)
					{
					coeff = theTableau[k][2+k];
					if (  ( ( coeff > 0) && (theTableau[k][1]*x1 + theTableau[k][2]*y1 > theTableau[k][numCols]) )  ||  ((coeff < 0) && (theTableau[k][1]*x1 + theTableau[k][2]*y1 < theTableau[k][numCols]))  )
						{
						feasible = false;
	// alert(theTableau[k][1] + " x1  +  " + theTableau[k][2] + "y1");
						k = numRows-1;
						}
					} // k
				} // if det
			if (feasible)
				{
				unbounded = true;
				// check that it is not already on the list -- not actually necesary
				skipThis = false;
	// alert(" x1 = " + x1 + "y1 = "+ y1);
				if (!skipThis)
					{
					theExtraVertexCount ++;
					vertexX[theVertexCount + theExtraVertexCount] = x1;
					vertexY[theVertexCount + theExtraVertexCount] = y1;
					if (maximization) valObjective[theVertexCount + theExtraVertexCount] = -theTableau[numRows][1]*x1- theTableau[numRows][2]*y1;
					else valObjective[theVertexCount + theExtraVertexCount] = theTableau[numRows][1]*x1+theTableau[numRows][2]*y1;
					} // if not skip this
				}
		} // k
	// alert ("HERE");
		} // i
} // if not graphing only

// now present results in the output divs.
// first calculate the max/min:
if (!graphingOnly) {
	var optimalString = "";
	solutionLocation = 1;
	if (maximization)
	{
	optimalString = addText("Maximum","M&#225;ximo")
	var maxVal = valObjective[1];
	for (var i = 2; i <= theVertexCount + theExtraVertexCount; i++)
		{
		if (valObjective[i] > maxVal)  
			{
			maxVal = valObjective[i];
			solutionLocation = i
			}
		
		} // i
	} // if maximizing
else
	{
	optimalString = addText("Minimum","M&#237;mino")
	var minVal = valObjective[1];
	for (var i = 2; i <= theVertexCount + theExtraVertexCount; i++)
		{
		if (valObjective[i] < minVal)  
			{
			minVal = valObjective[i];
			solutionLocation = i
			}
		
		} // i
	}
} // if not graphing only
	
var dStr = '<table border="1" style="width:400px;border-collapse:collapse;padding:0px;borderColor:#009933"><tr><td style="text-align:center"><b>' + addText('Vertex','V&#233;rtice')+'</b></td>';
dStr+='<td style="text-align:center"><b>' + addText('Lines through vertex','Rectas tras v&#233;rtice')+'</b></td>';
dStr+=(graphingOnly)?'</tr>':'<td style="text-align:center"><b>' + addText('Value of objective','Valor del objetivo')+'</b></td></tr>';
var optStr=" <span style='color:#009933'>" + optimalString +"</span>";
var vertexArr=[], vertexWidths=[0],cStr='', gcStr=''; // for getting widths in the graphing window display
for (var i = 1; i <= theVertexCount; i++) {
	var theDot='<span style="font-size:18px;color:'+dotColors[i]+'">&#9679;</span>'
    dStr+="<tr>"
	if (fractionMode)
		{		
		dStr+="<td  style='white-space:nowrap;padding-left: 3px'>"+theDot + " ";
		cStr="(" + toFrac(roundSigDig(vertexX[i],15) , maxDenom, tol);
		cStr+= ", " + toFrac(roundSigDig(vertexY[i],15) , maxDenom, tol) + ")";
		dStr+=cStr;
		dStr+="</td>";
		} // fraction mode
	else
		{
		dStr+="<td  style='white-space:nowrap;padding-left: 3px'>"+theDot+ " ";
		cStr="(" + roundDec(vertexX[i],numDecs) + ", " + roundDec(vertexY[i], numDecs) + ")"
		dStr+=cStr;
		dStr+="</td>";
		} // not fraction mode
	dStr+="<td  style='white-space:nowrap;padding-left: 3px'>" + formatChars(linesThroughVertex1[i]) + "<br />" + formatChars(linesThroughVertex2[i]) + "</td>";
	circling[i]=false;
	gcStr=cStr; // coordinates only no comments
	if(!graphingOnly) {
		if (fractionMode)
			{
			dStr+="<td  style='white-space:nowrap;padding-left: 3px'>" + toFrac(roundSigDig(valObjective[i],15) , maxDenom, tol);

			} // fraction mode
		else
			{ 
			dStr += "<td  style='white-space:nowrap;padding-left: 3px'>" + roundDec(valObjective[i],numDecs);
			} // not fraction mode
		
		if (valObjective[i] == valObjective[solutionLocation]) {
			dStr += optStr;
			cStr += optStr;
			circling[i]=true; // for later when graphing
			
		}
		dStr+="</td>"
	} // if not graphingOnly
	dStr+="</tr>"
	vertexArr[i]=[theDot + " " + cStr];
	vArr[i]=gcStr; // used in the graph vArr is global
	vertexWidths[i] = 4 + getW(vertexArr[i]);
	} // i
	
if (theVertexCount > 0) 
	{
	if ((!graphingOnly)&&(solutionLocation > theVertexCount)) dStr += '<tr><td colspan="3" style="text-align:center;color:indianred">'+addText("***Unbounded feasible region -- No optimal solution ***","***Regi&#243;n viable no atada -- No hay una soluci&#243;n &#243;ptima***")+'</td></tr>';
	}
else {
	if(graphingOnly) dStr += '<tr><td colspan="3" style="text-align:center;color:indianred">'+addText("***No vertices***","***No hay v&#233;rtices***")+'</td></tr>';
	else dStr += '<tr><td colspan="3" style="text-align:center;color:indianred">'+addText("***Empty feasible region -- No optimal solution***","***Regi&#243;n viable vac&#237;a -- No hay una soluci&#243;n &#243;ptima***")+'</td></tr>';
}
dStr+="</table>"
//alert(dStr)
document.getElementById("output").innerHTML = dStr;


// now prepare the legends and show the vertex legend if not showing vertices and lines otherwise

//alert(vertexArr);
var maxVW=Math.max.apply(null, vertexWidths.slice(1));
//alert(maxVW)
var numKeyCols=Math.max(1,Math.floor(boxWidths/(maxVW+20))); // at least one column!!!
var numKeyRows=Math.ceil(theVertexCount/numKeyCols);
verTbl="<center><table><tr>";
for (var i=1;i<=theVertexCount;i++) {
	verTbl+="<td  style='text-align:left; white-space:nowrap;padding-left: 3px; width:" + maxVW + "px'>" + vertexArr[i] + "</td>";
	if(((i)%numKeyCols==0)&&(i<theVertexCount)) verTbl+="</tr><tr>";
}
verTbl+="</tr></table></center>";

// the corresponding table of lines needs to be done a lot later

//alert(verTbl)



if (!showingVertices) {legendLines=false; document.getElementById("routput").innerHTML=verTbl}
//else document.getElementById("routput").innerHTML=lineTbl;




} // end of solveGraphical


// *************END GRAPHICAL METHOD SOLVER **********

// ******************** FORM UTILITIES ******************



// ******************* LP PARSER FOLLOWS  **************************
function setupTableau() {
// reads problem and sets up the first tableau

// get out of here if not ok
if (!okToRoll) return (666);

// first, adjust some globals...
singular = false;	
lines[0] = 0;
vlines[0] = 0;
maximization=document.getElementById("R10").checked;
graphingOnly=document.getElementById("R12").checked;

			// start with a clean slate

var theString = document.getElementById("input").value;
if(stripSpaces(theString)=="") {
	okToRoll=false;
	myAlert(addText("You have not entered any constraints","No has ingresado ningunas restricciones"));
	return(false)
}

theString = theString.toLowerCase();
theString = replaceChar(theString, uniMinus,"-");	// &minus -> ordinary minus
		// want an extrta cr at the end
theString = stripSpaces(theString);
// else alert("*"+lastChar(theString)+"*");
theString = theString.replace(/\u2264/g,lteSymbol);
theString = theString.replace(/\u2265/g,gteSymbol);
theString = theString.replace(/lte/g,lteSymbol);
theString = theString.replace(/gte/g,gteSymbol);
theString = theString.replace(/mpe/g,lteSymbol); // spanish android?
theString = theString.replace(/mge/g,gteSymbol);
//theString = replaceSubstring(theString, ">=", gteSymbol);
//theString = replaceSubstring(theString, lte, lteSymbol);
//theString = replaceSubstring(theString, gte, gteSymbol);


theString += cr;
theString = stripChar(theString,tab);			// get rid of tabs

theString = replaceChar(theString,lf,cr);	// replace line feeds by carriage returns
							// some browsers addd these to cr

// debug begins
// var theDS = '';
//var L = theString.length;
// theDS += "String Length = " + L + cr;
//for (var i = 0; i <= L; i++) {
// theDS += "*" + escape(theString.charAt(L-16)) + "*";
// } // end loop
// document.theForm.output.value += theDS;
// end debug


// now parse commas into line breaks and introduce a line break after "subject to"
theString = replaceSubstring(theString, "to", "to"+cr);
theString = replaceSubstring(theString, ",", cr);
theString = replaceSubstring(theString, cr+"subject", "subject"); // in case they have instrodued a line break or comma before 'subject to'

// now get rid of double carriage returns
var doublecr = true;
while (doublecr) 
	{
	if (theString.indexOf(cr+cr) == -1) doublecr = false;
	else theString = replaceSubstring(theString,cr+cr,cr);
	}
// get rid of terminating cr
if (lastChar(theString) == cr) theString = rightTrim(theString,1);


var theLines=(theString.replace(/\x0D/g,",")).split(","); // replace crs by semicolons'
//alert(theLines)
// insert x>=0 andy >> 0 if not already there


if ((theLines[0].indexOf("maxi")>-1) || (theLines[0].indexOf("mini")>-1) || (theLines[0].indexOf("graph")>-1) || (theLines[0].indexOf("dibujar")>-1)) {
    // manual entry mode - eg pasted from book
    maximization=(theLines[0].indexOf("maxi")>-1);
    graphingOnly=(theLines[0].indexOf("graph")>-1);
    if (!graphingOnly) {
	var line1 = theLines[0];
	// get rid of "subject to, if there"
	check = line1.indexOf("subj");
	if (check > -1) line1 = line1.substring(0,check);
	// now look for objective
	check = line1.indexOf("=");
	if (check <=0) return(666);
	objectiveName = line1.charAt(check-1);
	//alert(objectiveName)
	len = line1.length;
	var expression = line1.substring(check+1,len);
	//alert(expression);
	var OBJ=parsePoly(expression,["x","y"],"z");
	orderTerms(OBJ);
	// from now on igmore theLines[0]
	} // if not graphingOnly
    theLines.shift(); // remove zeroth line
}
else if (!graphingOnly) {
    // check that the entered objective fn in the box is ok and then parse it instead
    var eObj=document.getElementById("objbox").value;
    if (stripSpaces(eObj)=="") {
	myAlert(addText("You have not entered the objective function z","No has ingresado la funci&#250;n objectiva z"));
	okToRoll=false;
	return false;
    }
    var vv=getVars(eObj,"");
    if (vv.length>2) {
	myAlert(addText("The expression '","La expresi&#243;n '") + eObj.replace(/\</g,"LESSTHAN").replace(/\>/g,"GREATERTHAN") + addText("' for z seems to have more than two variables.","' para z parece tener m&#225;s que dos variables."));
	okToRoll=false;
    }
    else if (vv.length==0) {
	myAlert(addText("The expression '","La expresi&#243;n '") + eObj.replace(/\</g,"LESSTHAN").replace(/\>/g,"GREATERTHAN") + addText("' for z seems to have no variables.","' para z parece tener ningunas variables."));
	okToRoll=false;
    }
    else if ((vv.join() != "x,y")&&(vv.join() != "y,x")&&(vv.join() != "x")&&(vv.join() != "y")) {
	myAlert(addText("The expression '","La expresi&#243;n '") + eObj.replace(/\</g,"LESSTHAN").replace(/\>/g,"GREATERTHAN") + addText("' for z seems to have variables other than x and y.","' para z parece tener variables distintas de x e y."));
	okToRoll=false;
    }
    if(!okToRoll) return false;
    var OBJ=parsePoly(document.getElementById("objbox").value,["x","y"],"z");
    orderTerms(OBJ);
    //alert(OBJ.terms)
}

if(!graphingOnly) {
    var hasX=false, hasY=false;
    for (var i=0;i<theLines.length;i++) {
	if(theLines[i]=="x"+gteSymbol+"0") hasX=true;
	if(theLines[i]=="y"+gteSymbol+"0") hasY=true;
    }
    if(!hasX)theLines.push("x"+gteSymbol+"0");
    if(!hasY)theLines.push("y"+gteSymbol+"0");
}
//alert(theLines)

numConstraints = theLines.length;

// now do something for the graphical mnethod
for (var i = 1; i <= numConstraints; i++) equation[i] = theLines[i-1];
numRows = numConstraints+1;
numCols = numRows + numVariables + 1;


// create the tableau

theTableau = new makeArray2 (numRows,numCols);
theStringTableau = new makeArray2 (numRows,numCols); // for display purposes

// do the last row
if (!graphingOnly) {
	for (var j = 1; j <= numCols; j++) theTableau[numRows][j] = 0; // init
	for (var i = 1; i <= numVariables; i++)
		{
		   if(OBJ.terms.length==1) {
		    //alert(OBJ.terms[0][0] + "," + maximization)
			//one of the coefficients is zero so only one term
			if(OBJ.terms[0][1]==1) theTableau[numRows][i] = (i==1)? ((maximization)? -OBJ.terms[0][0]:OBJ.terms[0][0]):0;
			else theTableau[numRows][i] = (i==2)? ((maximization)? -OBJ.terms[0][0]:OBJ.terms[0][0]):0;
		    }
		else {
		    // may have to switch x and y terms if in reverse order
		    if (maximization) theTableau[numRows][i] = -OBJ.terms[i-1][0];
		    else theTableau[numRows][i] = OBJ.terms[i-1][0];
		}
		}
	theTableau[numRows][numCols-1] = 1;
	theTableau[numRows][numCols] = 0;
	} // if not graphingOnly

// now extract the constraints
for (var i = 1; i <= numConstraints; i++)
	{
	//alert(equation[i])
	var iArr=simplifyInequality(equation[i]);
	equation[i]=iArr[0]; // replace the constraint by the simplified one
	if(iArr=="no go") {
	    okToRoll=false;
	    myAlert(addText("Huh? The expression '" + equation[i].replace(/\</g,"LESSTHAN").replace(/\>/g,"GREATERTHAN") + "' does not look like a linear inequality to me!","&iquest;Qu&#233;? La expressi&#243;n '" + equation[i] + "' a m&#237; no parece una desigualdad lineal!"))
	    return false
	    }
	for (var j = 1; j <= numCols; j++) theTableau[i][j] = 0;	// init
	theTableau[i][numCols] = iArr[3]; 		// the right-hand side
	var GTE=(iArr[2]==">=")
	if (GTE) theTableau[i][numVariables + i] = -1;
	else theTableau[i][numVariables + i] = 1;
	var theIndex = 0;
	for (var j = 1; j <= numVariables; j++)
		{
		    if(iArr[1].length==1) {
			//one of the coefficients is zero so only one term
			if(iArr[1][0][1]==1) theTableau[i][j] = (j==1)? iArr[1][0][0]:0;
			else theTableau[i][j] = (j==2)? iArr[1][0][0]:0;
		    }
		else theTableau[i][j] = iArr[1][j-1][0]; 
		} // j
// alert(theTableau[i][1] + ", " +  theTableau[i][2] + ", " + theTableau[i][3] + ", " +  theTableau[i][4]);
// now set up the expressions for the graphical method	
// check if a zero y coefficient

	if (theTableau[i][2] != 0)
		{
		// a normal equation
		lines[0]++; // add a new one to graph
    lineColors[i]=grapher1.curvesColors[colorCount];
    rLineColors.push(lineColors[i]);
    grapher1.curvesColors[lines[0]-1]=lineColors[i]; // only for non-vertical lines()
		colorCount++;
		if (colorCount==grapher1.curvesColors.length) colorCount=0;
    
		var theRatio1 = -theTableau[i][1] /theTableau[i][2];
		var theRatio2 = theTableau[i][numCols] /theTableau[i][2];
		if(fractionMode) {
			theRatio1=toFrac(theRatio1);
			theRatio2=toFrac(theRatio2)
		}
		else {
			
		}
		if (theTableau[i][2] >= 0) lines[lines[0]] = theRatio1.toString() + "*x" + "+"+ theRatio2.toString();
		else
			{
			 lines[lines[0]] = theRatio1.toString() + "*x" + "+" +  theRatio2.toString();
			if (GTE) GTE = false;
			else GTE = true;
			}
		if (GTE) ineq[lines[0]] = 1;
		else ineq[lines[0]] = 0;
		} // if non-zero y coefficient
	else
		{
		// vertical line
		vlines[0]++;
    lineColors[i]=grapher1.curvesColors[colorCount];
    vLineColors.push(lineColors[i]);
		colorCount++;
		if (colorCount==grapher1.curvesColors.length) colorCount=0;
    
		var theRatio = theTableau[i][numCols] /theTableau[i][1];
    if (theTableau[i][1]<0) GTE=!GTE;
		vlines[vlines[0]] = theRatio.toString();
		if (GTE) vineq[vlines[0]] = 1;
		else vineq[vlines[0]] = 0;
		}	
	// alert(lines[lines[0]]);
	} // enf of the loop i
	
	
// *** testing starts *******HERE ** display of tableau
// var display = "\r";
// for (var i = 1; i <= numRows; i++)
//	{
//	for (j = 1; j <= numCols; j++)
//		{
//		display += theTableau[i][j]  + tab;
//		} // j
//	display += "\n";
//	} // i
// alert(display);
// *** testing *******

} // end of setupTableau()

//alert("HERE")



function shiftRight(theNumber, k) {
	if (k == 0) return (theNumber)
	else
		{
		var k2 = 1;
		var num = k;
		if (num < 0) num = -num;
		for (var i = 1; i <= num; i++)
			{
			k2 = k2*10
			}
		}
	if (k>0) 
		{return(k2*theNumber)}
	else 
		{return(theNumber/k2)}
	}

function roundDec(theNumber, numPlaces) {
with (Math)
	{
	var x =shiftRight(round(shiftRight(theNumber,numPlaces)),-numPlaces);
	return x;
	} // with math
} // roundDec

function roundSigDig(theNumber, numDigits) {
	with (Math)
		{
		if (theNumber == 0) return(0);
		else if(abs(theNumber) < 0.000000000001) return(0);
// WARNING: ignores numbers less than 10^(-12)
		else
			{
			var k = floor(log(abs(theNumber))/log(10))-numDigits
			var k2 = shiftRight(round(shiftRight(abs(theNumber),-k)),k)
			if (theNumber > 0) return(k2);
			else return(-k2)
			} // end else
		}
	}

function stripSpaces (InString)  {
	return(InString.replace(/\ /g,""));
	}

function replaceChar (InString,oldSymbol,newSymbol)  {
	var OutString="";
	var TempChar = "";
	for (Count=0; Count < InString.length; Count++)  {
		TempChar=InString.substring (Count, Count+1);
		if (TempChar!=oldSymbol) OutString=OutString+TempChar;
// else if (TempChar == unescape("%OA")) alert ("Found a line feed");
		else OutString=OutString+newSymbol;
	}
	return (OutString);
}

function replaceSubstring (InString,oldSubstring,newSubstring)  {
	OutString="";
	var sublength = oldSubstring.length;
	for (Count=0; Count < InString.length; Count++)  {
		TempStr=InString.substring (Count, Count+sublength);
		TempChar=InString.substring (Count, Count+1);
		if (TempStr!= oldSubstring)
			OutString=OutString+TempChar
		else 
			{
			OutString=OutString+ newSubstring;
			Count +=sublength-1
			}

	}
	return (OutString);
}

function reverse (InString)  {
	OutString="";
	var Length = InString.length;
	for (Count=Length; Count > -1; Count--)  {
		TempChar=InString.substring (Count, Count+1);
		if (TempChar == "(") {TempChar = ")"}
		else if  (TempChar == ")") {TempChar = "("}
		OutString=OutString+TempChar;
		}
	return (OutString);
	}

function toFrac(x, maxDenom, tol) {
// tolerance is the largest errror you will tolerate before resorting to 
// expressing the result as the input decimal in fraction form
// suggest no less than 10^-10, since we round all to 15 decimal places.
	var theFrac = new Array();
	theFrac[1] = 0;
	theFrac[2] = 0;
	var p1 = 1;
	var p2 = 0;
	var q1 = 0;	
	var q2 = 1;	
	var u =0;
	var t = 0;
	var flag = true;
	var negflag = false;
	var a = 0;
	var xIn = x; // variable for later

	if (x >10000000000) return(theFrac);
while (flag)
	{
	if (x<0) {x = -x; negflag = true; p1 = -p1}
	var intPart = Math.floor(x);
	var decimalPart = roundSigDig((x - intPart),15);

	x = decimalPart;
	a = intPart;
	
	t = a*p1 + p2;
	u = a*q1 + q2;
	if  ( (Math.abs(t) > 10000000000 ) || (u > maxDenom ) ) 
		{
			n = p1;
			d = q1;
			break;
		}

		p = t;
		q = u;
			
//		cout << "cf coeff: " << a << endl; // for debugging
//		cout << p << "/" << q << endl;	// for debugging
		
	if ( x == 0 )
		{
		n = p;
		d = q;
		break;
		}

		p2 = p1;
		p1 = p;
		q2 = q1;
		q1 = q;
		x = 1/x;
	
	} // while ( true );
	
	theFrac[1] = n;
	theFrac[2] = d;
	if (Math.abs(xIn-(n/d)) > tol) return (roundDec(xIn, numDecs).toString());
	if (theFrac[2] == 1) return (theFrac[1].toString());
	return (theFrac[1] + "/" + theFrac[2]);

} // toFrac



function formatChars(inS) {
    	inS=inS.replace(/([0-9.xy]+)([\-\+])([0-9.xy])/g,"$1 $2 $3");
	inS=inS.replace(/\=/g," = ");
	inS=inS.replace(/\ /g,"###");
	inS=inS.replace(/([a-zA-Z]+)/g,"<i>$1</i>");
	inS=inS.replace(/\#\#\#/g,"&#160;");

	inS=inS.replace(/\-/g,"&#8722;");
	return(inS);
} // formatChars


function getW(theStr) {
	var sc=document.getElementById("ruler");
	sc.innerHTML = theStr;
	var w = sc.offsetWidth;
	sc.innerHTML = "";
	return w
return totWdth
}




/* This script and many more are available free online at
The JavaScript Source :: http://javascript.internet.com
Created by: Dustin Diaz :: http://www.dustindiaz.com/ */

function getElementsByClass(searchClass,node,tag) {
  var classElements = new Array();
  if (node == null)
    node = document;
  if (tag == null)
    tag = '*';
  var els = node.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
  for (i = 0, j = 0; i < elsLen; i++) {
    if (pattern.test(els[i].className) ) {
      classElements[j] = els[i];
      j++;
    }
  }
  return classElements;
}


function calc(){
	fractionMode = document.getElementById("fracModeButton").checked;
	showingVertices = document.getElementById("vertexSButton").checked;
	vArr.length=0;
	var nD=document.getElementById("acc").value;
	var k=parseInt(nD)
	if ((typeof k=="number")&&(0 <= k)&&(k <= 13)) numDecs=k;
	else {
	    myAlert(addText("The number of decimal places must be between 0 and 13. I am setting it back to 4.","El n&uacute;mero de posiciones decimales debe ser entre 0 y 13. Estoy reinici&#225;ndola a 4."))
	    document.getElementById("acc").value="4"
	    numDecs="4"
	}
	//alert(numDecs)
	var num = calc.arguments[0];

	

	//**********

	// Option 0
	if (num == 0)
		{
		document.getElementById("input").value = exStr[excCycle];
		excCycle+=1;if(excCycle==exL)excCycle=0;
		document.getElementById("xMinVal").value = -5;
		document.getElementById("xMaxVal").value = 5;
		document.getElementById("yMinVal").value = -5;
		document.getElementById("yMaxVal").value = 5;
		document.getElementById("xGridVal").value = 1;
		document.getElementById("yGridVal").value = 1;
		document.getElementById("R12").checked=true;
		//document.theForm.output.value = theGInstructionString;
		}

	// Option 1	
	if (num == 1)
		{
		document.getElementById("R10").checked=true;
		document.getElementById("objbox").value = "3x+y";
		
		document.getElementById("input").value = exStr[excCycle];
		excCycle+=1;if(excCycle==exL)excCycle=0;
		//document.theForm.output.value = theInstructionString;
		}

	// Option 2
	else  if (num == 2)
		{
		// this reads a problem and solves it
		// uses the tableau (first one only) to compute the solution;
		rLineColors.length=0;
		vLineColors.length=0;
		rLineColors=["",]; // color or reg lines
		vLineColors=["",];// color or vertical lines
		grapher1.curvesColors.length=0;
		colorCount=0;
    
    grapher1.curvesColors.length=0;
		colorCount=0;
		grapher1.curvesColors = cCols.slice(); // reinicialize the grapher's curves colors
		okToRoll = true;
		setupTableau();
		//alert(okToRoll)
		if(okToRoll) solveGraphical();
		if(okToRoll) makeGraph();
		}
	
	// Option 3
	else  if (num == 3)
		{
			// erase everything
			document.getElementById("input").value = "";
			document.getElementById("objbox").value = "";
			document.getElementById('output').innerHTML=""
		}

	// Evaluating a function
else  if (num == 4)
	{
		// when "graph" is pressed
		okToRoll=true;
		usingSettings=true;
		xMin=parseFloat(document.getElementById("xMinVal").value);
		if(isNaN(xMin)) {
			myAlert(addText("Xmin does not look like a number to me.","Xmin debe ser un n&#250;mero."));
			okToRoll=false;
			usingSettings=false;
			return false;
		}
		xMax=parseFloat(document.getElementById("xMaxVal").value);
		if(isNaN(xMax)) {
			myAlert(addText("Xmax does not look like a number to me.","Xmax debe ser un n&#250;mero."));
			okToRoll=false;
			usingSettings=false;
			return false;
		}
		if(xMax<=xMin) {
			myAlert(addText("Xmax must be greater than Xmin","Xmax debe ser mayor que Xmin."));
			okToRoll=false;
			usingSettings=false;
			return false;
		}
		yMin=parseFloat(document.getElementById("yMinVal").value);
		if(isNaN(yMin)) {
			myAlert(addText("Ymin does not look like a number to me.","Ymin debe ser un n&#250;mero."));
			okToRoll=false;
			return false;
		}
		yMax=parseFloat(document.getElementById("yMaxVal").value);
		if(isNaN(yMax)) {
			myAlert(addText("Ymax does not look like a number to me.","Ymax debe ser un n&#250;mero."));
			okToRoll=false;
			usingSettings=false;
			return false;
		}
		if(yMax<=yMin) {
			myAlert(addText("Ymax must be greater than Ymin","Xmax debe ser mayor que Ymin."));
			okToRoll=false;
			usingSettings=false;
			return false;
		}
		//***HERE now the gridlines - akllow blank or a number ; makeGraph should handle that as it reads themn
		var xgv=stripSpaces(document.getElementById("xGridVal").value), ygv=stripSpaces(document.getElementById("yGridVal").value);
		if(xgv=="") {
			grapher1.xGrid = "off";
			grapher1.showScalex=false;
		}

		else {
			var xgvn=parseFloat(xgv);
			if(isNaN(xgvn)) {
			myAlert(addText("Gridlines X should either be a number or blank for no x-grid lines).","L&#237;neas de cuadr&#237;cula X debe ser un n&#250;mero o dejado en blanco si no deseas l&#237;neas de cuadr&#237;cula x"));
			okToRoll=false;
			usingSettings=false;
			return false;
			}
			else {
				grapher1.xGrid = "on";
				grapher1.showScalex=true;
				grapher1.xGridStep=xgvn;
			}
		}
		if(ygv=="") {
			grapher1.yGrid = "off";
			grapher1.showScaley=false;
		}
		else {
			var ygvn=parseFloat(ygv);
			if(isNaN(ygvn)) {
			myAlert(addText("Gridlines Y should either be a number or blank for no y-grid lines).","L&#237;neas de cuadr&#237;cula Y debe ser un n&#250;mero o dejado en blanco si no deseas l&#237;neas de cuadr&#237;cula y"));
			okToRoll=false;
			usingSettings=false;
			return false;
			}
			else {
				grapher1.yGrid = "on";
				grapher1.showScaley=true;
				grapher1.yGridStep=ygvn;
			}
		}
//alert("usingSettings = "+usingSettings)
	calc(2);
	usingSettings=false;
		
	} // of this option

	// Option 5
	else  if (num == 5)
		{
		
		}
	// Option 6
	else  if (num == 6)
		{
		
		}
			
}


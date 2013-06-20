//Backs up inner HTML of html node
var backupInnerHTML = document.documentElement.innerHTML;

//Inner html for drawing DOM tree
var traverseHTML = "<body><div id=\"domTraverse\">";

//Const pixel vertical spacing from parent to child node
var topSpacing = 80;

//Const pixel horizontal spacing for sibling nodes
var horizontalSpacing = 40;

//Const pixel to adjust for the coordinates when drawing lines
var linePositionAdjust = 14;

//Total width in pixels of entire tree
var spanWidth;

//Function to draw line on page
//Credits: madox2 - http://stackoverflow.com/questions/4270485/drawing-lines-on-html-page
//With slight modifications
function DrawLine(x1, y1, x2, y2){

    if(y1 < y2){
        var pom = y1;
        y1 = y2;
        y2 = pom;
        pom = x1;
        x1 = x2;
        x2 = pom;
    }

    var a = Math.abs(x1-x2);
    var b = Math.abs(y1-y2);
    var c;
    var sx = (x1+x2)/2 ;
    var sy = (y1+y2)/2 ;
    var width = Math.sqrt(a*a + b*b ) ;
    var x = sx - width/2;
    var y = sy;

    a = width / 2;

    c = Math.abs(sx-x);

    b = Math.sqrt(Math.abs(x1-x)*Math.abs(x1-x)+Math.abs(y1-y)*Math.abs(y1-y) );

    var cosb = (b*b - a*a - c*c) / (2*a*c);
    var rad = Math.acos(cosb);
    var deg = (rad*180)/Math.PI

	var divTag = "<div style=\"border:1px solid black;width:"+width+"px;height:0px;-moz-transform:rotate("+deg+"deg);-webkit-transform:rotate("+deg+"deg);position:absolute;top:"+y+"px;left:"+x+"px;\"></div>";
    traverseHTML = traverseHTML + divTag;
}

//Recursive function to find the maximum number of children for a tree at any depth
var getTreeSpan = function(node) {
  if (node == null) {return 1;}
  if (node.children.length == 0) {node.childrenSpan = 1; return 1;}
  else {
    var currentMax = 0;
    for (var i = 0; i < node.children.length; i++) {
	  currentMax = currentMax + getTreeSpan(node.children[i]);
	}
	node.childrenSpan = currentMax;
	return currentMax;
  }
};

var drawRecurse = function(node, givenWidth, xOffset, yOffset){
  if (node == null) {return;}
  else {
    var left = Math.round((givenWidth / 2) + xOffset);
	var givenChildWidth = 0;
    var accumulatedXOffset = xOffset;
	
    for (var i = 0; i < node.children.length; i++)
    {
	  accumulatedXOffset = accumulatedXOffset + givenChildWidth;
	  givenChildWidth = Math.round((givenWidth * node.children[i].childrenSpan) / node.childrenSpan);
	  
	  drawRecurse(node.children[i], givenChildWidth, accumulatedXOffset, yOffset + topSpacing);
	  DrawLine(left + linePositionAdjust, yOffset + linePositionAdjust, Math.round((givenChildWidth / 2) + accumulatedXOffset) + linePositionAdjust, yOffset + topSpacing);
    }
	
	//Credits: thirtydot - http://stackoverflow.com/questions/4861224/how-to-use-css-to-surround-a-number-with-a-circle/4861306#4861306
	traverseHTML = traverseHTML + "<div style=\"-webkit-border-radius: 999px;-moz-border-radius: 999px;border-radius: 999px;behavior: url(PIE.htc);width: 18px;height: 18px;position:absolute;left:" + left + "px;top:" + yOffset + "px;padding: 4px;background: #fff;border: 2px solid #666;color: #666;text-align: center;font: 10px Arial, sans-serif\">" + node.nodeName + "</div>";
  }
};

//Draws DOM tree
var initDrawDOMTree = function () {
  spanWidth = getTreeSpan(document.documentElement) * horizontalSpacing;
  drawRecurse(document.documentElement, spanWidth, 0, topSpacing);
  traverseHTML = traverseHTML + "</div></body>";
  document.documentElement.innerHTML = traverseHTML;
};

//Resets DOM tree
var resetDOMTree = function () {
  document.documentElement.innerHTML = backupInnerHTML;
};

///////////////////////////////////////////////////////////////////////////////
// STYLE DECLARATION
// Use double quotes in JavaScript


// To include files for VS to understand and query them, use this syntax..
///<reference path="FCUtils.js" />

// Define the console if not already defined
if (!window.console) console = { log: function () { } };



///////////////////////////////////////////////////////////////////////////////
// Global Namespace for this application
//
var nz = nz || {};
nz.dynatab = new Object();
nz.dynatab.config = new Object();


///////////////////////////////////////////////////////////////////////////////
// Constants

nz.dynatab.config.sDivTypeTab = "TAB";
nz.dynatab.config.sDivTypeContent = "CONTENT";

nz.dynatab.config.sTabPrefix = "divTab_";
nz.dynatab.config.sContentPrefix = "divContent_";



///////////////////////////////////////////////////////////////////////////////
// Log Wrapper
//

nz.dynatab.config.bLog = true;

nz.dynatab.log = function (msg) { if (nz.dynatab.config.bLog) { console.log(msg); } }
nz.dynatab.warn = function (msg) { if (nz.dynatab.config.bLog) { console.warn(msg); } }
nz.dynatab.error = function (msg) { if (nz.dynatab.config.bLog) { console.error(msg); } }





///////////////////////////////////////////////////////////////////////////////
// ENTRY POINT
//


// First Function: Configure a new dynamic tab area so that you can begin
// adding tabs.
nz.dynatab.Build = function (sTabAreaId, styleDefn, sContainerId) {
    var prefix = "nz.dynatab.Build() - ";
    nz.dynatab.log(prefix + "Entering");

    // Check that this has not already been set up
    if (nz.dynatab.config.hasOwnProperty(sTabAreaId)) {
        nz.dynatab.warn(prefix + "A DynaTab area with the name >" + sTabAreaId + "< has already been configured.  Each area should have a unique name.");
        return;
    }

    // Check container exists.
    var container = document.getElementById(sContainerId);
    if (fc.utils.isInvalidVar(container)) {
        nz.dynatab.error(prefix + "Could not find the container with id >" + sContainerId + "<;  Cannot configure this container to hold a DynaTab control.");
        return;
    }

    // Don't let the container be used twice.
    // Check to see if it has been marked.
    var mark = container.getAttribute("data-dynatabContainer");
    if (mark == true) {
        nz.dynatab.error(prefix + "Container with id >" + sContainerId + "< already contains a DynaTab control.");
        return;
    }

    // Mark the container
    container.setAttribute("data-dynatabContainer", true);

    nz.dynatab[sTabAreaId] = new Object();
    nz.dynatab[sTabAreaId]["styleDefn"] = styleDefn;
    nz.dynatab[sTabAreaId]["sContainerId"] = sContainerId;
    nz.dynatab[sTabAreaId]["seqNum"] = 0;

    nz.dynatab.getBackgroundColours(sTabAreaId, container);

    nz.dynatab.log(prefix + "Exiting");
}



nz.dynatab.AddTab = function (sTabAreaId, sTabText, tabContent, bIncludeCloseButton) {
    var prefix = "nz.dynatab.AddTab() - ";
    nz.dynatab.log(prefix + "Entering");

    // Default syntax; Default to illegal value if not set
    bIncludeCloseButton = (typeof bIncludeCloseButton === 'undefined') ? false : bIncludeCloseButton;


    var container = nz.dynatab.getContainer(sTabAreaId);
    if (container == null) return false;

    var index = ++nz.dynatab[sTabAreaId]["seqNum"];

    var divTab = nz.dynatab.createDivTab(sTabAreaId, index, sTabText, bIncludeCloseButton);

    var firstContentNode = nz.dynatab.getFirstContentNode(container);
    if (firstContentNode == null) {
        container.appendChild(divTab);
    }
    else {
        container.insertBefore(divTab, firstContentNode);
    }

    var divContent = nz.dynatab.createDivContent(sTabAreaId, index, tabContent, divTab, container);
    container.appendChild(divContent);
    nz.dynatab.setDivContentHeight(tabContent, divTab, divContent, container);

    nz.dynatab.setTabSelected(sTabAreaId, index);

    nz.dynatab.log(prefix + "Exiting");
    return true;
}

nz.dynatab.removeTab = function (sTabAreaId, index) {
    var prefix = "nz.dynatab.removeTab() - ";
    nz.dynatab.log(prefix + "Entering");

    var sContainerId = nz.dynatab[sTabAreaId]["sContainerId"];
    var container = document.getElementById(sContainerId);

    var divTabNodeToRemove = nz.dynatab.getNode(container, nz.dynatab.config.sDivTypeTab, index);
    if (fc.utils.isInvalidVar(divTabNodeToRemove)) {
        nz.dynatab.error(prefix + "Failed to retrieve tab node for index >" + index + "<");
        return;
    }

    var divContentNodeToRemove = nz.dynatab.getNode(container, nz.dynatab.config.sDivTypeContent, index);
    if (fc.utils.isInvalidVar(divContentNodeToRemove)) {
        nz.dynatab.error(prefix + "Failed to retrieve content node for index >" + index + "<");
        return;
    }

    // Should have two non-null nodes. 
    // Find potential next or previous siblings for tab node

    var divTabNodePrevious = divTabNodeToRemove.previousSibling;
    var divTabNodeNext = divTabNodeToRemove.nextSibling;

    // Detach the button event
    fc.utils.removeEventHandler(divTabNodeToRemove, "click", nz.dynatab.btnCloseTab_onClick);

    // Remove the tab node
    fc.utils.removeElement(divTabNodeToRemove);

    // Remove the content node
    fc.utils.removeElement(divContentNodeToRemove);

    // If there is a next sibling, select that
    if (divTabNodeNext !== null) {
        var nextIndex = divTabNodeNext.getAttribute("data-index");
        nz.dynatab.setTabSelected(sTabAreaId, nextIndex);
        return;
    }

    // Else, if there is a previous sibling, select that
    if (divTabNodePrevious !== null) {
        var prevIndex = divTabNodePrevious.getAttribute("data-index");
        nz.dynatab.setTabSelected(sTabAreaId, prevIndex);
        return;
    }

    // Else, no tabs exist, nothing can be done.

    nz.dynatab.log(prefix + "Exiting");
}




///////////////////////////////////////////////////////////////////////////////
// HANDLERS
//

nz.dynatab.divTab_onClick = function (event) {
    var prefix = "nz.dynatab.divTab_onClick() - ";
    nz.dynatab.log(prefix + "Entering");

    var areaId = this.getAttribute("data-areaid");
    var index = this.getAttribute("data-index");

    nz.dynatab.log(prefix + "Click: AreaId=" + areaId + ", Index=" + index);

    nz.dynatab.setTabSelected(areaId, index);

    nz.dynatab.log(prefix + "Exiting");
}

nz.dynatab.btnCloseTab_onClick = function (button, event) {
    var prefix = "nz.dynatab.btnCloseTab_onClick() - ";
    nz.dynatab.log(prefix + "Entering");

    var areaId = button.getAttribute("data-areaid");
    var index = button.getAttribute("data-index");

    nz.dynatab.log(prefix + "Click: AreaId=" + areaId + ", Index=" + index);

    nz.dynatab.removeTab(areaId, index);

    event.stopPropagation();

    nz.dynatab.log(prefix + "Exiting");
}





///////////////////////////////////////////////////////////////////////////////
// HELPERS
//

nz.dynatab.getBackgroundColours = function (sTabAreaId, container) {

    // Create a temp div
    var divTemp = document.createElement("div");
    divTemp.id = "divTemp";
    divTemp.style.display = "none";
    container.appendChild(divTemp);

    divTemp.className = nz.dynatab[sTabAreaId]["styleDefn"]["tab"];

    // Read it's background colour value
    var sBackgroundColourSelected = fc.utils.getStyle(divTemp, "background-color"); // "rgb(r,g,b)"
    var sBackgroundColourDeselected = fc.utils.rgbStringColourLuminance(sBackgroundColourSelected, -0.1, false); // 10% darker

    // Store in an easy to read way
    nz.dynatab[sTabAreaId]["colourSelected"] = sBackgroundColourSelected;
    nz.dynatab[sTabAreaId]["colourDeselected"] = sBackgroundColourDeselected;

    // Remove from the doc
    fc.utils.removeElement(divTemp);
}

nz.dynatab.createDivTab = function (sTabAreaId, index, sTabText, bIncludeCloseButton) {
    //var prefix = "nz.dynatab.createDivTab() - ";

    var tabId = sTabAreaId + "_" + index;

    var divTab = document.createElement("div");
    divTab.id = nz.dynatab.config.sTabPrefix + tabId; // example: divTab_MYTABAREA_1

    divTab.setAttribute("data-divtype", nz.dynatab.config.sDivTypeTab);
    divTab.setAttribute("data-index", index);
    divTab.setAttribute("data-areaid", sTabAreaId);

    divTab.className = nz.dynatab[sTabAreaId]["styleDefn"]["tab"];
    divTab.style.styleFloat = 'left'; // IE
    divTab.style.cssFloat = 'left'; // Non-IE

    // Attach a click handler to the div
    divTab.onclick = nz.dynatab.divTab_onClick;

    if (bIncludeCloseButton) {
        var sButtonId = "btnCloseTab_" + tabId;
        var sHtmlCloseButton = "<input type='button' id='" + sButtonId + "'";
        sHtmlCloseButton += " value='x'";
        sHtmlCloseButton += " onclick='nz.dynatab.btnCloseTab_onClick(this,event)'";
        sHtmlCloseButton += " data-index='" + index + "'";
        sHtmlCloseButton += " data-areaid='" + sTabAreaId + "'";
        sHtmlCloseButton += " />";
        divTab.innerHTML = sTabText + " " + sHtmlCloseButton;
    }
    else {
        divTab.innerHTML = sTabText;
    }

    return divTab;
}


nz.dynatab.createDivContent = function (sTabAreaId, index, tabContent, divTab, container) {
    //var prefix = "nz.dynatab.createDivContent() - ";

    var tabId = sTabAreaId + "_" + index;

    var divContent = document.createElement("div");
    divContent.id = nz.dynatab.config.sContentPrefix + tabId; // example: divContent_MYTABAREA_1
    divContent.setAttribute("data-divtype", nz.dynatab.config.sDivTypeContent);
    divContent.setAttribute("data-index", index);
    divContent.className = nz.dynatab[sTabAreaId]["styleDefn"]["content"];

    divContent.style.clear = "both";

    divContent.appendChild(tabContent);

    return divContent;
}


nz.dynatab.setDivContentHeight = function (tabContent, divTab, divContent, container) {

    var ht = "height";
    var pt = "padding-top";
    var pb = "padding-bottom";

    var containerHt = container.offsetHeight;
    var containerPt = fc.utils.getStyleValue(container, pt);
    var containerPb = fc.utils.getStyleValue(container, pb);
    var effectiveContainerHt = containerHt - (containerPt + containerPb);

    var divTabHt = divTab.offsetHeight;
    var divTabPt = fc.utils.getStyleValue(divTab, pt);
    var divTabPb = fc.utils.getStyleValue(divTab, pb);

    var divContentPt = fc.utils.getStyleValue(divContent, pt);
    var divContentPb = fc.utils.getStyleValue(divContent, pb);
    var effectiveDivContentPadding = divContentPt + divContentPb;

    var tabContentHt = tabContent.offsetHeight;
    var tabContentPt = fc.utils.getStyleValue(tabContent, pt);
    var tabContentPb = fc.utils.getStyleValue(tabContent, pb);

    var totalContentHt = divTabHt + tabContentHt + effectiveDivContentPadding;
    if (totalContentHt < effectiveContainerHt) {
        var requiredHeight = effectiveContainerHt - (divTabHt + effectiveDivContentPadding);
        divContent.style.height = requiredHeight.toString() + "px";
    }
}


nz.dynatab.getContainer = function (sTabAreaId) {
    var prefix = "nz.dynatab.getContainer() - ";

    // Check that this DynaTab area has been set up.
    if (!nz.dynatab.hasOwnProperty(sTabAreaId)) {
        nz.dynatab.error(prefix + "There is currently no DynaTab defined with id >" + sTabAreaId + "<");
        return;
    }

    var sContainerId = nz.dynatab[sTabAreaId]["sContainerId"];
    if (fc.utils.isInvalidVar(sContainerId)) {
        nz.dynatab.error(prefix + "DynaTab " + sTabAreaId + " does not have a container defined.");
        return;
    }

    var container = document.getElementById(sContainerId);
    if (fc.utils.isInvalidVar(container)) {
        nz.dynatab.error(prefix + "DynaTab " + sTabAreaId + " could not find a container with id >" + sContainerId + "<");
        return;
    }

    return container;
}

nz.dynatab.getFirstContentNode = function (container) {
    var prefix = "nz.dynatab.getFirstContentNode() - ";

    var nodes = container.childNodes;
    var targetNode = null;
    for (var i = 0; i < nodes.length; ++i) {
        var currentNode = nodes[i];
        var type = currentNode.getAttribute("data-divtype");
        if (type == nz.dynatab.config.sDivTypeContent) {
            targetNode = currentNode;
            break;
        }
    }

    return targetNode; // Possibly null
}


nz.dynatab.getNode = function (container, targetType, index) {
    var targetNode = null;
    var nodes = container.childNodes;
    for (var i = 0; i < nodes.length; ++i) {
        var currentNode = nodes[i];
        var currentType = currentNode.getAttribute("data-divtype");
        var currentIndex = currentNode.getAttribute("data-index");
        if (currentType == targetType && currentIndex == index) {
            targetNode = currentNode;
            break;
        }
    }
    return targetNode;
}

nz.dynatab.getPeerNodes = function (container, targetType, nIndexToExclude) {

    // Default syntax; Default to illegal value if not set
    nIndexToExclude = (typeof nIndexToExclude === 'undefined') ? -1 : nIndexToExclude;

    var arrPeerNodes = [];
    var nodes = container.childNodes;
    for (var i = 0; i < nodes.length; ++i) {
        var currentNode = nodes[i];
        var currentType = currentNode.getAttribute("data-divtype");
        var currentIndex = currentNode.getAttribute("data-index");
        if (currentType == targetType && currentIndex != nIndexToExclude) {
            arrPeerNodes.push(currentNode);
        }
    }

    return arrPeerNodes;
}



nz.dynatab.setTabSelected = function (sTabAreaId, index) {
    var prefix = "nz.dynatab.setTabSelected() - ";
    nz.dynatab.log(prefix + "Entering; sTabAreaId=" + sTabAreaId + ", index=" + index);

    var sContainerId = nz.dynatab[sTabAreaId]["sContainerId"];
    var container = document.getElementById(sContainerId);

    var sColourSelected = nz.dynatab[sTabAreaId]["colourSelected"];
    var sColourDeselected = nz.dynatab[sTabAreaId]["colourDeselected"];

    var arrTabs = nz.dynatab.getPeerNodes(container, nz.dynatab.config.sDivTypeTab);

    // Iterate these tabs and set background colour slightly darker than specified
    // style colour, except where the index is the set index.
    for (var i = 0; i < arrTabs.length; ++i) {
        var currentTab = arrTabs[i];
        var currentIndex = currentTab.getAttribute("data-index");
        if (currentIndex == index) {
            currentTab.style.backgroundColor = sColourSelected;
        }
        else {
            currentTab.style.backgroundColor = sColourDeselected;
        }
    }


    var arrContent = nz.dynatab.getPeerNodes(container, nz.dynatab.config.sDivTypeContent);

    // Iterate the content tabs, hide all except the index content
    for (var j = 0; j < arrContent.length; ++j) {
        var currentContent = arrContent[j];
        var currentIndex = currentContent.getAttribute("data-index");
        if (currentIndex == index) {
            currentContent.style.display = "block"; // Show
        }
        else {
            currentContent.style.display = "none"; // Hide
        }
    }

    nz.dynatab.log(prefix + "Exiting");
}

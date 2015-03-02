﻿///////////////////////////////////////////////////////////////////////////////
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
nz.dynatab.config.sContainerPrefix = "divContainer_";
nz.dynatab.config.sWrapperPrefix = "divWrapper_";
nz.dynatab.config.nAreaSeqNum = 0;



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
nz.dynatab.Build = function (sTabAreaId, styleDefn, sPlaceHolderId) {
    var prefix = "nz.dynatab.Build() - ";
    nz.dynatab.log(prefix + "Entering");

    // Check that this has not already been set up
    if (nz.dynatab.config.hasOwnProperty(sTabAreaId)) {
        nz.dynatab.warn(prefix + "A DynaTab area with the name >" + sTabAreaId + "< has already been configured.  Each area should have a unique name.");
        return;
    }

    // Check PlaceHolder exists.
    var ph = document.getElementById(sPlaceHolderId);
    if (fc.utils.isInvalidVar(ph)) {
        nz.dynatab.error(prefix + "Could not find the PlaceHolder element with id >" + sPlaceHolderId + "<;  Cannot configure this element to hold a DynaTab control.");
        return;
    }

    // Don't let the container be used twice.
    // Check to see if it has been marked.
    var mark = ph.getAttribute("data-dynatabContainer");
    if (mark == true) {
        nz.dynatab.error(prefix + "PlaceHolder element with id >" + sPlaceHolderId + "< already contains a DynaTab control.");
        return;
    }

    // Mark the container
    ph.setAttribute("data-dynatabContainer", true);

    // Setup operating variables
    ++nz.dynatab.config.nAreaSeqNum;
    nz.dynatab[sTabAreaId] = new Object();
    nz.dynatab[sTabAreaId]["styleDefn"] = styleDefn;
    nz.dynatab[sTabAreaId]["sPlaceHolderId"] = sPlaceHolderId;
    nz.dynatab[sTabAreaId]["seqNum"] = 0;

    // Create the wrapping container
    var container = document.createElement("div");
    var sContainerId = nz.dynatab.config.sContainerPrefix + nz.dynatab.config.nAreaSeqNum.toString();
    container.id = sContainerId;
    nz.dynatab[sTabAreaId]["sContainerId"] = sContainerId;
    container.className = styleDefn["container"];

    // Functional settings
    container.style.height = "100%";
    container.style.width = "100%";
    container.style.overflow = "auto";

    ph.appendChild(container);

    nz.dynatab.getBackgroundColours(sTabAreaId, container);

    // Create the tab wrapper
    var wrapper = document.createElement("div");
    var sWrapperId = nz.dynatab.config.sWrapperPrefix + nz.dynatab.config.nAreaSeqNum.toString();
    wrapper.id = sWrapperId;
    nz.dynatab[sTabAreaId]["sWrapperId"] = sWrapperId;
    wrapper.className = styleDefn["wrapper"];

    // Functional settings
    wrapper.style.styleFloat = "left"; // IE
    wrapper.style.cssFloat = "left"; // Non-IE
    //wrapper.style.width = "100%";
    wrapper.style.whiteSpace = "nowrap";

    // Attach to the container
    container.appendChild(wrapper);

    nz.dynatab.log(prefix + "Exiting");
}



nz.dynatab.AddTab = function (sTabAreaId, sTabText, tabContent, bIncludeCloseButton) {
    var prefix = "nz.dynatab.AddTab() - ";
    nz.dynatab.log(prefix + "Entering");

    // Default syntax; Default to illegal value if not set
    bIncludeCloseButton = (typeof bIncludeCloseButton === 'undefined') ? false : bIncludeCloseButton;

    var sContainerId = nz.dynatab[sTabAreaId]["sContainerId"];
    var container = document.getElementById(sContainerId);
    if (container == null) {
        nz.dynatab.error(prefix + "Could not access DynaTab container; Cannot add this tab.");
        return false;
    }


    var sWrapperId = nz.dynatab[sTabAreaId]["sWrapperId"];
    var wrapper = document.getElementById(sWrapperId);
    if (wrapper == null) {
        nz.dynatab.error(prefix + "Could not access DynaTab wrapper; Cannot add this tab.");
        return false;
    }


    var index = ++nz.dynatab[sTabAreaId]["seqNum"];

    var divTab = nz.dynatab.createDivTab(sTabAreaId, index, sTabText, bIncludeCloseButton);

    wrapper.appendChild(divTab);

    var divContent = nz.dynatab.createDivContent(sTabAreaId, index, tabContent, divTab, container);
    container.appendChild(divContent);
    
    nz.dynatab.setTabSelected(sTabAreaId, index);

    nz.dynatab.log(prefix + "Exiting");
    return true;
}

nz.dynatab.removeTab = function (sTabAreaId, index) {
    var prefix = "nz.dynatab.removeTab() - ";
    nz.dynatab.log(prefix + "Entering");

    var sContainerId = nz.dynatab[sTabAreaId]["sContainerId"];
    var container = document.getElementById(sContainerId);

    var sWrapperId = nz.dynatab[sTabAreaId]["sWrapperId"];
    var wrapper = document.getElementById(sWrapperId);

    var divTabNodeToRemove = nz.dynatab.getNode(wrapper, nz.dynatab.config.sDivTypeTab, index);
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
    divTab.style.display = "inline-block"; 

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


nz.dynatab.getNode = function (parent, targetType, index) {
    var targetNode = null;
    var nodes = parent.childNodes;
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

nz.dynatab.getPeerNodes = function (parent, targetType, nIndexToExclude) {
    var prefix = "nz.dynatab.getPeerNodes() - ";

    // Default syntax; Default to illegal value if not set
    nIndexToExclude = (typeof nIndexToExclude === 'undefined') ? -1 : nIndexToExclude;

    var arrPeerNodes = [];

    var nodes = parent.childNodes;
    for (var i = 0; i < nodes.length; ++i) {
        var currentNode = nodes[i];
        var currentType = currentNode.getAttribute("data-divtype") || "";
        var currentIndex = currentNode.getAttribute("data-index") || -1;
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

    var sWrapperId = nz.dynatab[sTabAreaId]["sWrapperId"];
    var wrapper = document.getElementById(sWrapperId);


    var sColourSelected = nz.dynatab[sTabAreaId]["colourSelected"];
    var sColourDeselected = nz.dynatab[sTabAreaId]["colourDeselected"];

    var arrTabs = nz.dynatab.getPeerNodes(wrapper, nz.dynatab.config.sDivTypeTab);

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

    // Make this divContent screen extend to the last tab, and adjust for scrollbars.
    nz.dynatab.resetDivContentHeight(sTabAreaId, index);
    nz.dynatab.resetDivContentWidth(sTabAreaId, index);

    nz.dynatab.log(prefix + "Exiting");
}

nz.dynatab.resetDivContentHeight = function (sTabAreaId, index) {

    var ht = "height";
    var wd = "width";
    var pt = "padding-top";
    var pb = "padding-bottom";

    // Get the wrapper
    var sWrapperId = nz.dynatab[sTabAreaId]["sWrapperId"];
    var wrapper = document.getElementById(sWrapperId);

    // Get the container
    var sContainerId = nz.dynatab[sTabAreaId]["sContainerId"];
    var container = document.getElementById(sContainerId);

    // Get the divContent (div encasing the foreign content)
    var divContent = nz.dynatab.getNode(container, nz.dynatab.config.sDivTypeContent, index);

    // Get the tabContent (the foreign content)
    var tabContent = divContent.firstElementChild;

    var containerHt = container.offsetHeight;
    var containerPt = fc.utils.getStyleValue(container, pt);
    var containerPb = fc.utils.getStyleValue(container, pb);
    var effectiveContainerHt = containerHt - (containerPt + containerPb);
    var bContainerXScrollbar = container.scrollWidth > container.clientWidth;

    var wrapperHt = wrapper.offsetHeight;

    var divContentPt = fc.utils.getStyleValue(divContent, pt);
    var divContentPb = fc.utils.getStyleValue(divContent, pb);
    var effectiveDivContentPadding = divContentPt + divContentPb;

    var tabContentHt = tabContent.offsetHeight;
    var tabContentPt = fc.utils.getStyleValue(tabContent, pt);
    var tabContentPb = fc.utils.getStyleValue(tabContent, pb);

    var totalContentHt = wrapperHt + tabContentHt + effectiveDivContentPadding;

    var scrollbarHeight = fc.utils.getScrollBarHeight();
    var scrollbarXCompensation = bContainerXScrollbar ? scrollbarHeight : 0;

    if (totalContentHt < effectiveContainerHt) {
        var requiredHeight = effectiveContainerHt - (wrapperHt + effectiveDivContentPadding + scrollbarXCompensation);
        divContent.style.height = requiredHeight.toString() + "px";
    }
}

nz.dynatab.resetDivContentWidth = function (sTabAreaId, index) {
    // Adjust the visible content div to be at least the width of the tab wrapper

    // Get the padding values for left and right for the DivContent area
    var pl = "padding-left";
    var pr = "padding-right";

    // Get the placeholder
    var sPlaceHolderId = nz.dynatab[sTabAreaId]["sPlaceHolderId"];
    var placeholder = document.getElementById(sPlaceHolderId);
    var placeholderWd = placeholder.offsetWidth;
    var placeholderPl = fc.utils.getStyleValue(placeholder, pl);
    var placeholderPr = fc.utils.getStyleValue(placeholder, pr);
    var effectivePlaceholderPadding = placeholderPl + placeholderPr;
    var effectivePlaceholderWd = placeholderWd - effectivePlaceholderPadding;


    // Get the wrapper
    var sWrapperId = nz.dynatab[sTabAreaId]["sWrapperId"];
    var wrapper = document.getElementById(sWrapperId);
    var wrapperWd = wrapper.offsetWidth;

    // Get the container and get its width
    var sContainerId = nz.dynatab[sTabAreaId]["sContainerId"];
    var container = document.getElementById(sContainerId);
    var containerWd = container.offsetWidth;
    var containerPl = fc.utils.getStyleValue(container, pl);
    var containerPr = fc.utils.getStyleValue(container, pr);

    var bContainerYScrollbar = container.scrollHeight > container.clientHeight;
    var scrollbarWd = fc.utils.getScrollBarWidth();
    var scrollbarYCompensation = bContainerYScrollbar ? scrollbarWd : 0;

    // Work out what the divContent width would be if it were dictated
    // solely by the content it was required to show
    var divContent = nz.dynatab.getNode(container, nz.dynatab.config.sDivTypeContent, index);
    var divContentPl = fc.utils.getStyleValue(divContent, pl);
    var divContentPr = fc.utils.getStyleValue(divContent, pr);
    var effectiveDivContentPadding = (divContentPl + divContentPr);

    var effectiveContainerWd = effectivePlaceholderWd - scrollbarYCompensation;

    // Get the tabContent (the foreign content)
    var tabContent = divContent.firstElementChild;
    var tabContentWd = tabContent.offsetWidth;

    var predictedDivContentWd = tabContentWd + effectiveDivContentPadding;

    // If the predicted divContent width is less than either the tab header width
    // or the available screen real estate, we pad the divContent out to whichever
    // is the larger.

    // We want to pad the content area out to be at least the width of 
    // the container, and at least the width of the tab header, so take
    // the maximum of the two as the limit.
    var limitWd = Math.max(wrapperWd, effectiveContainerWd);

    // If the tabContent (plus padding) does not naturally extend beyond the limit extend the divContent
    if (predictedDivContentWd < limitWd) {
        //var requiredWd = limitWd - (effectiveDivContentPadding + effectivePlaceholderPadding);
        var requiredWd = limitWd - effectiveDivContentPadding;
        divContent.style.width = requiredWd.toString() + "px";
    }
    else {
        divContent.style.width = tabContentWd.toString() + "px";
    }
}



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
nz.dynatab.config.sDivTypeContentInner = "CONTENT_INNER";

nz.dynatab.config.sTabPrefix = "divTab_";
nz.dynatab.config.sContentPrefix = "divContent_";
nz.dynatab.config.sContentInnerPrefix = "divContentInner_";
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

    nz.dynatab[sTabAreaId]["callback"] = {};
    nz.dynatab[sTabAreaId]["callback"]["change"] = null;

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

    // Functional settings
    wrapper.style.styleFloat = "left"; // IE
    wrapper.style.cssFloat = "left"; // Non-IE
    wrapper.style.whiteSpace = "nowrap";

    // Attach to the container
    container.appendChild(wrapper);

    nz.dynatab.log(prefix + "Exiting");
}



nz.dynatab.AddTab = function (sTabAreaId, sTabText, tabContent, bContentHeightIsRelative, bContentWidthIsRelative, bIncludeCloseButton) {
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
    divContent.setAttribute("data-contentHtIsRelative", bContentHeightIsRelative);
    divContent.setAttribute("data-contentWdIsRelative", bContentWidthIsRelative);
    container.appendChild(divContent);

    nz.dynatab.setTabSelected(sTabAreaId, index);

    nz.dynatab.change(sTabAreaId, index);

    nz.dynatab.log(prefix + "Exiting");
    return true;
}


// Remove all tabs
nz.dynatab.Clear = function (sTabAreaId) {
    var prefix = "nz.dynatab.Clear() - ";
    nz.dynatab.log(prefix + "Entering");

    // Get existing indices, call removeTab on each index value.

    var indices = nz.dynatab.getIndices(sTabAreaId);
    var j = 0;
    for (; j < indices.length; ++j) {
        nz.dynatab.removeTab(sTabAreaId, indices[j]);
    }

    nz.dynatab.log(prefix + "Exiting");
}


// Attach a function to be called when the selected tab changes.
nz.dynatab.SetCallback_onChange = function (sTabAreaId, fnCallback) {
    var prefix = "nz.dynatab.SetCallback_onChange() - ";
    nz.dynatab.log(prefix + "Entering");

    var tabArea = nz.dynatab[sTabAreaId];
    if (fc.utils.isInvalidVar(tabArea)) {
        var msgBadTabAreaId = "Could not find a TabArea with ID=" + sTabAreaId;
        nz.dynatab.error(prefix + msgBadTabAreaId);
        return false;
    }

    if (fc.utils.isInvalidVar(fnCallback)) {
        var msgBadCallback = "Callback function is not a valid variable.";
        nz.dynatab.error(prefix + msgBadCallback);
        return false;
    }

    if (typeof fnCallback !== "function") {
        var msgCallbackNotAFunction = "Callback variable is not a function.";
        nz.dynatab.error(prefix + msgCallbackNotAFunction);
        return false;
    }

    // All tests pass, store callback fn
    nz.dynatab[sTabAreaId].callback.change = fnCallback;

    nz.dynatab.log(prefix + "Exiting");
    return true;
}

nz.dynatab.getIndices = function (sTabAreaId) {
    var prefix = "nz.dynatab.getIndices() - ";
    nz.dynatab.log(prefix + "Entering");

    // Iterate the tabs and get their index values.
    var indices = [];

    var sWrapperId = nz.dynatab[sTabAreaId]["sWrapperId"];
    var wrapper = document.getElementById(sWrapperId);
    if (wrapper == null) {
        nz.dynatab.error(prefix + "Could not access DynaTab wrapper; Cannot clear this tab set.");
        return indices;
    }

    // Wrapper is not null.
    // Iterate the child nodes, find nodes that have attribute "data-index", 
    // record that index.

    var countNodes = wrapper.childNodes.length;
    var i = 0;
    for (; i < countNodes; ++i) {
        var currentNode = wrapper.childNodes[i];
        var currentType = currentNode.getAttribute("data-divtype");
        var currentIndex = currentNode.getAttribute("data-index");
        if (currentType == nz.dynatab.config.sDivTypeTab) {
            // This node is a div Tab node, so note it's index value
            indices.push(currentIndex);
        }
    }

    var sIndices = indices.join(", ");
    nz.dynatab.log(prefix + "Exiting; Returning array: [" + sIndices + "]");
    return indices;
}


nz.dynatab.RemoveTabByTabText = function (sTabAreaId, sTabText) {
    var prefix = "nz.dynatab.RemoveTabByTabText() - ";
    nz.dynatab.log(prefix + "Entering");

    if (fc.utils.isInvalidVar(sTabText)) {
        nz.dynatab.warn(prefix + "sTabText argument was invalid")
        return;
    }

    if (!fc.utils.isString(sTabText)) {
        nz.dynatab.warn(prefix + "sTabText argument was not a string")
        return;
    }

    if (fc.utils.isEmptyStringOrWhiteSpace(sTabText)) {
        nz.dynatab.warn(prefix + "sTabText argument was empty")
        return;
    }

    // Get the index of a tab with this text, and call removeTab with it.

    var sWrapperId = nz.dynatab[sTabAreaId]["sWrapperId"];
    var wrapper = document.getElementById(sWrapperId);
    var index = -1;

    var nodes = wrapper.childNodes;
    for (var i = 0; i < nodes.length; ++i) {

        var currentNode = nodes[i];
        var currentType = currentNode.getAttribute("data-divtype");
        var currentIndex = currentNode.getAttribute("data-index");
        var currentTabText = currentNode.getAttribute("data-text");

        if (currentType == nz.dynatab.config.sDivTypeTab) {
            if (currentTabText.toUpperCase() == sTabText.toUpperCase()) {
                index = currentIndex;
                break;
            }
        }
    }

    if (index == -1) {
        nz.dynatab.log(prefix + "No tab found with text [" + sTabText + "]");
    }
    else {
        nz.dynatab.removeTab(sTabAreaId, index);
        nz.dynatab.log(prefix + "Attempted remove of tab at index [" + index + "] with text [" + sTabText + "]");
    }
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

    var newIndex = -1;
    if (divTabNodeNext !== null) {
        // If there is a next sibling, select that
        newIndex = divTabNodeNext.getAttribute("data-index");
        nz.dynatab.setTabSelected(sTabAreaId, newIndex);
    }
    else if (divTabNodePrevious !== null) {
        // Else, if there is a previous sibling, select that
        newIndex = divTabNodePrevious.getAttribute("data-index");
        nz.dynatab.setTabSelected(sTabAreaId, newIndex);
    }
    else {
        // No op, leave the newIndex as is
    }

    nz.dynatab.change(sTabAreaId, newIndex);

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
    nz.dynatab.change(areaId, index);

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

nz.dynatab.change = function (sTabAreaId, newIndex) {
    var prefix = "nz.dynatab.change() - ";

    var fnCallback = nz.dynatab[sTabAreaId].callback.change;

    var sTabText = nz.dynatab.getTabTextByIndex(sTabAreaId, newIndex);

    if (fc.utils.isValidVar(fnCallback)) {
        if (typeof fnCallback === "function") {
            try {
                fnCallback(sTabAreaId, newIndex, sTabText);
            }
            catch (ex) {
                var msgException = "Failed during callback for tab change event with exception: " + ex.message;
                nz.dynatab.error(prefix + msgException);
            }
        }
        else {
            nz.dynatab.log(prefix + "Not calling callback function because callback function variable is not of type function.");
        }
    }
    else {
        nz.dynatab.log(prefix + "Not calling callback function because callback function variable is not valid.");
    }
}


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
    divTab.setAttribute("data-text", sTabText);

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

    var divContentInner = document.createElement("div");
    divContentInner.id = nz.dynatab.config.sContentInnerPrefix + tabId;
    divContentInner.setAttribute("data-divtype", nz.dynatab.config.sDivTypeContentInner);
    divContentInner.setAttribute("data-index", index);

    divContent.appendChild(divContentInner);
    divContentInner.appendChild(tabContent);

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

nz.dynatab.getTabTextByIndex = function (sTabAreaId, index) {

    if (index < 0) return "";

    // Get the wrapper
    var sWrapperId = nz.dynatab[sTabAreaId]["sWrapperId"];
    var wrapper = document.getElementById(sWrapperId);

    // Get the divTab (div that is the tab sticking up, the label)
    var divTab = nz.dynatab.getNode(wrapper, nz.dynatab.config.sDivTypeTab, index);

    if (fc.utils.isValidVar(divTab)) {
        return divTab.getAttribute("data-text");
    }

    return ""; // Fail
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
    // Note; We do the Width first because this is the dimension that is more
    // likely to cause a scrollbar to occur.  
    nz.dynatab.resetDivContentWidth(sTabAreaId, index);
    nz.dynatab.resetDivContentHeight(sTabAreaId, index);

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
    var divContentInner = nz.dynatab.getNode(divContent, nz.dynatab.config.sDivTypeContentInner, index);


    // Get the tabContent (the foreign content)
    var tabContent = divContentInner.firstElementChild;

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
    var effectiveTabContentPadding = tabContentPt + tabContentPb;

    var totalContentHt = wrapperHt + tabContentHt + effectiveDivContentPadding;

    var scrollbarHeight = fc.utils.getScrollBarHeight();
    var scrollbarXCompensation = bContainerXScrollbar ? scrollbarHeight : 0;

    if (totalContentHt < effectiveContainerHt) {
        var requiredContentHt = effectiveContainerHt - (wrapperHt + effectiveDivContentPadding + scrollbarXCompensation);
        divContent.style.height = requiredContentHt.toString() + "px";

        var requiredContentInnerHt = requiredContentHt - effectiveTabContentPadding;
        divContentInner.style.height = requiredContentInnerHt.toString() + "px";
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

    var divContentInner = nz.dynatab.getNode(divContent, nz.dynatab.config.sDivTypeContentInner, index);
    // divContentInner should have no padding

    // Get the tabContent (the foreign content)
    var tabContent = divContentInner.firstElementChild;
    var tabContentWd = tabContent.offsetWidth;
    var tabContentPl = fc.utils.getStyleValue(tabContent, pl);
    var tabContentPr = fc.utils.getStyleValue(tabContent, pr);
    var effectiveTabContentPadding = (tabContentPl + tabContentPr);

    // Check the style to see if tabContent is fixed with or relative
    var sContentWdIsRelative = divContent.getAttribute("data-contentWdIsRelative");
    var bContentWdIsRelative = (sContentWdIsRelative == "false" ? false : true);

    var predictedDivContentWd = tabContentWd + effectiveDivContentPadding;

    // If the predicted divContent width is less than either the tab header width
    // or the available screen real estate, we pad the divContent out to whichever
    // is the larger.

    // We want to pad the content area out to be at least the width of 
    // the container, and at least the width of the tab header, so take
    // the maximum of the two as the limit.
    var limitWd = Math.max(wrapperWd, effectiveContainerWd);

    if (!bContentWdIsRelative) {
        // TabContent is fixed width

        // If the tabContent (plus padding) does not naturally extend beyond the limit extend the divContent
        if (predictedDivContentWd < limitWd) {
            var requiredWd = limitWd - effectiveDivContentPadding;
            divContent.style.width = requiredWd.toString() + "px";
        }
        else {
            divContent.style.width = tabContentWd.toString() + "px";
        }
    }
    else {
        // TabContent is relative width

        // Set the content div to be the maximum width of the container,
        // and set the inner div to adjust for padding of content div and tab div

        var requiredContentWd = limitWd - effectiveDivContentPadding;
        divContent.style.width = requiredContentWd.toString() + "px";

        var requiredContentInnerWd = requiredContentWd - effectiveTabContentPadding;
        divContentInner.style.width = requiredContentInnerWd.toString() + "px";
    }

}



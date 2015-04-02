///////////////////////////////////////////////////////////////////////////////
// STYLE DECLARATION
// Use double quotes in JavaScript


// To include files for VS to understand and query them, use this syntax..
///<reference path="FCUtils.js" />
///<reference path="DynaTab.js" />

// Define the console if not already defined
if (!window.console) console = { log: function () { } };



///////////////////////////////////////////////////////////////////////////////
// Global Namespace for this application
//

var nz = nz || {};
nz.test = new Object();
nz.test.config = new Object();



///////////////////////////////////////////////////////////////////////////////
// Log Wrapper
//

nz.test.config.bLog = true;

nz.test.log = function (msg) { if (nz.test.config.bLog) { console.log(msg); } }
nz.test.warn = function (msg) { if (nz.test.config.bLog) { console.warn(msg); } }
nz.test.error = function (msg) { if (nz.test.config.bLog) { console.error(msg); } }


///////////////////////////////////////////////////////////////////////////////
// Constants and Variables
//

nz.test.config.nDivSeqNum = 0;
nz.test.config.sDivRandomPrefix = "divRandom_";






///////////////////////////////////////////////////////////////////////////////
// Start
//

nz.test.init = function () {
    var prefix = "nz.test.init() - ";
    console.log(prefix + "Entering");

    nz.test.hookupHandlers();



    // BUILD A STYLE OBJECT TO DEFINE THE TAB STYLE
    var styleDefn = new Object();
    styleDefn["tab"] = "dynatabTabTest"; // Settings for a div, essentially padding around content (ie text and button)                        
    styleDefn["content"] = "dynatabContentTest";
    styleDefn["container"] = "dynatabContainerTest"; // The outer containing div style



    // Create tab sets to display content divs:

    var phA = document.getElementById("divPlaceHolderA");
    nz.dynatab.Build("TabSetA", styleDefn, phA.id);

    nz.dynatab.Build("TabSetB", styleDefn, "divPlaceHolderB");

    nz.dynatab.Build("TabSetC", styleDefn, "divPlaceHolderC");


    // Make something to show in the tab A set and show
    var contentA1 = document.createElement("div");
    contentA1.id = "divContentA1";
    contentA1.innerHTML = "DIV ContentA1";
    nz.dynatab.AddTab("TabSetA", "Tab 1", contentA1, false, false, true);

    var contentA2 = document.createElement("div");
    contentA2.id = "divContentA2";
    contentA2.innerHTML = "DIV ContentA2";
    nz.dynatab.AddTab("TabSetA", "Tab Number 2", contentA2, false, false, true);

    var contentA3 = document.createElement("div");
    contentA3.id = "divContentA3";
    contentA3.innerHTML = "DIV ContentA3";
    nz.dynatab.AddTab("TabSetA", "Tab The Third of Many", contentA3, false, false, true);

    var contentA4 = document.createElement("div");
    contentA4.id = "divContentA4";
    contentA4.innerHTML = "DIV ContentA4";
    nz.dynatab.AddTab("TabSetA", "Tab 4th", contentA4, false, false, true);


    console.log(prefix + "Exiting");
}

$(window).load(nz.test.init);


nz.test.getRandomString = function (nStringLength) {
    var nRandom = (Math.random() + 1); // 1.1234563443
    var sRandom = nRandom.toString(36); // "1.garbage"
    sRandom = sRandom.substring(2, sRandom.length); // drop first 2 chars ie "1."
    if (fc.utils.isValidVar(nStringLength) && nStringLength > 0) {
        sRandom = sRandom.substring(0, nStringLength);
    }
    return sRandom;
}


nz.test.createRandomContent = function (bFixedWidth) {

    bFixedWidth = (typeof bFixedWidth === 'undefined') ? true : bFixedWidth; // Default syntax; Default to true



    var divRandom = document.createElement("div");
    divRandom.id = nz.test.config.sDivRandomPrefix + (++nz.test.config.nDivSeqNum).toString();
    divRandom.innerHTML = nz.test.getRandomString(32);
    divRandom.className = "divRandom";
    divRandom.style.backgroundColor = nz.test.createRandomRGBColour(0, 64, 0, 64, 0, 64);
    divRandom.style.color = nz.test.createRandomRGBColour(191, 255, 191, 255, 191, 255);

    var sHeight = "";
    var sWidth = "";

    if (bFixedWidth) {
        sHeight = (fc.utils.getRandomInt(50, 800)).toString() + "px";
        sWidth = (fc.utils.getRandomInt(100, 1000)).toString() + "px";
    }
    else {
        nz.test.config.once = nz.test.config.once || false;
        var bCoinToss = fc.utils.getRandomInt(0, 1) == 0 ? true : false; // 50-50 chance of true or false
        if (bCoinToss && nz.test.config.once) {
            // Use random relative size
            sHeight = (fc.utils.getRandomInt(1, 100)).toString() + "%";
            sWidth = (fc.utils.getRandomInt(1, 100)).toString() + "%";
        }
        else {
            // Use full size
            sHeight = "100%";
            sWidth = "100%";
            nz.test.config.once = true;
        }
    }

    divRandom.style.height = sHeight;
    divRandom.style.width = sWidth;

    document.documentElement.appendChild(divRandom);
    return divRandom;
}


nz.test.createRandomRGBColour = function (rMin, rMax, gMin, gMax, bMin, bMax) {
    rMin = Math.min(Math.max(rMin, 0), 255);
    rMax = Math.min(Math.max(rMax, 0), 255);
    gMin = Math.min(Math.max(gMin, 0), 255);
    gMax = Math.min(Math.max(gMax, 0), 255);
    bMin = Math.min(Math.max(bMin, 0), 255);
    bMax = Math.min(Math.max(bMax, 0), 255);

    var randomR = Math.round(rMin + (Math.random() * (rMax - rMin)));
    var randomG = Math.round(gMin + (Math.random() * (gMax - gMin)));
    var randomB = Math.round(bMin + (Math.random() * (bMax - bMin)));

    return "rgb(" + randomR.toString() + "," + randomG.toString() + "," + randomB.toString() + ")";
}

///////////////////////////////////////////////////////////////////////////////
// HANDLERS
//

nz.test.btnAddA_onClick = function (id, event) {
    var prefix = "nz.test.btnAddA_onClick() - ";
    nz.test.log(prefix + "Clicked: " + id);

    var content = nz.test.createRandomContent();
    var sTabText = "Tab " + nz.test.config.nDivSeqNum.toString();
    nz.dynatab.AddTab("TabSetA", sTabText, content, false, false, true);
}

nz.test.btnClearA_onClick = function (id, event) {
    var prefix = "nz.test.btnClearA_onClick() - ";
    nz.test.log(prefix + "Clicked: " + id);

    nz.dynatab.Clear("TabSetA");
}


nz.test.btnAddB_onClick = function (id, event) {
    var prefix = "nz.test.btnAddB_onClick() - ";
    nz.test.log(prefix + "Clicked: " + id);

    var content = nz.test.createRandomContent();
    var sTabText = "Tab " + nz.test.config.nDivSeqNum.toString();
    nz.dynatab.AddTab("TabSetB", sTabText, content, false, false, true);
}


nz.test.btnAddC_onClick = function (id, event) {
    var prefix = "nz.test.btnAddC_onClick() - ";
    nz.test.log(prefix + "Clicked: " + id);

    var content = nz.test.createRandomContent(false); // Random, relative sized content divs
    var sTabText = "Tab " + nz.test.config.nDivSeqNum.toString();
    nz.dynatab.AddTab("TabSetC", sTabText, content, true, true, true);
}


nz.test.hookupHandlers = function () {

    var btnAddA = document.getElementById("btnAddA");
    fc.utils.addEvent(btnAddA, "click", nz.test.btnAddA_onClick);

    var btnAddB = document.getElementById("btnAddB");
    fc.utils.addEvent(btnAddB, "click", nz.test.btnAddB_onClick);

    var btnAddC = document.getElementById("btnAddC");
    fc.utils.addEvent(btnAddC, "click", nz.test.btnAddC_onClick);

    var btnClearA = document.getElementById("btnClearA");
    fc.utils.addEvent(btnClearA, "click", nz.test.btnClearA_onClick);

}


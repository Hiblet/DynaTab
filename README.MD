# DynaTab #

A JavaScript-only control to produce a tabbed area where tabs can be dynamically added and removed.
Design aim was to be able to build lightweight code, that was cross-browser compatible, without resorting to JQueryUI (which I love).
Multiple instances of the control are tolerated on a single page, and are segregated by use of a text string identifier.
Whenever you add a tab to a control, you pass the relevant text identifier to say which control to add the tab to.
Each tab control can have it's own styles set independently.
(JQuery is only used in the harness code that exercises the DynaTab.js code as an example.)


## Overview ##

If you have a web page that users interact with to create results or add data to, the resultant data needs to be displayed.
The resultant data can be difficult to display if it varies in size or type with each interaction.
This control was written because I had to display an indefinite number of user orders (tabular information), and allow the orders to be held open for comparison.
The user has the option to close tabs with an 'x' button on the tab.

The control is attached to a placeholder element in HTML, and no other HTML is required.
The control is built in JavaScript and added as a child of the placeholder.
Style elements that dictate function are all set in JavaScript, and non-function styles are held in CSS.
A JavaScript object is used to link the control to the styles it should use.


## Example Usage ##

In HTML, provide an element that acts as a placeholder, and link to the DynaTab.js and FCUtils.js files, and the CSS file you intend to use.
Add copies of the DynaTab.js and FCUtils.js files to your javascript folder, and check that you are linking to them correctly.
Create some styles for the tabs in your CSS file of choice as per the entries in Default.css under "TAB STYLES FOR TESTING".

In your main JavaScript code (see Default.js in this project) you define a JS object that will pass the CSS styles to the control...

    var styleDefn = new Object();
    styleDefn["tab"] = "dynatabTabTest"; 
    styleDefn["content"] = "dynatabContentTest";
    styleDefn["container"] = "dynatabContainerTest"; 
    styleDefn["wrapper"] = "dynatabWrapperTest"; 

Then call the Build() function once in the lifetime of the page, for each control you wish to construct, with a name for the control, the style object, and the HTML ID of the placeholder element that the control will be appended to.

    nz.dynatab.Build("TabSetA", styleDefn, "IDofPlaceHolderA");

The control can now create tabs.
A tab is added by calling AddTab() with the control name, the text to use for the tab, the HTML element to display on the tab, and a bool true/false flag to stipulate whether the 'Close' button should be added for this tab.

    nz.dynatab.AddTab("TabSetA", "Tab 1", contentA1, true);


## Example Project ##

This project contains a very simple harness that sets up two tab areas.
The first control has example content, the second has no starting content.
There are buttons to add content to either tab area, and that content is randomly generated.



## Implementation ##

Implemented using Javascript only.
Note: There may be functions in FCUtils.js that use JQuery, I need to investigate further.


## Licensing ##

Free to use, but please give credit.
Please let me know if you find bugs, or if obvious improvements are possible.





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
This control was written because I had to display an indefinite number of user query results (tabular information), and allow the results to be held open for comparison.
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

Then call the Build() function once in the lifetime of the page, for each control you wish to construct, with a name for the control, the style object, and the HTML ID of the placeholder element that the control will be appended to.

    nz.dynatab.Build("TabSetA", styleDefn, "IDofPlaceHolderA");

The control can now create tabs.
A tab is added by calling AddTab() with the arguments being... 

 - the control name
 - the text to use for the tab
 - the HTML element to display on the tab
 - a bool flag to stipulate whether the tab content Height is relative (true) or fixed (false)
 - a bool flag to stipulate whether the tab content Width is relative (true) or fixed (false) 
 - an optional bool true/false flag to stipulate whether the 'Close' button should be added for this tab, which defaults to false.

<!-- comment: Work around to have a code block follow a ul list --> 

        nz.dynatab.AddTab("TabSetA", "Tab 1", contentA1, false, false, true);


To remove all tabs, a nz.dynatab.Clear() function has been implemented, which requires the control name as an argument.

To remove a tab by it's tab text (display name), a nz.dynatab.RemoveTabByTabText() function has been implemented.  
This requires a control name, and the tab text to match on.  Text matching is case insensitive, implemented using toUpperCase() in string comparison.

To select a tab by it's tab text, nz.dynatab.SetTabSelectedByTabText() has been implemented.
Again, this requires the control name, and the tab text to match on.  Matching is case insensitive.

To detect which tab is currently selected, a callback function can be attached to a tab set.
Once the tab area has been prepared by the Build() function, you can call nz.dynatab.SetCallback_onChange().  
The first argument for this function is the tab area ID, and the second argument is the function that you want called when the tab selection changes, eg.

        nz.dynatab.SetCallback_onChange("TabSetA", myproject.onTabSelectChange);

SetCallback_onChange() returns true if the passed function is validated as a function and stored correctly, else returns false.

When the selected tab is changed, the callback function (in this example, myproject.onTabSelectChange) is called.
The callback function receives three arguments, the tab area ID, the index number of the newly selected tab, and the text identifier of the newly selected tab, ie the text that is displayed on the tab.
This should be enough information for the coder to then call nz.dynatab.removeTab(), as this requires the tab area ID and the index of the tab to remove.
If there are no tabs left, the index returned is -1, and the tab text returned is the empty string.





## Example Project ##

This project contains a very simple harness that sets up three tab areas.
The first control has example content.  The second has no starting content, and variable height.  The third also has no starting content, but has fixed height. 
There are buttons to add content to either tab area, and that content is randomly generated.



## Implementation ##

Implemented using Javascript only.  JQuery is used in the Default.js harness code only, there is no JQuery requirement for DynaTab.js or FCUtils.js.



## Licensing ##

Free to use, but please give credit.
Please let me know if you find bugs, or if obvious improvements are possible.





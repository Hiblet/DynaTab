<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <%-- <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script> --%>
    <script type="text/javascript" src="<%= ResolveClientUrl("~/JQuery/jquery-1.11.1.min.js") %>"></script>

    <script type="text/javascript" src="<%= ResolveClientUrl("~/js/FCUtils.js") %>"></script>
    <script type="text/javascript" src="<%= ResolveClientUrl("~/js/DynaTab.js") %>"></script>
    <script type="text/javascript" src="<%= ResolveClientUrl("~/js/Default.js") %>"></script>

    <link rel="Stylesheet" type="text/css" href="<%= ResolveClientUrl("~/css/Default.css") %>" />    

    <title>DynaTab</title>

</head>
<body>
    <form id="form1" runat="server">
    <div>


        <%-- Test Controls --%>
        <br />
        <input type="button" id="btnAddA" value="Add Tab A" />
        &nbsp
        <input type="button" id="btnAddB" value="Add Tab B" />
        <br />


        <%-- The target containers to hold the tabs --%>
        <br />
        Below is an example where the PlaceHolder DIV element has fixed height
        <br />
        <div id="divPlaceHolderA"></div>
        <br />
        <br />
        And the DIV below is an example where the height is not fixed
        <br />
        <div id="divPlaceHolderB"></div>


    </div>
    </form>
</body>
</html>

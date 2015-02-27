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

        <%-- The target container to hold the tabs --%>
        <div id="divContainerA"></div>
        <br />
        <div id="divContainerB"></div>

        <%-- Test Area --%>
        <div id="divFeedback">FEEDBACK</div>
        <br />
        <input type="button" id="btnAddA" value="Add Tab A" />
        <br />
        <input type="button" id="btnAddB" value="Add Tab B" />
        <br />
    
    </div>
    </form>
</body>
</html>

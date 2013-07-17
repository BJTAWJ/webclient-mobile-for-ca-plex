/(!-- Set the field value to the value in the cookie if anything, and send the modified event)
var /(!Param:nameID)Val = panel.getFields("/(!Param:nameID)");
if (typeof /(!Param:nameID)Val != "undefined") {
	panel.setValues({ "/(!Param:nameID)": /(!Param:nameID)Val.getCookie.call(/(!Param:nameID)Val, "/(!Param:nameID)")});
	if (/(!Param:nameID)Val.getValue()) {
		panel.submit(wcli.util.evt("Modified", "/(!Param:nameID)"));
	}	
}
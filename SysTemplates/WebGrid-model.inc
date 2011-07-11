wcli.util.regModel("/(!NameID)", wcli.util.htmlDecode("/(!This:!jsonCols)"));
window["/(!NameID)_store"] = new Ext.data.Store(
	wcli.util.gridStore("/(!NameID)",
		wcli.util.htmlDecode("/(!This:!jsonCols)"),
		wcli.util.htmlDecode("/(!This:!jsonRows)"))
);
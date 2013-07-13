wcli.util.regModel("/(!NameID)", /(!This:!jsonCols));
window["/(!NameID)_store"] = new Ext.data.Store(
	wcli.util.gridStore("/(!NameID)",
		/(!This:!jsonCols),
		/(!This:!jsonRows),
		grouped)
);
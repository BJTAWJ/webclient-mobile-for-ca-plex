window["/(!NameID)_geo"] = new Ext.util.GeoLocation({
	autoUpdate: true,
	listeners: {
		locationupdate: function (geo) {
			var str = geo.latitude + ", " + geo.longitude;
			panel.setValues({ "/(!NameID)": str });
			
			/(!If:/(!Event:phys=Updated))
			panel.submit(wcli.util.evt("Updated", "/(!NameID)"));
			/(!If)
			
			/(!If:/(!Event:phys=Modified))
			panel.submit(wcli.util.evt("Modified", "/(!NameID)"));
			/(!If)
		}
	}
});
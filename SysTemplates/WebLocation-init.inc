window["/(!NameID)_geo"] = new Ext.util.GeoLocation({
	autoUpdate: false,
	listeners: {
		locationupdate: function (geo) {
			//If the Lat and Lng contain "," as it's decimal separator, convert it to "."
			var latString = geo.getLatitude().toString();
			latString = latString.replace(',', '.');
			var lngString = geo.getLongitude().toString();
			lngString = lngString.replace(',', '.');
			var str = latString + ", " + lngString;
			Ext.getCmp("/(!NameID)").setValue(str);
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
/(!NameID)_geo.updateLocation();
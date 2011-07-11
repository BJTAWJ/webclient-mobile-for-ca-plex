/(!EnableAction:SetValue,SetState,SetFocus)

/(!ValuesArea)
	/(!Action:SetValue)"/(!NameID)": /(!This),/(!Action)
/(!ValuesArea)

/(!StatesArea)
	/(!Action:SetState)"/(!NameID)": "FooBar",/(!Action)
/(!StatesArea)

/(!FocusArea)
	/(!Action:SetFocus)"/(!NameID)",/(!Action)
/(!FocusArea)

{
	xtype: "/(!Param:xtype)",
	name: "/(!NameID)",
	label: wcli.param("/(!Property:ControlName)", "label") || "Field",
	value: "/(!This)",
	listeners: {
		focus: {
			fn: function(e) {
				/(!If:/(!Event:phys=Gained Focus))
				panel.submit(wcli.evt("Gained Focus", "/(!NameID)"));
				/(!If)
			},
			scope: this
		},
		blur: {
			fn: function(e) {
				/(!If:/(!Event:phys=Lost Focus))
				panel.submit(wcli.evt("Lost Focus", "/(!NameID)"));
				/(!If)
			},
			scope: this
		},
		input: {
			fn: function(e) {
				/(!If:/(!Event:phys=Modified))
				panel.submit(wcli.evt("Modified", "/(!NameID)"));
				/(!If)
			},
			scope: this
		},
		change: {
			fn: function(e) {
				/(!If:/(!Event:phys=Updated))
				panel.submit(wcli.evt("Updated", "/(!NameID)"));
				/(!If)
			},
			scope: this
		}
	}
},

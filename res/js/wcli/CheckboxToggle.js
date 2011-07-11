Ext.ns('wcli');

/**
 * The default Toggle control is really just a slider and as such operates
 * on integer values.  This extension allows us to specify a transformation
 * function that maps these integer values to Plex values.
 */
wcli.CheckboxToggle = Ext.extend(Ext.form.Toggle, {
	checkedValue: 1,
	uncheckedValue: 0,
	
	getString: function(value) {
		return value === this.maxValue ? this.checkedValue : this.uncheckedValue;
	},
	
	getNumber: function(value) {
		return value === this.checkedValue ? this.maxValue : this.minValue;
	},
	
	constrain: function(value) {
		if (typeof value === 'number') {
			return wcli.CheckboxToggle.superclass.constrain.call(this, value);
		}
		else {
			return value;
		}
	},
	
	setValue: function(value) {
		if (typeof value === 'string') {
			value = this.getNumber(value);
		}
		wcli.CheckboxToggle.superclass.setValue.call(this, value);
	},
	
	getValue: function() {
		var value = wcli.CheckboxToggle.superclass.getValue.call(this);
		return this.getString(value);
	}
});

Ext.reg('togglefield', wcli.CheckboxToggle);
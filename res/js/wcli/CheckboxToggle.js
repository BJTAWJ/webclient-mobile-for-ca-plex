Ext.ns('wcli');
Ext.ns('wcli.field');

/**
 * The default Toggle control is really just a slider and as such operates
 * on integer values.  This extension allows us to specify a transformation
 * function that maps these integer values to Plex values.
 */
Ext.define('wcli.field.CheckboxToggle',{
	extend: 'Ext.field.Toggle', 
	config: {
		controlName: {},
		uncheckedValue: "",
		checkedValue: "",
	},
	
	maxValue: 1,
	minValue: 0,
	
	getString: function(value) {
		return value === this.maxValue ? this.getCheckedValue() : this.getUncheckedValue();
	},
	
	getNumber: function(value) {
		return value === this.getCheckedValue() ? this.maxValue : this.minValue;
	},
	
	constrain: function(value) {
		if (typeof value === 'number') {
			return wcli.form.CheckboxToggle.superclass.constrain.call(this, value);
		}
		else {
			return value;
		}
	},
	
	setValue: function(value) {
		if (typeof value === 'string') {
			value = this.getNumber(value);
		}
		wcli.field.CheckboxToggle.superclass.setValue.call(this, value);
	},
	
	getValue: function() {
		var value = wcli.field.CheckboxToggle.superclass.getValue.call(this);
		return this.getString(value);
	}
});

Ext.define('wcli.field.Checkbox',{
	extend: 'Ext.field.Checkbox', 
	config: {
		controlName: {},
		uncheckedValue: "",
		checkedValue: "",
	},
	
	setChecked: function(value) {
		var newChecked = false;
		if(this.getCheckedValue() == value){
			newChecked = true;
		}
		this.updateChecked(newChecked);
		this._checked = newChecked;
    },
    
    getChecked: function() {
        // we need to get the latest value from the {@link #input} and then update the value
        this._checked = this.getComponent().getChecked();
        return this._checked;
    }
});
Ext.ns('wcli');

wcli.Select = Ext.extend(Ext.form.Select, {
	
    setValue: function(value) {
	var idx = 0, record;
		
	if (value) {
            idx = this.store.findExact("text", value);
        }
	record = this.store.getAt(idx);
		
	Ext.form.Select.prototype.setValue.call(this, record && record.get('value'));
    },
	
    setValueFromData: function(value) {
	Ext.form.Select.prototype.setValue.call(this, value);		
    },

    onPickerChange: function(picker, value) {
        var currentValue = this.getValue(),
            newValue = value[this.name];

        //if (newValue != currentValue) {
            this.setValueFromData(newValue);
            this.fireEvent('change', this, this.getValue());
        //}
    },

    onListSelect: function(selModel, selected) {
        if (selected) {
            this.setValue(selected.get("text"));
            this.fireEvent('change', this, this.getValue());
        }
        
        this.listPanel.hide({
            type: 'fade',
            out: true,
            scope: this
        });
    }
});

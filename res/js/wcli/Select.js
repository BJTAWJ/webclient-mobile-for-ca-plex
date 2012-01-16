Ext.ns('wcli');

wcli.Select = Ext.extend(Ext.form.Select, {
	
	setValue: function(value) {
		var idx = 0, record;
		
		if (value) {
            idx = this.store.findExact("text", value);
        }
		record = this.store.getAt(idx);
		
		Ext.form.Select.prototype.setValue.call(this, record && record.get('value'));
	}
});

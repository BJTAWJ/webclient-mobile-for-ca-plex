Ext.ns('wcli');

wcli.ComboPicker = Ext.extend(Ext.Picker, {
	doneButton : nls.picker.doneButton,
	cancelButton: nls.picker.cancelButton,
});

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
    
    getPicker: function() {
        if (!this.picker) {
            this.picker = new wcli.ComboPicker({
                slots: [{
                    align       : 'center',
                    name        : this.name,
                    valueField  : this.valueField,
                    displayField: this.displayField,
                    value       : this.getValue(),
                    store       : this.store
                }],
                listeners: {
                    change: this.onPickerChange,
                    scope: this
                }
            });
        }

        return this.picker;
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
    },
    
    showComponent: function() {
    	var combo = this;
		var activeElement = document.activeElement;
        activeElement.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
        activeElement.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
        Ext.defer(function() {
            activeElement.blur();
            // Remove readonly attribute after keyboard is hidden.
            activeElement.removeAttribute('readonly');
            activeElement.removeAttribute('disabled');
            Ext.defer(function(){
            	Ext.form.Select.prototype.showComponent.call(combo);
            	Ext.EventManager.resizeEvent.removeListener(onresize, null);
            },500);
            var onresize = function() {
            	Ext.form.Select.prototype.showComponent.call(combo);
            	Ext.EventManager.resizeEvent.removeListener(onresize, null);
            };
            
            Ext.EventManager.onWindowResize(onresize, null);
        }, 1);
    }
});

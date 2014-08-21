Ext.ns('wcli');
Ext.ns('wcli.field');

Date.monthNames = [nls.month[1], nls.month[2], nls.month[3], nls.month[4], nls.month[5], nls.month[6], nls.month[7], nls.month[8], nls.month[9], nls.month[10], nls.month[11], nls.month[12]];
Ext.ux.DatePicker.prototype.months = [nls.month[1], nls.month[2], nls.month[3], nls.month[4], nls.month[5], nls.month[6], nls.month[7], nls.month[8], nls.month[9], nls.month[10], nls.month[11], nls.month[12]];
Ext.ux.DatePicker.prototype.days = [nls.day[1], nls.day[2], nls.day[3], nls.day[4], nls.day[5], nls.day[6], nls.day[7]];
Ext.define('wcli.DatePicker',{
	extend: 'Ext.DatePicker', 
	config: {
		doneButton :  nls.picker.doneButton,
		cancelButton :  nls.picker.cancelButton
	}
});

Ext.define('wcli.field.DatePicker',{
	extend: 'Ext.field.DatePicker', 
	config: {
		controlName: {}
	},
	
	getPicker: function() {
		var picker = this._picker
		picker = new wcli.DatePicker(Ext.apply(picker || {}));
		picker.setValue(this._value || null);
		
		picker.on({
			scope: this,
	        change: 'onPickerChange',
	        hide  : 'onPickerHide'
	    });
		
		return picker;
	},
	
	getValue: function(format) {
        var value = this._value || null;
        if(value == null){
        	return value;
        }
        else{
        	return (format && Ext.isDate(value)) ? Ext.Date.format(value, Ext.util.Format.defaultDateFormat)
        		: Ext.Date.format(value,'Ymd');
    	}
    },
});

Ext.define('wcli.field.CalendarPicker',{
	extend: 'Ext.field.DatePicker',
	config: {
		controlName: {}
	},
	
	getPicker: function() {
		if (this.pickerCtrl) {
			return this.pickerCtrl;
		}
        
		var picker = this._picker,
            value = this.getValue();
        
		var minDate, maxDate;

		if (picker.yearFrom) {
			minDate = new Date(picker.yearFrom, 0, 1);
		}
    	
		if (picker.yearTo){
			maxDate = new Date(picker.yearTo, 12, 0);
		}
    	
		if (picker && !picker.isPicker) {
			var uxDatePicker = new Ext.ux.DatePicker(Ext.apply(picker || {}, {
				flex: 1,
        		minDate: minDate,
        		maxDate: maxDate,
        		value: this.value,
        		cancelButton: nls.picker.cancelButton
			}));
        	
			picker = new Ext.Sheet({
				left: '0',
				bottom: '0',
				right: '0',
                
				layout: {
					type : 'hbox',
					align: 'stretch'
				},
                
				items: [
				        uxDatePicker
				],
            	
				setValue: function(val) {
					uxDatePicker.setValue(val);
				},
                
				getValue: function() {
					return uxDatePicker.getValue();
				}
			});
            
			Ext.Viewport.add(picker);
			uxDatePicker.setToday();
		}
		
		uxDatePicker.on({
            scope: this,
            select: function() {
            	this.onPickerChange(this, uxDatePicker.getValue());
            	this.getPicker().hide();
            	this.getPicker().on('hide', function() {
                	this.onPickerHide();
                	this.pickerCtrl = null;
            	}, this);
            },
            cancel: function() {
            	this.getPicker().hide();
            	this.getPicker().on('hide', function() {
                	this.onPickerHide();
                	this.pickerCtrl = null;
            	}, this);
            }
        });
        
        picker.on({
            scope: this,
            change: 'onPickerChange',
            hide  : 'onPickerHide'
        });

        this.pickerCtrl = picker;
		
        return this.pickerCtrl;
    },
    
    getValue: function(format) {
        var value = this.value || null;
        if(value == null){
        	return value;
        }
        else{
        	return (format && Ext.isDate(value)) ? value.format(Ext.util.Format.defaultDateFormat)
        		: value.format('Ymd');
    	}
    },
});
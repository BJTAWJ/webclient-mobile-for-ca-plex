Ext.ns('wcli');
Ext.ns('wcli.field');

Ext.define('wcli.field.BaseText', {
	extend: 'Ext.field.Text',
	config: {
		extraControl: []
	},
	
	setElementBox: function(element, orient) {
        if (Ext.browser.is.WebKit) {
            element.dom.style.setProperty('display', '-webkit-box', null);
            element.dom.style.setProperty('-webkit-box-orient', orient, null);
        }
        else if (Ext.browser.is.IE) {
            element.dom.style.setProperty('display', '-ms-box', null);
            element.dom.style.setProperty('-ms-box-orient', orient, null);
        }
        else {
            element.dom.style.setProperty('display', 'box', null);
            element.dom.style.setProperty('box-orient', orient, null);
        }		
	},
	
	setElementFlex: function(element, flex) {
        if (Ext.browser.is.WebKit) {
            element.dom.style.setProperty('-webkit-box-flex', flex, null);
        }
        else if (Ext.browser.is.IE) {
            element.dom.style.setProperty('-ms-flex', flex + ' 0 0px', null);
        }
        else {
            element.dom.style.setProperty('flex', flex + ' 0 0px', null);
        }
	},
	
    setRendered: function(rendered) {
		this.callParent(arguments);
        
        var me = this;
    	var extraControl = this.getExtraControl();
    	if (extraControl) {
    		Ext.Array.each(extraControl, function(ctl) {
    			if(!ctl.renderTo) {
    				ctl = Ext.create(ctl);	
    			}
    			if (ctl.getComponent) {
    				ctl = ctl.getComponent();
    			}
   				ctl.renderTo(me.innerElement);
   				
   				me.setElementBox(me.innerElement, 'horizontal');
   				ctl.bodyElement.dom.style.setProperty('display', 'inline-block');

   				me.getComponent().bodyElement.dom.style.setProperty('width', 'auto');
   				me.setElementFlex(me.getComponent().bodyElement, 1);

   				ctl.bodyElement.dom.style.setProperty('width', 'auto');
   				me.setElementFlex(ctl.bodyElement, 0);
    		});
    	}
	}
});

/* wcli.form.number and wcli.form.text are currently not used. Needs to be revisited */
if(!Ext.os.is.iOS){
	var inputtype = "number";
}
else{
	var inputtype =  "text";
}
Ext.define('wcli.field.number', {
	extend: 'wcli.field.BaseText',
	xtype: ['wclinumberfield'],
	config: {
		controlName: {}
	},
	inputType: inputtype,
    minValue : undefined,
    maxValue : undefined,
    stepValue : undefined,
    renderTpl: [
        '<tpl if="label"><div class="x-form-label"><span>{label}</span></div></tpl>',
        '<tpl if="fieldEl"><div class="x-form-field-container">',
            '<input id="{inputId}" type="{inputType}" name="{name}" pattern="[0-9]*" class="{fieldCls}"', 
               '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
                '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
                //'<tpl if="placeHolder">placeholder="TEST" </tpl>',
                '<tpl if="style">style="{style}" </tpl>',
                '<tpl if="minValue != undefined">min="{minValue}" </tpl>',
                '<tpl if="maxValue != undefined">max="{maxValue}" </tpl>',
                '<tpl if="stepValue != undefined">step="{stepValue}" </tpl>',
                '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
                '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
                '<tpl if="autoFocus">autofocus="{autoFocus}" </tpl>',            '/>',
            '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
            '</div></tpl>',
        '<tpl if="useClearIcon"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">×</div><div></tpl>'    ],
        
    onFocus: function(e) {
    	wcli.form.number.superclass.onFocus.call(this, arguments);
    	
    	if (this.getValue() == "0") {
    		this.setValue("");
    	}
    },
    

    initEvents: function() {
        Ext.form.Text.prototype.initEvents.call(this);

        if (this.fieldEl) {
            this.mon(this.fieldEl, {
                keypress: this.onKeyPress,
                scope: this
            });
        }
    },
    
    onKeyPress: function(e) {
        this.fireEvent('keypress', this, e);
    }

});

Ext.define('wcli.form.htmlarea',{
	extend:'Ext.form.TextArea',
	xtype: ['wclihtmlarea'],
	config: {
		controlName: {}
	},
    setValue: function(value){
        this.value = value;

        if (this.rendered && this.fieldEl) {
        	if (this.fieldEl.dom.parentNode) {
        		this.htmlNode = this.fieldEl.dom.parentNode;
        		this.htmlNode.className = "x-form-field-container wcliHTMLArea";
        	}
        }
        
        if (this.htmlNode) {
            this.htmlNode.innerHTML = (Ext.isEmpty(value) ? ' ' : value);
        }

        return this;
    }
});

Ext.define('wcli.field.text',{
	extend: 'wcli.field.BaseText', 
	xtype: ['wclitextfield'],
	config: {
		controlName: {}
	},
    initEvents: function() {
        Ext.form.Text.prototype.initEvents.call(this);

        if (this.fieldEl) {
            this.mon(this.fieldEl, {
                keypress: this.onKeyPress,
                scope: this
            });
        }
    },
    
    onKeyPress: function(e) {
        this.fireEvent('keypress', this, e);
    }

});

Ext.define('wcli.field.Text',{
	extend: 'wcli.field.BaseText', 
	config: {
		controlName: {}
	},
});

Ext.define('wcli.field.Number',{
	extend: 'Ext.field.Number', 
	config: {
		controlName: {}
	},
});

Ext.define('wcli.field.SpinnerEdit',{
	extend: 'Ext.field.Spinner', 
	config: {
		controlName: {},
		wclicls: ''			// TODO
	},
});

/**
 * Called to automatically grow multiline edit based on input text
 */

	wcli.autoExpand = function(controlname) {
	   var textdiv = document.getElementById(controlname);
	   if (Ext.getCmp(controlname).xtype == "wclihtmlarea"){
		   var textarea = textdiv.firstElementChild
	   }
	   else{
		   var textarea = textdiv.firstElementChild.firstElementChild
	   }
	   var newHeight = textarea.scrollHeight;
	   var currentHeight = textarea.clientHeight;
	   
	   if (newHeight == 0 && currentHeight == 0){
		   textarea = textdiv.childNodes[1].firstElementChild;
		   newHeight = textarea.scrollHeight;
		   currentHeight = textarea.clientHeight;
	   }
	   
	   if(newHeight > currentHeight){
		   textarea.style.height = newHeight + 'px';
	   }
};

Ext.define('wcli.field.TextArea',{
	extend: 'Ext.field.TextArea', 
	config: {
		controlName: {}
	},
});

Ext.define('wcli.field.SearchField',{
	extend: 'Ext.field.Search', 
	config: {
		controlName: {}
	},
});
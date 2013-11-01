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
Ext.define('Ext.field.Integer', {
    extend:  Ext.field.Text ,
    xtype: 'integerfield',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        component: {
            type: 'number'
        },

        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'number'
    },

    proxyConfig: {
        /**
         * @cfg {Number} minValue The minimum value that this Number field can accept
         * @accessor
         */
        minValue: null,

        /**
         * @cfg {Number} maxValue The maximum value that this Number field can accept
         * @accessor
         */
        maxValue: null,

        /**
         * @cfg {Number} stepValue The amount by which the field is incremented or decremented each time the spinner is tapped.
         * Defaults to undefined, which means that the field goes up or down by 1 each time the spinner is tapped
         * @accessor
         */
        stepValue: null
    },

    doInitValue : function() {
        var value = this.getInitialConfig().value;

        if (value) {
            value = this.applyValue(value);
        }

        this.originalValue = value;
        this.getComponent().element.dom.firstChild.setAttribute("pattern","[0-9]*");
    },

    applyValue: function(value) {
        var minValue = this.getMinValue(),
            maxValue = this.getMaxValue();

        if (Ext.isNumber(minValue) && Ext.isNumber(value)) {
            value = Math.max(value, minValue);
        }

        if (Ext.isNumber(maxValue) && Ext.isNumber(value)) {
            value = Math.min(value, maxValue);
        }

        value = parseFloat(value);
        return (isNaN(value)) ? '' : value;
    },

    getValue: function() {
        var value = parseFloat(this.callParent(), 10);
        return (isNaN(value)) ? null : value;
    },

    doClearIconTap: function(me, e) {
        me.getComponent().setValue('');
        me.getValue();
        me.hideClearIcon();
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

Ext.define('wcli.field.Integer',{
	extend: 'Ext.field.Integer', 
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
		   textarea = textdiv.childNodes[1].firstElementChild.childNodes[0];
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
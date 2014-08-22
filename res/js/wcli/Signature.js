Ext.ns('wcli');

Ext.define('wcli.Signature',{
	extend: 'Ext.Component', 
	config: {
		name: '',
		controlName: {}
	},
	
	constructor: function(){
		this.callParent(arguments);
		this.on("painted", this.onPainted, this);
		this.isField = true;
	},
	
	onPainted: function(){
		var newCanvas = document.createElement("CANVAS");
		newCanvas.setAttribute("width", this.element.getWidth());
		this.element.appendChild(newCanvas);
		this.signaturePad = new SignaturePad(newCanvas);
		this.up('formpanel').setScrollable(false);
	},
	
	getValue: function(){
		var value = this.signaturePad.toDataURL();
		return value;
	}
});

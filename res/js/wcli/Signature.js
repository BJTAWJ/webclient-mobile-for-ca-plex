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
		newCanvas.setAttribute("width", "600px");
		this.element.dom.style.width = "600px";
		this.up('container').element.dom.style.width = "600px";
		this.up('container').element.dom.style.marginLeft = "auto";
		this.up('container').element.dom.style.marginRight = "auto";
		this.element.appendChild(newCanvas);
		this.signaturePad = new SignaturePad(newCanvas);
		this.up('formpanel').setScrollable(false);
	},
	
	getValue: function(){
		var value = "";
		if(this.signaturePad){
			value = this.signaturePad.toDataURL();
			if(this.signaturePad.isEmpty()){
				value = "";
			}
		}
		return value;
	}
});

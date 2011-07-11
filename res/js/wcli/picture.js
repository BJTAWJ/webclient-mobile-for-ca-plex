Ext.ns('wcli');

wcli.ImageComponent = Ext.extend(Ext.BoxComponent, {
	
	initComponent : function(){
		this.tpl = new Ext.XTemplate(
			'<div class ="{imageCls}" style="display: -webkit-box; -webkit-box-orient: horizontal; -webkit-box-pack: {imageAlign}; -webkit-box-align: {imageAlign}; display: box; box-orient: horizontal; box-pack: {imageAlign}; box-align: {imageAlign};"><img src="{imageSrc}"></img></div>'
		);
		this.update(this.imageData);

		// Call superclass
		wcli.ImageComponent.superclass.initComponent.call(this);
	} // end initComponent
	
});

// Register xtype
Ext.reg('imagecomponent', wcli.ImageComponent);
Ext.ns('wcli');

Ext.define('wcli.EditableGrid',{
	extend: 'Ext.List', 
	config: {
		controlName: {},
		modes: {},
		variableHeights: true
	},
	
	constructor : function(){
		this.callParent(arguments);
		this.rowChanges = [];
	},
	
	onTap: function(view, index, target, record, event){
		if(this.getModes().length > 0 && event.target && event.target.getAttribute("colindex") && this.getModes()[event.target.getAttribute("colindex")] == "rw" && event && event.$className == "Ext.event.Touch"){
			var orgValue = event.target.innerText;
			event.target.innerHTML = "";
			if(event.target.getAttribute("dataType") == "Double" || event.target.getAttribute("dataType") == "FixedDec"){
				var inputExt = Ext.create("wcli.field.Number", { renderTo: event.target});
				var input = inputExt.element.down('input');
			}
			else{
				var inputExt = Ext.create('wcli.field.TextArea', { renderTo: event.target });
				var input = inputExt.element.down('textarea');
			}
			
			input.dom.value = orgValue;
			var me = this;
			input.on('blur', function() {
				var colIndex = inputExt.element.dom.parentNode.getAttribute('colindex');
				var inputVal = input.getValue();
				if(inputVal == ""){
					event.target.innerHTML = "&nbsp;";
				}
				else{
					event.target.innerHTML = inputVal;
				}
				if(me.rowChanges[index] == undefined){
					me.rowChanges[index] = [];
				}
				me.rowChanges[index][colIndex] = inputVal; 
				me.fireEvent("changed", view, index)
			});
			input.dom.focus();
		}
	},
	
	getChanges: function() {
		var changes = "";	// (row-column)=data
		for (var rown=0; rown<this.rowChanges.length; rown++) {
			var row = this.rowChanges[rown];
			if (!row) {
				continue;
			}
			for (var coln=0; coln<row.length; coln++) {
				var data = row[coln];
				if (!data) {
					continue;
				}
				changes = changes + ",(" + rown + "-" + coln + ")=" + data;
			}
		}
		return changes;
	}
});

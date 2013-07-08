Ext.ns('wcli');

Ext.define('wcli.List',{
	extend: 'Ext.List', 
	config: {
		controlName: {},
		variableHeights: true
	},
});

Ext.define('wcli.NestedList',{
	extend: 'Ext.NestedList', 
	config: {
		controlName: {}
	},
});
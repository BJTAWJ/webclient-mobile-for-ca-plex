Ext.ns('wcli.TreeMenu');

wcli.TreeMenu.parseMenu = function(menuStr) {
	//take a string and return a store
	return new Ext.data.TreeStore({
		model: 'ListItem',
		root: wcli.TreeMenu.parseNode(menuStr).rootItems,
		proxy: {
			type: 'ajax',
			reader: {
				type: 'tree',
				root: 'items'
			}
		}
	});
};

wcli.TreeMenu.parseNode = function(menuStr){
	var rootItems = {}
	rootItems['text'] = "";
	rootItems['items'] = [];
	var i;
	for(i=0; i< menuStr.length; i++){
		if(menuStr[i] == "[" || menuStr[i] =="," || menuStr[i] == "]"){
			break;
		}
	}
	rootItems['text'] = menuStr.substr(0,i);
	if(menuStr[i] == "," || menuStr[i] == ']' || i == menuStr.length){
		rootItems['leaf'] = true;
		return {rootItems: rootItems, restString:menuStr.substr(i)};
	}
	var childMenu = menuStr.substr(i+1);
	while(childMenu.charAt(0) != "]"){
		var child = wcli.TreeMenu.parseNode(childMenu);
		rootItems['items'].push(child.rootItems);
		childMenu = child.restString;
		if(childMenu.charAt(0) == ","){
			childMenu = childMenu.substr(1);
		}
	}
	
	return {rootItems: rootItems, restString:childMenu.substr(1)};
}

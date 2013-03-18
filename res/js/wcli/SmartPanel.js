Ext.ns('wcli');

(function() {
	function _getMappedItem(name, map, items, def) {
		if (!map[name]) {
			map[name] = def;
			items.push(def);
		}
		return map[name];
	}
	
	function _alignToolbar(toolbar) {
		var left = toolbar.items.filter(function(n) {
			return (n.controlName.align||'left') === 'left';
		});
		var center = toolbar.items.filter(function(n) {
			return n.controlName.align === 'center';
		});
		var right = toolbar.items.filter(function(n) {
			return n.controlName.align === 'right';
		});
		var spacer = { xtype: 'spacer' };
		
		return left.concat([spacer], center, [spacer], right);
	}
	
	function _buildToolbarConfig() {}
	
	function _buildPanelConfig(plexConfig) {
		var config = {},
			header = plexConfig.header,
			body = plexConfig.body,
			hidden = plexConfig.hidden,
			fullscreen = plexConfig.fullscreen,
			toolbars = plexConfig.toolbars,
			tabs = plexConfig.tabs,
			footer = plexConfig.footer;
		// Toolbar items (always visible)
		config.dockedItems = [];

		var tbItems = [],
			tbMap = {};
		for (var i = 0; i < toolbars.length; i++) {
			var item = toolbars[i],
				num = item.controlName.toolbarNum,
				toolbar = _getMappedItem(num, tbMap, tbItems, {
					num: parseInt(num) || 1,
					items: []
				});
			toolbar.items.push(item);
		}
		tbItems.sort(function(a, b) { return a.num - b.num; });
		
		for (var i = 0; i < tbItems.length; i++) {
			config.dockedItems.push({
				xtype: 'toolbar',
				cls: 'toolbar' + tbItems[i].num,
				dock: 'top',
				scroll: 'horizontal',
				items: _alignToolbar(tbItems[i])
			});
		}
		// 2012-07-03 - Add header
		/*for (var h=0; h < plexConfig.header.length; h++) {
			config.dockedItems.push(plexConfig.header[h]);
		}
		// 2012-07-03 - Add footer
		for (var f=0; f < plexConfig.footer.length; f++) {
			config.dockedItems.push(plexConfig.footer[f]);
		} */
		// Tabs (always visible if present)
		if (tabs.length > 0) {
			config.dockedItems.push(new Ext.TabBar({
				dock: 'bottom',
				ui: 'dark',
				items: tabs
			}));
		}
		
		// Body items (only visible if the panel isn't "fullscreen")
		config.items = hidden.slice(0);
		if (fullscreen.length === 0) {
			var bodyItems = [],
				bodyMap = {};
			for (var i = 0; i < body.length; i++) {
				var item = body[i];
				if(item.hidden == false || item.hidden == undefined){
					var	name = item.controlName.fieldSet || '';
					if (name.substr(0,1) == "$"){
						name = customNLS.title[name];
					}
					var	fieldSet = _getMappedItem(name, bodyMap, bodyItems, {
							name: name,
							items: []
						});
					fieldSet.items.push(item);
				}
			}
			for (var i = 0; i < bodyItems.length; i++) {
				config.items.push({
					xtype: 'fieldset',
					title: bodyItems[i].name.trim() || undefined,
					items: bodyItems[i].items
				});
			}
		} else {
			// Fullscreen items.  Only display the first one instantiated (can't
			// have more than one fullscreen control at a time!)
			var hidden = body.filter(function(n) { return n.hidden; });
			config.bodyMargin = config.bodyPadding = 0;
			config.scroll = false;
			config.items = [fullscreen[0]].concat(hidden);
		}
		return config;
	}
	
	wcli.SmartPanel = Ext.extend(Ext.form.FormPanel, {
		submitOnAction: false,
		
		constructor: function(config) {
			var plexConfig = config.plexConfig;
			Ext.apply(config, _buildPanelConfig(plexConfig));
			
			wcli.SmartPanel.superclass.constructor.call(this, config);
		},
		
		// The default getFields does not include docked items
		getFields: function (byName) {
			var base = wcli.SmartPanel.superclass.getFields,
	        	bodyFields = base.call(this, byName),
	        	toolbarFields = base.call({ items: this.dockedItems }, byName);
			
	        return Ext.apply(bodyFields, toolbarFields);
	    }
	});
})();

Ext.reg('smartpanel', wcli.SmartPanel);
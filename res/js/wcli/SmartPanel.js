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
			return (n.getControlName().align||'left') === 'left';
		});
		var center = toolbar.items.filter(function(n) {
			return n.getControlName().align === 'center';
		});
		var right = toolbar.items.filter(function(n) {
			return n.getControlName().align === 'right';
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
		config.items = [];

		var tbItems = [],
			tbMap = {};
		for (var i = 0; i < toolbars.length; i++) {
			var item = toolbars[i],
				num = item.getControlName().toolbarNum,
				toolbar = _getMappedItem(num, tbMap, tbItems, {
					num: parseInt(num) || 1,
					items: []
				});
			toolbar.items.push(item);
		}
		tbItems.sort(function(a, b) { return a.num - b.num; });
		
		for (var i = 0; i < tbItems.length; i++) {
			config.items.push({
				xtype: 'toolbar',
				cls: 'toolbar' + tbItems[i].num,
				docked: 'top',
				scroll: 'horizontal',
				items: _alignToolbar(tbItems[i])
			});
		}
		if(plexConfig.header){
		// 2012-07-03 - Add header
			for (var h=0; h < plexConfig.header.length; h++) {
				config.items.push(plexConfig.header[h]);
			}
		}
		if(plexConfig.footer){
			// 2012-07-03 - Add footer
			for (var f=0; f < plexConfig.footer.length; f++) {
				config.items.push(plexConfig.footer[f]);
				plexConfig.footer[f].docked = "bottom";
			}
		}
		// Tabs (always visible if present)
		if (tabs.length > 0) {
			config.items.push(new Ext.TabBar({
				docked: 'bottom',
				ui: 'dark',
				items: tabs
			}));
		}
		
		// Body items (only visible if the panel isn't "fullscreen")
		hidden.slice(0).forEach(function(item) {
			config.items.push(item);
		});
		if (fullscreen.length === 0) {
			var bodyItems = [],
				bodyMap = {};
			for (var i = 0; i < body.length; i++) {
				var item = body[i],
					name = item.getControlName().fieldSet || '',
					fieldSet = _getMappedItem(name, bodyMap, bodyItems, {
						name: name,
						items: []
					});
				fieldSet.items.push(item);
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
			config.scrollable = false;
			config.height = "100%";
			config.width = "100%";
			config.layout = "vbox";
			config.flex = 1;
			config.items.push(fullscreen[0]);
			hidden.forEach(function(item) {
				config.items.push(item);
			});
		}
		return config;
	}
	
	Ext.define('wcli.SmartPanel', {
		extend: 'Ext.form.FormPanel',

		submitOnAction: false,
		
		constructor: function(config) {
			var plexConfig = config.plexConfig;
			Ext.apply(config, _buildPanelConfig(plexConfig));
			
			wcli.SmartPanel.superclass.constructor.call(this, config);
		},
		
		// The default getFields does not include docked items
		getFields: function (byName) {
			var pnl = this;
			var base = wcli.SmartPanel.superclass.getFields,
	        	bodyFields = base.call(this, byName),
	        	toolbarFields = base.call({ getItems: function() {
	        		var dockedItems = new Ext.ItemCollection();
	        		pnl.getDockedItems().forEach(function(item) {
	        			dockedItems.add(item);
	        		});
	        		return dockedItems;
	        	}}, byName);
			
	        return Ext.apply(bodyFields, toolbarFields);
	    },
	    
	    // Not using the mask feature in Sencha Touch 2.2
	    setMasked: function() {
	    	// Do nothing
	    }
	});
})();
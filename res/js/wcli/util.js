Ext.ns('wcli');

wcli.util = (function() {
	function _esc(str) {
		return str.replace(/ /g, "_");
	}
	
	function util() {
	}
	
	Ext.apply(util.prototype, {
		/**
		 * Returns an options object for an Ext.Ajax.Request options parameter
		 * @param {String} evt The plex event name
		 * @param {String} id The NameID of the control recieving the event
		 * @return {Object} An options object for an Ext.Ajax.Request
		 */
		evt: function(evt, id, params) {
			return {
				params: Ext.apply({
					pnlid: panel.panelId,
					_type: "json",
					ctlact: id + ":" + evt,
					focus: id
				}, params),
				success: function(form, result) {
					if (result.alerts.length > 1) {
						var alerts = result.alerts;
						alerts.pop();
						(function display() {
							if (result.alerts.length > 0) {
								Ext.Msg.alert('Alert', alerts.pop(), display);
							}
						})();
					}
					else if (result.refresh && result.panelId != panel.panelId) {
						eval(result.init).call(window);
						var panelConfig = eval(result.refresh);
						var newPanel = Ext.create(panelConfig);
						
						controller.on('cardswitch', function() {
							panel.destroy();
							window.panel = newPanel;
						}, { single: true });
						controller.setActiveItem(newPanel/*, 'slide'*/);
						eval(result.postInit).call(window);
					}
					else {
						// No point in setting values after a refresh...
						wcli.util.parseStates(result.states);
						panel.setValues(result.values);
					}
				}
			};
		},
		
		parseStates: function(states) {
			states = states || {};
			for (var key in states) {
				if (states.hasOwnProperty(key)) {
					var ctl = panel.getFields(key);
					if (!ctl || ctl.length === 0) {
						ctl = Ext.getCmp(key);
					}
					wcli.util.parseState(ctl, states[key]);
				}
			}
		},
		
		parseState: function(control, state) {
			if (!control) {
				return;
			}
			
			if (state.optionNames && state.optionValues) {
				var names = state.optionNames,
					values = state.optionValues,
					items = [];
				
				for (var i = 0; i < names.length; i++) {
					items.push({ text: names[i], value: values[i] });
				}
				control.setOptions(items, false);
			}
			
			if (state.gridCols && state.gridRows) {
				var store = window[control.name + '_store'],
					storeConf = wcli.util.gridStore(control.name,
						state.gridCols, state.gridRows);
				store.loadData(storeConf.data);
			}
			
			if (typeof state.disabled !== 'undefined') {
				control[state.disabled ? 'disable' : 'enable']();
			}
			
			if (state.location) {
				var coords = wcli.util.getCoords(state.location),
					marker = window[control.id + '_marker'];
				setTimeout(function() {
					marker.setAnimation(google.maps.Animation.DROP);
					marker.setPosition(coords);
				}, 2000);
				control.update(coords);
			}
			
			if (state.childPanel) {
				var panelConfig = eval(state.childPanel);
				control.removeAll();
				control.add(panelConfig);
			}
		},
		
		htmlEncode: function(str) {
			var dummy = document.createElement('div');
			dummy.innerText = str;
			return dummy.innerHTML;
		},
		
		htmlDecode: function(str) {
			var dummy = document.createElement('div');
			dummy.innerHTML = str;
			return dummy.innerText;
		},
		
		parseControlName: function(cname) {
			var res = {},
				params = cname.split(':');
			
			for (var i = 0; i < params.length; i++) {
				var keyValue = params[i].split('='),
					key = keyValue[0],
					val = keyValue[1];
				if (key && val) {
					res[key] = val;
				}
			}
			
			return res;
		},
		
		regModel: function(name, cols) {
			cols = JSON.parse(cols);

			var model = {
				fields: [{
					name: '$$idx$$',
					type: 'number'
				}]
			};
			
			for (var i = 0; i < cols.length; i++) {
				model.fields.push({ name: cols[i], type: 'string' });
			}
			
			Ext.regModel(name, model);
		},
		
		/**
		 * Generates a row template for the given column definitions
		 * @param {String} cols A stringified column definition array
		 * @return {String} A row template for a List control
		 */
		gridTpl: function(cols, heads, grouped) {
			cols = JSON.parse(cols);
			if (grouped) {
				cols.shift();
			}
			
			var tpl = "";
			tpl += "<div>";
			tpl += "<h1>{" + _esc(cols[0]) + "}</h1>";
			tpl += "</div><div>";
			for (var i = 1; i < cols.length; i++) {
				var c = _esc(cols[i]);
				var h = heads[i];
				tpl += "<span><p><b>" + h + "</b>: {" + c + "}</p></span>";
			}
			tpl += "</div>";
			return tpl;
		},
		
		gridStore: function(model, cols, rows) {
			if (typeof cols === 'string') {
				cols = JSON.parse(cols);
			}
			if (typeof rows === 'string') {
				rows = JSON.parse(rows);
			}
			
			var store = {
				model: model,
				groupField: _esc(cols[0]),
				sorters: _esc(cols[0]),
				data: []
			};
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i],
					item = {};
				for (var j = 0; j < row.length; j++) {
					var name = cols[j];
					item[_esc(name)] = row[j].v;
				}
				item['$$idx$$'] = i;
				store.data.push(item);
			}
			
			return store;
		},
		
		getDate: function(dateStr) {
			var year, month, day;
			
			if (!dateStr) {
				return null;
			}
			else if (dateStr.length == 8) {
				year = parseInt(dateStr.substring(0, 4));
				month = parseInt(dateStr.substring(4, 6));
				day = parseInt(dateStr.substring(6, 8));
			}
			else if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
				var sections = dateStr.split(/[-TZ]/g);
				year = parseInt(sections[0]);
				month = parseInt(sections[1]);
				day = parseInt(sections[2]);
			}
			
			return new Date(year, month - 1, day);
		},
		
		getCoords: function(coordsStr) {
			var coords = coordsStr.split(','),
				long, lat;
			if (coords.length >= 2) {
				lat = parseFloat(coords[0].trim());
				long = parseFloat(coords[1].trim());
			}
			else {
				lat = 30.238339;
				long = -97.879745;
			}
				
			return new google.maps.LatLng(lat, long);
		}
	});
	
	return new util();
})();

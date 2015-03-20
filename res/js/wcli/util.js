Ext.ns('wcli');
Ext.ns('wcli.msg');

Ext.util.JSON.decode = function(s) {
	return eval("(" + s + ")");
};

Ext.decode = Ext.util.JSON.decode;
/*
wcli.msg.alert = function(title, msg, fn, scope) {
	return new Ext.Msg.alert({
        width: 320,	
        title : title,
        msg : msg,
        buttons: Ext.MessageBox.OK,
        fn: function(button) {
            fn.call(scope, button);
        },
        scope : scope
    });
};
*/
wcli.msg.YES = {text : nls.msg.yesButton,    itemId : 'yes', ui : 'action' };
//wcli.msg.NO = {text : nls.msg.noButton,    itemId : 'no'};
wcli.msg.CANCEL = {text : nls.msg.cancelButton,    itemId : 'cancel'};

wcli.msg.confirm = function(title, message, buttons, fn, scope) {
    return Ext.Msg.show({
        title       : title || null,
        message     : message || null,
        buttons     : buttons,
        promptConfig: false,
        scope       : scope,
        fn: function() {
            if (fn) {
                fn.apply(scope, arguments);
            }
        }
    });
};

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
		    wcli.startLoading();
			return {
				method: "POST",
				disableCaching: true,
				params: Ext.apply({
					pnlid: panel.panelId,
					_type: "json",
					ctlact: id + ":" + evt,
					focus: id
				}, params),
				success: function(form, result) {
		            wcli.stopLoading();
					/* Begin create new input field for IOS bug workaround keyboard not displaying on the first numeric field */
		            
		            //var inputField = document.createElement("INPUT");
		            //document.getElementsByTagName("BODY")[0].appendChild(inputField);
		            //inputField.focus();
		            //document.getElementsByTagName("BODY")[0].removeChild(inputField);
		  
					/* End create new input field */
					
					if (result.alerts.length > 1) {
						var alerts = result.alerts;
						alerts.pop();
						var allmessages = "";
						for (var i=0; i<alerts.length; i++){
							if (alerts[i].type == "dialog"){
								if (alerts[i].message != undefined){
									allmessages = allmessages +  alerts[i].message + "</br>";
								}
								if(i == (alerts.length-1)){
									Ext.Msg.alert('', allmessages, function() {									
									});
								}
							}
							
							if (alerts[i].type == "enquiry"){
								wcli.msg.confirm('', alerts[i].message, [wcli.msg.YES,wcli.msg.CANCEL],function(btn) {
									if(btn == "yes"){
										panel.submit(wcli.util.evt(null, null, { enqact: 1 }));
									}
									if(btn == "no"){
										panel.submit(wcli.util.evt(null, null, { enqact: 2 }));
									}
									if(btn == "cancel"){
										panel.submit(wcli.util.evt(null, null, { enqact: 3 }));
									}
								});
							}
						}
					}
					if (result.refresh && result.panelId != panel.panelId) {
						eval(result.init).call(window);
						var panelConfig = eval(result.refresh);
						
						var newPanel = Ext.create('wcli.SmartPanel',panelConfig);
						newPanel.panelId = panelConfig.panelId;
						controller.on('activeitemchange', function() {
							console.log("WCLI: panel " + panel.id + " destroyed");
							panel.destroy();
							delete panel.link;	// sencha touch 2.2 bug
							window.panel = newPanel;
							console.log("WCLI: new panel " + panel.id);
							
							wcli.util.addCSSArea(panelConfig.cssArea);
							panelConfig.jsOnLoad();
							
							if(Ext.browser.is.IE){
								setTimeout(function() {
									Ext.DomQuery.select('.x-translatable-hboxfix').forEach(function(dom) { dom.style.height = '0'; }); 
								}, 100);
								setTimeout(function() {
									Ext.DomQuery.select('.x-translatable-hboxfix').forEach(function(dom) { dom.style.height = '100%'; });
								}, 200);
							}
							
						},null, { single: true });
						if (typeof panel.config.transition != "undefined") {
							controller.animateActiveItem(newPanel, {
								type: panel.config.transition, 
								direction: panel.config.transdir, 
								duration: parseInt(panel.config.transduration)
							});	
						} else {
							controller.setActiveItem(newPanel);
						}
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
				var store = window[control.getName() + '_store'],
					storeConf = wcli.util.gridDataStore(control.getName(),
						state.gridCols, state.gridRows, false);
				store.clearData();
				store.addData(storeConf.data);
				
				var storeColModes = wcli.util.gridModeStore(control.getName(),
						state.gridCols, state.gridRows);
				window[control.getName() + '_store'].colModes = storeColModes;
				if (typeof yourFunctionName == 'setModes'){
					Ext.ComponentQuery.query('list[name=' + control.getName() + ']')[0].setModes(storeColModes);
				}
			}
			
			if (typeof state.disabled !== 'undefined') {
				control[state.disabled ? 'disable' : 'enable']();
			}
			if (typeof state.visible !== 'undefined') {
				control[state.visible ? 'show' : 'hide']();
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

			var model = {
				extend: 'Ext.data.Model',
				
				config: {
					fields: [{
						name: '$$idx$$',
						type: 'number'
					}]
				}
			};
			
			for (var i = 0; i < cols.length; i++) {
				model.config.fields.push({ name: cols[i], type: 'string' });
			}
			
			Ext.define(name,model);
		},
		
		/**
		 * Generates a row template for the given column definitions
		 * @param {String} cols A column definition array
		 * @return {String} A row template for a List control
		 */
		gridTpl: function(cols, colvis, heads, grouped) {
			var tpl = "";
			tpl += "<table>";
			
			if (grouped) {
				cols.shift();
				colvis.shift();
				heads.shift();
				
				for (var i = 0; i < cols.length; i++) {
					if(colvis[i]==true){
						var c = _esc(cols[i]);
						var h = heads[i].colHeader;
						tpl += "<tr><th>" + h + "</th><td>{" + c + "}</td></tr>";
					}
				}
			}
			else{
				for (var i = 0; i < cols.length; i++) {
					if(colvis[i]==true){
						var c = _esc(cols[i]);
						tpl += "<tr><td>{" + c + "}</td></tr>";
					}
				}
				
			}
			tpl += "</table>";
			return tpl;
		},
		
		dateConvert: function(input) {
		     var format = 'yyyy-mm-dd'; // default format
		     var parts = input.match(/(\d+)/g),
		     			i = 0, fmt = {};
		     format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

		     return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
		},
		
		gridHdr: function(cols, colvis, heads, grouped, gridclass){
			var tpl = "";
			tpl += "<table class='" + gridclass + "h'><tr class='head" + "'>";
			for (var i = 0; i < cols.length; i++){
				if(colvis[i]==true){
					var h = heads[i].colHeader;
					tpl += "<th class='col" + i + "'>" + h + "</th>";
				}
			}
			tpl += "</tr></table>";	
			return tpl;
		},
		
		gridCol: function(cols, colvis, heads, grouped, gridclass){		
			var tpl = "";
			
			tpl += "<table class='" + gridclass + "'><tr>";
			for (var i = 0; i < cols.length; i++){
				if(colvis[i]==true){
					var c = cols[i];
					var dataType = heads[i].dataType;
					if (dataType == "Date") {
						c = "[Ext.Date.format(wcli.util.dateConvert(values[\"" + c + "\"]), Ext.util.Format.defaultDateFormat)]";
					}
					//if (dataType == "FixedDec" || dataType == "Double"){
					//	c = c.toFixed(2);
					//}
					tpl += "<td class='col" + i + "'>{" + c + "}</td>";
				}
			}
			tpl += "</tr></table>";	
			return tpl;
		},
		
		gridColHdr: function(cols, colvis, heads, grouped, gridclass){
			var tpl = "";
			
			for (var i = 0; i < cols.length; i++){
				if (i % 3 == 0) {
					tpl += "<table class='" + gridclass + "h'><tr class='head" + i + "'>";
				}
				if(colvis[i]==true){
						var h = heads[i].colHeader;
						tpl += "<th class='col" + i + "'>" + h + "</th>";
				}
				if (i % 3 == 2){
					tpl += "</tr></table>";
				}
			}
			if (i % 3 != 2) {
				tpl += "</tr></table>";				
			}
			return tpl;
		},
		
		gridColTpl: function(cols, colvis, heads, grouped, gridclass){			
			var tpl = "";
			
			for (var i = 0; i < cols.length; i++){
				if(i %3 == 0){
					tpl += "<table class='" + gridclass + "'><tr>";
				}
				if(colvis[i]==true){
					var c = cols[i];
					var dataType = heads[i].dataType;
					if (dataType == "Date") {
						c = "[Ext.Date.format(wcli.util.dateConvert(values[\"" + c + "\"]), Ext.util.Format.defaultDateFormat)]";
					}
					//if (dataType == "FixedDec" || dataType == "Double"){
					//	c = c.toFixed(2);
					//}
					tpl += "<td class='col" + i + "' colIndex='" + i + "' dataType='" + dataType + "'>{" + c + "}</td>";
				}
				if (i % 3 == 2){
					tpl += "</tr></table>";
				}
			}
			if (i % 3 != 2) {
				tpl += "</tr></table>";				
			}
			return tpl;
		},
		
		gridDataStore: function(model, cols, rows, grouped) {
			if (typeof cols === 'string') {
				cols = JSON.parse(cols);
			}
			if (typeof rows === 'string') {
				rows = JSON.parse(rows);
			}
			
			var store = {
				model: model,
				data: []
			};
			
			if (grouped) {
		    	var property = _esc(cols[0]);

		    	store.grouper = Ext.create('Ext.util.Grouper', {
		    		property: property,
		    		direction: 'ASC',
		    		sorterFn: function(item1, item2) {
		    			return item1.get('$$idx$$') - item2.get('$$idx$$');
		    		}
		    	});
				store.sorters = [
				  /*  {
				    	sorterFn: function(record1,record2) {
				    		var name1 = record1.data[property].charAt(0);
				    		var name2 = record2.data[property].charAt(0);
				    		if (isNaN(parseInt(name1)) == true && isNaN(name2) == false) {
				    			return 1;
				    		} else if (isNaN(name1) == false && isNaN(parseInt(name2)) == true) {
				    			return -1;
				    		} else {
					    		if(name1 < name2){
					    			return 1
					    		}
					    		else if(name1 > name2){
					    			return -1
					    		}
					    		else{
					    			return 0
					    		}
				    		}
				    	}
				    } */
				];
			}
			
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var	item = {};
			
				for (var j = 0; j < row.length; j++) {
					var name = cols[j];
					item[_esc(name)] = row[j].v;
				}
				item['$$idx$$'] = i;
				store.data.push(item);
			}
			
			return store;
		},
		
		gridModeStore: function(model, cols, rows) {
			if (typeof cols === 'string') {
				cols = JSON.parse(cols);
			}
			if (typeof rows === 'string') {
				rows = JSON.parse(rows);
			}
			
			var colModes = [];
			
			if(rows.length > 0){
				var row = rows[0];
				var	item = {};
				for (var j = 0; j < cols.length; j++) {
					var name = cols[j];
					colModes[j] = row[j].m;
				}
			}
			return colModes;
		},
		
		getDate: function(dateStr) {
			var year, month, day;
			
			if (!dateStr) {
				return null;
			}
			else if (dateStr.length == 8) {
				year = parseInt(dateStr.substring(0, 4), 10);
				month = parseInt(dateStr.substring(4, 6), 10);
				day = parseInt(dateStr.substring(6, 8), 10);
			}
			else {
				year = parseInt(dateStr.substring(0, 4), 10);
				month = parseInt(dateStr.substring(5, 7), 10);
				day = parseInt(dateStr.substring(8, 10), 10);
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
		},
		
		addCSSArea: function(cssArea) {
			var links = document.getElementsByTagName("LINK");
			var linkExist = false;
			for(var i=0; i<links.length; i++){
				if(links[i].href.indexOf(cssArea) != -1){
					linkExist = true;
					break;
				}
			}
			if(linkExist == false){
				cssArea.forEach(function(css) {
					Ext.DomHelper.append(Ext.getBody(), { tag: 'link', rel: 'stylesheet', type: 'text/css', href: css });
				});
			}
		}
	});
	
	   /* Timer used to display mask when data is loading. */
	   //wcli.loadTimer = null;

	   /* The amount of time in milliseconds before the load mask should appear. */
	   wcli.LOADMASK_TIME = 350;

	   /**
	    * Called when a server request is started. If the request is not finished
	    * within LOADMASK_TIME milliseconds, then the loading mask will appear.
	    */
	
		
	   wcli.startLoading = function() {
	       if (wcli.loadTimer) {
	           clearTimeout(wcli.loadTimer);
	       }
	       wcli.loadTimer = setTimeout(function() {
	           Ext.Viewport.setMasked({
	        	   xtype:'loadmask',
	        	   message:'',
	           });
	           wcli.loadTimer = null;
	       }, wcli.LOADMASK_TIME);
	   };
	
	
	   /**
	    * Called when a server request has stopped. If the loading mask is shown
	    * it will disappear.
	    */
	   
	   wcli.stopLoading = function() {
	       Ext.Viewport.setMasked(false);
	       if (wcli.loadTimer) {
	           clearTimeout(wcli.loadTimer);
	           wcli.loadTimer = null;
	       }
	   };
	   
	   /*
	   wcli.hideKeyboard = function(){
		   var activeElement = document.activeElement;
	        activeElement.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
	        activeElement.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
	        Ext.defer(function() {
	            activeElement.blur();
	            // Remove readonly attribute after keyboard is hidden.
	            activeElement.removeAttribute('readonly');
	            activeElement.removeAttribute('disabled');
	        }, 100);
	   };
	   */
	
	  
	   
	   /**
	    * Validate input maxlength to prevent user enter more than specified length
	    */
	   
	   wcli.validateMaxLength = function(controlname){
		   var input = Ext.getCmp(controlname);
		   var maxlength = input.maxLength; 
		   var value = Ext.getCmp(controlname).getValue();
		   var length = value.length;
		   if (!maxlength){
			   return
		   }
		   if (length>=maxlength){
			   window.event.preventDefault();
			   window.event.stopPropagation();
		   }
	   };
	return new util();
})();

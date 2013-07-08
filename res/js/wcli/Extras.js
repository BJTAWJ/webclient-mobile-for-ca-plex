Ext.ns('wcli');

Ext.define('wcli.Component', {
	extend: 'Ext.Component',
	config: {
		controlName: {}
	},
});

Ext.define('wcli.ContactButton', {
	extend: 'wcli.Button',
	config: {
		contactUrl: {},
		contactName: {},
		contactType: 'Contact',
		confirmContact: false,
		handler: function(b, e) {
			debugger;
			if (b.getConfirmContact()) {
				Ext.Msg.confirm('Contact', b.getContactType() + ' ' + b.getContactName() + '?', function(res){
	                if (res == 'yes') {
	                    window.location = b.getContactUrl();
	                }
	            }, this);	
			} else {
				window.location = b.getContactUrl();
			}		
		}
	},
});

Ext.define('wcli.ExternalURL', {
	extend: 'Ext.Component',
	config: {
		controlName: {},
		closePnl: function(pnlId) {
			console.log('Closing panel ' + pnlId);
			panel.submit(wcli.util.evt('Query Close', pnlId));
		}	
	}
});

Ext.define('wcli.Audio', { // reserved for future use
	extend: 'Ext.Audio',
	config: {
		controlName: {},
		url: {},
		enableControls: true,
		preload: false,
	}
});

Ext.define('wcli.Video', { // reserved for future use
	extend: 'Ext.Video',
	config: {
		controlName: {},
		url: {},
		layout: 'fit',
		enableControls: true,
		preload: false,
		width: '100%'
	}
});

Ext.define('wcli.Cookie', { // reserved for future use
	extend: 'Ext.field.Hidden',
	config: {
		controlName: {}
	},
	
	setPlexCookie: function(ckName, ckValue) {
		// Save the value as a cookie, or clear if empty string
		panel.setValues({ ckName: ckValue });
		if (ckValue=="") {
			this.clearCookie(ckName);
		} else {
			this.setCookie(ckName, ckValue, 1000);
		}
		// signal to application that Cookie was saved
		panel.submit(wcli.util.evt("Updated", ckName));
		return ckValue;
	},
	
	setCookie: function(ckName, ckValue, expDays) {
		var expDate = new Date();
		expDate.setDate(expDate.getDate() + expDays);
		var ckValue = escape(ckValue) + ((expDays==null) ? "" : "; expires=" + expDate.toUTCString());
		document.cookie=ckName + "=" + ckValue;
	},	
	
	getCookie: function(ckName) {
		ckName += "=" ;
		var ckArray = document.cookie.split(';');
		for(var i = 0; i < ckArray.length; i++) {
			var ck = ckArray[i];
			while (ck.charAt(0)==' ') {
				ck = unescape(ck.substring(1,ck.length));
			}
			if (ck.indexOf(ckName) == 0) {
				return unescape(ck.substring(ckName.length,ck.length));
			}
		}
		return null;
	},
	
	clearCookie: function(ckName) {
		this.setCookie(ckName, "", -1) ;
	}
});

Ext.define('wcli.Map', {
	extend: 'Ext.Map',
	config: {
		controlName: {},
		flex: 1,
		mapType: {},
		centerCoords: {},
		zoomLevel: {},
		markerText: {},
		centerMarker: {},
		updateMap: function(newCoords, newType, newZoom) {
			mapCtrl = this.getMap();
			if (newZoom != mapCtrl.getZoom()) {
				this.setZoomLevel(newZoom);
				mapCtrl.setZoom(newZoom);
			}
			if (newType != mapCtrl.getMapTypeId()) {
				this.setMapType(newType);
				mapCtrl.setMapTypeId(newType);
			}
			this.setCenterCoords(newCoords) ;
			mapCtrl.setCenter(newCoords);
			this.getCenterMarker().setPosition(newCoords);
		},
		listeners: {
			initialize: function() {
				this.setCenterMarker(new google.maps.Marker({
					position: this.getCenterCoords(),
					map: this.getMap(),
					title: this.getMarkerText(),
					animation: "drop",
					infoWindow: new google.maps.InfoWindow({
				    	content: this.getMarkerText()
					})
				}));
			},
			maprender: function() {
				//this.getCenterMarker().setMap(this.map);
				google.maps.event.addListener(this.getCenterMarker(), 'click', function() {
					this.infoWindow.open(this.map, this);
				});
				// Fix for not repositioning correctly
				self = this;
				Ext.defer(self.getUpdateMap().call(self), 300, self, [self.getCenterCoords(), self.getMapType(), parseFloat(self.getZoom())]);
				// Fix for when map is not redrawn correctly
				//setTimeout('google.maps.event.trigger(Ext.getCmp("/(!NameID)").map, "resize")', 100);
				setTimeout('google.maps.event.trigger(this.getMap(), "resize")', 100);
			}
		}
	}
});

/*
Ext.define('wcli.Media', {
	extend: 'Ext.Media',
	config: {
		controlName: {},
		//items: Ext.os.is.Android ? [
		items: Ext.os.is.Desktop ? [
            {
				xtype: 'button',
				text: 'Loading...',
				disabled: true,
				ui: 'plain',
				disclose: false,
				handler: function() {
					console.log('setting up audio button handler');
					var parCtrl = this.getParent().getParent();
					playCtrl = parCtrl.down((typeof device!= 'undefined' && device.version <= '2.2') ? 'video' : 'audio');
					playCtrl.toggle();
					this.setText(audio.isPlaying() ? 'Pause' : 'Play');
				}
			},
     		{
     			//xtype: (typeof device!= 'undefined' && device.version <= '2.2') ? 'video' : 'audio',
				//enableControls: (typeof device!= 'undefined' && device.version <= '2.2') ? true : false,
				xtype: 'audio',
				enableControls: true,
     			preload: false,
     			url: function() {
     				debugger;
     				console.log('getting url for button playback');
     				var parCtrl = this.getParent().getParent();
     				return parCtrl.getUrl();
     			},
     			playBtn: function() {
     				console.log('getting playback button');
     				var parCtrl = this.getParent();
     				return parCtrl.up('button');
     			},
     			//height: 0,
     			listeners: {
     				painted: function() {
     					debugger;
     					console.log('showing button');
     					self = this;
     					playEl = this.el.dom.firstElementChild;
     					playEl.addEventListener('error', function() {
     						Ext.Msg.alert('', playEl.error);
     					});
     					playEl.addEventListener('playing', function() {
     						//playBtn = this.prev(); //playBtn = Ext.getCmp(this.getPlayBtnId());
     						playBtn = this.getPlayBtn();
     						playBtn.setText('Pause');
     					});
     					playEl.addEventListener('pause', function() {
     						//playBtn = this.prev(); //playBtn = Ext.getCmp(this.getPlayBtnId());
     						playBtn = this.getPlayBtn();
     						playBtn.setText('Play');
     					});
     					playEl.addEventListener('canplay', function() {
     						//playBtn = this.prev(); //playBtn = Ext.getCmp(this.getPlayBtnId());
     						playBtn = this.getPlayBtn();
     						playBtn.setText('Play');
     						playBtn.setDisabled(false);
     					});
     					playEl.addEventListener('ended', function() {
     						//playBtn = this.prev(); //playBtn = Ext.getCmp(this.getPlayBtnId());
     						playBtn = this.getPlayBtn();
     						playBtn.setText('Restart');
     						playEl.currentTime = 0.1;
     					});
     					playEl.addEventListener('stalled', function() { // workaround
     						//playBtn = this.prev(); //playBtn = Ext.getCmp(this.getPlayBtnId());
     						playBtn = this.getPlayBtn();
     						playBtn.setText('Play');
     						playBtn.setDisabled(false);
     					});
     				}
     			}
     		}
     	] : [ 
     		{
     			xtype: 'audio',
     			url: function() {
     				debugger;
     				console.log('getting url for audio');
     				var parCtrl = this.getParent().getParent();
     				return parCtrl.getUrl();
     			},
     			preload: false,
     			listeners: {
     				painted: function() {
     					console.log('showing audio');
     					playEl = this.el.dom.firstElementChild;
     					playEl.removeAttribute('hidden'); // Sencha 1.1 generating wrong attribute
     				}
     			}
     		}	
     	]
	},
});
*/
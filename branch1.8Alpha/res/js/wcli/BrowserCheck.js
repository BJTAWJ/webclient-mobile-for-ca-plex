if(navigator.appVersion.indexOf("Chrome") != -1){
	document.getElementsByTagName("html")[0].className = "st_chrome";
}
if(Ext.is.Desktop == true && navigator.appVersion.indexOf("Chrome") != -1){
	document.getElementsByTagName("html")[0].className = "st_chromeDesktop";
}

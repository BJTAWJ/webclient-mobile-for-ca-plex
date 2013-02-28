Ext.ns('nls');
Ext.ns('nls.msg');
Ext.ns('nls.picker');

nls.language = window.navigator.language.substr(0, 2);

nls.msg.en = {
		yesButton: 'Yes',
		noButton: 'No',
		cancelButton: 'Cancel',
		okButton: 'OK'
};

nls.msg.de = {
		yesButton: 'Ja',
		noButton: 'Nein',
		cancelButton: 'Abbrechen',
		okButton: 'OK'
};

nls.msg.it = {
		yesButton: 'Sì',
		noButton: 'No',
		cancelButton: 'Annullare',
		okButton: 'OK'
};

nls.msg.fr = {
		yesButton: 'Oui',
		noButton: 'Non',
		cancelButton: 'Annuler',
		okButton: 'OK'
};

nls.msg.nl = {
		yesButton: 'Ja',
		noButton: 'Nee',
		cancelButton: 'Annuleren',
		okButton: 'OK'
};
Ext.apply(nls.msg, nls.msg[nls.language]);

nls.picker.en = {
		doneButton :'OK',
		cancelButton: 'Cancel'
};

nls.picker.de = {
		doneButton: 'OK',
		cancelButton: 'Abbrechen'
};

nls.picker.it = {
		doneButton: 'OK',
		cancelButton: 'Annullare'
};

nls.picker.fr = {
		doneButton: 'OK',
		cancelButton: 'Annuler'
};

nls.picker.nl = {
		doneButton: 'OK',
		cancelButton: 'Annuleren'
};

Ext.apply(nls.picker, nls.picker[nls.language]);
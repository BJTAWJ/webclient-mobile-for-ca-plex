Ext.ns('nls');
Ext.ns('nls.msg');
Ext.ns('nls.picker');
Ext.ns('nls.month');

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

nls.month.en = {
		1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"	
};

nls.month.de = {
		1: "Januar",
        2: "Februar",
        3: "März",
        4: "April",
        5: "Mai",
        6: "Juni",
        7: "Juli",
        8: "August",
        9: "September",
        10: "Oktober",
        11: "November",
        12: "Dezember"	
};

nls.month.it = {
		1: "gennaio",
        2: "febbraio",
        3: "marzo",
        4: "aprile",
        5: "maggio",
        6: "giugno",
        7: "luglio",
        8: "agosto",
        9: "settembre",
        10: "ottobre",
        11: "novembre",
        12: "dicembre"	
};

nls.month.fr = {
		1: "janvier",
        2: "février",
        3: "mars",
        4: "avril",
        5: "mai",
        6: "juin",
        7: "juillet",
        8: "août",
        9: "septembre",
        10: "octobre",
        11: "novembre",
        12: "décembre"	
};

nls.month.nl = {
		1: "januari",
        2: "februari",
        3: "maart",
        4: "april",
        5: "mei",
        6: "juni",
        7: "juli",
        8: "augustus",
        9: "september",
        10: "october",
        11: "november",
        12: "december"	
};

Ext.apply(nls.month, nls.month[nls.language]);
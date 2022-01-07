#MpesaStatement object (with getAllContacts method)

This is an npm module created by Victor Karanja to automate phone-number extraction from an unsecured mpesa statement pdf.

The module can be used in any project as follows:

```
$ npm install mpesa-contacts


let MpesaStatement = require("mpesa-contacts");
let decStatement = new MpesaStatement("path-to-statement/statement.pdf");

//returns a promise for all contacts
let decContacts = decStatement.getAllContacts();

//handle the promise
decContacts.then((contacts, err)=>{
    if(err){
        console.log(err);
    }
    console.log(contacts);
});


//makes a csv file, contacts.csv in your parent directory
decStatement.makeCsvContacts();

```

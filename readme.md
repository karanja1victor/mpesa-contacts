#MpesaStatement object (with fullContacts method)

This is an npm module created by Victor Karanja to automate phone-number extraction from an unsecured mpesa statement pdf.

The module can be used in any project as follows:

```
$ npm install mpesa-contacts


let MpesaStatement = require("mpesa-contacts");
let decStatement = new MpesaStatement("path-to-statement/statement.pdf");
console.log(decStatement.fullContacts());

```

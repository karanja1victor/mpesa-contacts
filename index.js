// load dependencies

const { readFile } = require('fs').promises;
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const csv = require('fast-csv');

//export module for use outside of this file.
module.exports = MpesaStatement;

// MpesaStatement Object

function MpesaStatement (statementPath) {
  this.statementPath = statementPath;
  this.getFullStatement = async () => {
    let data = await readFile(this.statementPath);
    let parsed = await pdf(data);
    return parsed.text;
  }
  this.getTwelveDigitContacts = async () => {
    //code block
    let parsed = await this.getFullStatement();
    let pdfLines = parsed.split("\n");
    let contacts = {};
    pdfLines.forEach((line, index) => {
        let regex = /\b\d{12}\b([\s\S]*)$/gm;
        let phoneRegex = /\b\d{12}\b/gm;
        let nameRegex = /[a-zA-Z ]+/gm;
        let contact = line.match(regex);
        if(contact) {
            let stringContact = contact.join("");
            let phoneNumber = stringContact.match(phoneRegex).join("");
            let nextLineName = pdfLines[index+1].match(nameRegex);
            let name = stringContact.match(nameRegex).join("").trim().toUpperCase();
            let otherName = "";
            if(nextLineName.length ===1 ){
                otherName = nextLineName.join("").trim().toUpperCase();
            }
            if(!(contacts.hasOwnProperty(phoneNumber))){
                contacts[phoneNumber ] = `${name} ${otherName}` ;
            }
        }
    });
    return contacts;
  }
  this.getAllContacts = async () => {
    let tenParsed = await this.getFullStatement();
    let tenPdfLines = tenParsed.split("\n");
    let contacts = await this.getTwelveDigitContacts();
    tenPdfLines.forEach((line, index) => {
        let tenRegex = /\b\d{10}\b([\s\S]*)$/gm;
        let tenPhoneRegex = /\b\d{10}\b/gm;
        let tenNameRegex = /[a-zA-Z ]+/gm;
        let tenContact = line.match(tenRegex);
        if(tenContact) {
            let tenStringContact = tenContact.join("");
            let tenPhoneNumber = tenStringContact.match(tenPhoneRegex).join("");
            let tenCell = Number(tenPhoneNumber) + 254000000000 ;
            let tenName = tenPdfLines[index+1].match(tenNameRegex);
            if(!(contacts.hasOwnProperty(tenCell))  && tenName.length == 1){
                contacts[tenCell ] = tenName.join("").trim().toUpperCase();
            }
        }
    });
    return contacts;
  }
  this.makeCsvContacts = async function() {
    let contacts = await this.getAllContacts();
    let writeStream = createWriteStream(path.resolve(__dirname,  "contacts.csv"));
        const csvStream = csv.format({ headers: true });
        Object.entries(contacts).forEach((contactInfo) => {
            let firstName = contactInfo[1].split(" ")[0];
            let middleName = contactInfo[1].split(" ")[1];
            let lastName = contactInfo[1].split(" ")[2];
            let phoneNumber = contactInfo[0];
            csvStream.write({ 'Name' :`${firstName} ${middleName} ${lastName}` , 'Given Name' :`${firstName} ${middleName}` , 'Additional Name' : '',  'Family Name' :`${lastName}` ,
                        'Yomi Name' :'','Given Name Yomi' :'',  'Additional Name Yomi' :'' , 'Family Name Yomi' :'', 'Name Prefix' :'',
                        'Name Suffix' : '' ,'Initials' : '' , 'Nickname' : '' , 'Short Name' :'' ,  'Maiden Name': '' ,'Birthday' : '' , 'Gender' : '' , 'Location' : '' ,
                        'Billing Information' : '' ,'Directory Server' : '' , 'Mileage' : '' , 'Occupation' : '' , 'Hobby' : '' , 'Sensitivity' : '' , 'Priority' : '' , 'Subject' : '' ,
                        'Notes' : '' , 'Language' : '' , 'Photo' : '' , 'Group Membership' :'* myContacts', 'E-mail 1 - Type' : '' , 'E-mail 1 - Value' : '',
                        'Phone 1 - Type' : 'Mobile', 'Phone 1 - Value' : `${phoneNumber}`   });
        });
        csvStream.pipe(writeStream).on('end', () => process.exit());
        csvStream.end();
        return writeStream;
  }  
}

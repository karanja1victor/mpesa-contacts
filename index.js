// load dependencies

const { readFile } = require('fs').promises;
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
  this.makeCsvContacts = async () => {
    //code block.
  }
}

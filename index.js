// load dependencies

const { readFile } = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const csv = require('fast-csv');

//export module for use outside of this file.
module.exports = MpesaStatement;

// MpesaStatement Object

function MpesaStatement (statementPath) {
  this.statementPath = this.statementPath;
  this.getFullStatement = async () => {
    let data = await readFile(this.statementPath);
    let parsed = await pdf(data);
    return parsed.text;
  }
  this.getTwelveDigitContacts = async () => {
    //code block
  }
  this.getAllContacts = async () => {
    //code block
  }
  this.makeCsvContacts = async () => {
    //code block.
  }
}

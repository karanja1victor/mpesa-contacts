//load dependencies.
let assert = require ('assert');
let MpesaStatement = require('../index.js');
const path = require('path');

describe("MpesaStatement", function () {
  //MpesaStatement#getFullStatement
  describe("#getFullStatement", function() {
    it("should return a non-empty string in text format.", async function(){
      let bankStatement = await new MpesaStatement(path.resolve(__dirname, "..", "assets", "Bank Statement.pdf")).getFullStatement();
      assert(bankStatement.match(/\S+/gm));
    });
    it("should return only whitespace characters for an empty pdf.", async function(){
      let empty = await new MpesaStatement(path.resolve(__dirname, "..", "assets", "empty.pdf")).getFullStatement();
      assert(empty.match(/\s+/gm));
    });
  });
  describe("#getTwelveDigitContacts", function (){
    it("should return an object with twelve digit contacts as the keys.");
    });
  });
  describe("#getAllContacts", function(){
    it("should return an object with both twelve digit contacts and ten digit contacts as the keys.");
  });
  describe("#makeCsvContacts", function(){
    it("should take in a template and fill it with data from #getAllContacts");
  });
});

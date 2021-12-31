//load dependencies.
let assert = require ('assert');
let MpesaStatement = require('../index.js');

describe("MpesaStatement", function () {
  //MpesaStatement#getFullStatement
  describe("#getFullStatement", function() {
    it("should return the pdf in text format.");
    it("should return null for an empty pdf.");
  });
  describe("#getTwelveDigitContacts", function (){
    it("should return an object with twelve digit contacts as the keys.");
  });
  describe("#getAllContacts", function(){
    it("should return an object with both twelve digit contacts and ten digit contacts as the keys.");
  });
  describe("#makeCsvContacts", function(){
    it("should take in a template and fill it with data from #getAllContacts");
  });
});

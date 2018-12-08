var qrcode = require("qrcode-generator");
var htmlparser2 = require("htmlparser2");
var DomParser = require("dom-parser");
var parser = new DomParser();
var Xray = require("x-ray");
var x = Xray();
module.exports = function generateQR(data) {
  var typeNumber = 2;
  var errorCorrectionLevel = "L";
  var qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(data);
  qr.make();
  var dom = "";
  //console.log(qr.createImgTag(8));
  x(qr.createImgTag(8), "img@src")((err, obj) => {
    dom = obj;
  });
  return dom;
};

const Filter = require("broccoli-filter");
const inherits = require("util").inherits;
const fs = require("fs");

function CopyIndex(inputTree, options) {
  if (!this) {
    return new CopyIndex(inputTree, options);
  }
  options = options || {};
  options.extensions = ["js"];
  options.targetExtension = "html";
  Filter.call(this, inputTree, options);
}

inherits(CopyIndex, Filter);

CopyIndex.prototype.processString = function processString() {
  return fs.readFileSync("./test-client/index-template.html", "utf8");
};

module.exports = CopyIndex;

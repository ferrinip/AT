const data = ["dbEnglish","dbManager","dbEngineer","dbQuality","dbComputing","dbProgrammer","dbMathematics","dbMedicine","dbGlossary"];
data.forEach(function (element, index) {
  document.write(`<script src="db/${element}.db"></script>`);
});
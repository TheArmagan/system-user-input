const { ComplexKeyListener } = require("./dist/index.js");

const l = new ComplexKeyListener();
l.start();

l.on("raw", console.log);
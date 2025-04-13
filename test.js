const { ComplexKeyListener } = require("./dist/index.js");

const l = new ComplexKeyListener();
l.start();

l.on("direct", console.log);
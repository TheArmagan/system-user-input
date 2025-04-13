const { MouseListener } = require("../dist/index.js");

const l = new MouseListener();
l.start();

l.on("raw", console.log);
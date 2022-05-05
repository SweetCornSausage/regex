/* Change toolbox XML ID if necessary. Can export toolbox XML from Workspace Factory. */
var toolbox = document.getElementById("toolbox");

var options = {
    toolbox: toolbox,
    collapse: false,
    comments: true,
    disable: true,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: "start",
    css: true,
    media: "./media/",
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    grid: {
        spacing: 20,
        length: 1,
        colour: "#888",
        snap: false,
    },
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
    },
};

/* Inject your workspace */

var blocklyArea = document.getElementById("blocklyArea");
var blocklyDiv = document.getElementById("blocklyDiv");

var workspace = Blockly.inject(blocklyDiv, options);

var onresize = function (e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + "px";
    blocklyDiv.style.top = y + "px";
    blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
    blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
    Blockly.svgResize(workspace);

    // console.log("resize");
};
window.addEventListener("resize", onresize, false);
onresize();
Blockly.svgResize(workspace);

var toolbox2 = document.getElementById("toolbox2");

var options2 = {
    toolbox: toolbox2,
    collapse: false,
    comments: false,
    disable: false,
    maxBlocks: Infinity,
    trashcan: false,
    horizontalLayout: false,
    toolboxPosition: "start",
    css: true,
    media: "./media/",
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    grid: {
        spacing: 20,
        length: 1,
        colour: "#888",
        snap: false,
    },
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
    },
};

var blocklyArea2 = document.getElementById("blocklyArea2");
var blocklyDiv2 = document.getElementById("blocklyDiv2");
var workspace2 = Blockly.inject(blocklyDiv2, options2);

var onresize2 = function (e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea2;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv2.style.left = x + "px";
    blocklyDiv2.style.top = y + "px";
    blocklyDiv2.style.width = blocklyArea2.offsetWidth + "px";
    blocklyDiv2.style.height = blocklyArea2.offsetHeight + "px";
    Blockly.svgResize(workspace2);

    // console.log("resize");
};
window.addEventListener("resize", onresize2, false);
onresize2();
Blockly.svgResize(workspace2);

Blockly.defineBlocksWithJsonArray([
    {
        type: "block_result_match",
        message0: "%1",
        args0: [
            {
                type: "field_input",
                name: "match",
                text: "",
            },
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_result_total",
        message0: "已匹配，index: %1 - %2 %3 %4 捕获组： %5 %6",
        args0: [
            {
                type: "field_number",
                name: "start",
                value: 0,
                min: 0,
            },
            {
                type: "field_number",
                name: "stop",
                value: 0,
                min: 0,
            },
            {
                type: "input_dummy",
            },
            {
                type: "input_statement",
                name: "content",
            },
            {
                type: "input_dummy",
            },
            {
                type: "input_statement",
                name: "groups",
            },
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_result_exec",
        message0: "组 %1 ： %2",
        args0: [
            {
                type: "field_input",
                name: "group",
                text: "",
            },
            {
                type: "field_input",
                name: "content",
                text: "",
            },
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_null",
        message0: "",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
]);

var test_workspace = new Blockly.Workspace();
var test_workspace2 = new Blockly.Workspace();

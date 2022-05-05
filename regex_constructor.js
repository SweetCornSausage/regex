// 备注

// const XRegExp = require("xregexp");
// const workspace = "workspace";

// XRegExp.uninstall("namespacing");

const pat_freq_name = XRegExp.tag(
    "gi"
)`^(?<freq>(?:(?<!\\|\()(?<freq_01>\?)|(?<!\\)(?<freq_1n>\+)|(?<!\\)(?<freq_0n>\*)|(?<freq_exact>(?<!\\)\{(?:,(?<freq_0_max>\d+)|(?<freq_min_inf>\d+),|(?<freq_min>\d+),(?<freq_max>\d+)|(?<freq_exact_n>\d+))(?<!\\)\}))(?<is_greedy>\?)?)`; // ^freqwithname

const pat_freq_seg = XRegExp.tag(
    "gi"
)`(?:(?:(?<!\\|\()(?:\?)|(?<!\\)(?:\+)|(?<!\\)(?:\*)|(?:(?<!\\)\{(?:,(?:\d+)|(?:\d+),|(?:\d+),(?:\d+)|(?:\d+))(?<!\\)\}))(?:\?)?)`; // freqforseg

const pat_group_name = XRegExp.tag(
    "gi"
)`(?<group_s>\(\?(?:(?<custom_group><(?<group_name>[a-zA-Z-]\w*)>)|(?<no_capture>:)|(?<ahead_positive>=)|(?<ahead_negative>!)|(?<behind_positive><=)|(?<behind_negative><!)))`; // groupwithname

function seg(regex) {
    // 晒 \
    var list = [];
    for (let index = 0; index < regex.length; index++) {
        if (regex[index] == "\\") {
            list.push(regex[index] + regex[++index]);
        } else {
            list.push(regex[index]);
        }
    }
    return list;
}

function tree(regex) {
    // 筛 |
    var pair = 0;
    var or_n = 0;
    var list = [];
    var j = 0;
    for (let index = 0; index < regex.length; index++) {
        switch (regex[index]) {
            case "(":
                pair++;
                break;
            case ")":
                pair--;
                break;
            case "|":
                if (pair == 0) {
                    list[or_n++] = regex.slice(j, index);
                    j = index + 1;
                }
                break;
            default:
                break;
        }
    }
    if (or_n != 0) {
        list[or_n++] = regex.slice(j, regex.length);
    }
    return list;
}

function constructor(workspace, regex) {
    //
    var or_lists = tree(regex);
    if (or_lists.length > 0) {
        var index = 0;
        var xml = Blockly.Xml.textToDom('<block type="block_or"></block>');
        if (or_lists.length > 2) {
            var or_count = xmlUtils.createElement("mutation");
            or_count.setAttribute("or", or_lists.length - 2);
            xml.appendChild(or_count);
        }
        var x = Blockly.Xml.domToBlock(xml, workspace);
        for (; index < or_lists.length; index++) {
            var y = state_regex(workspace, or_lists[index]);
            var z = x.appendStatementInput("or_" + (index + 1));
            z.connection.connect(y.previousConnection);
        }
    } else {
        var x = state_regex(workspace, regex);
    }
    return x;
}

// function block_or_s(workspace, regex) {
//     // 处理 |
//     var x = workspace.newBlock("block_or");
//     var y = null;
//     var z = null;
//     for (let index = 0; index < regex.length; index++) {
//         y = state_regex(regex[index]);
//         z = x.appendStatementInput("or_" + (index + 1));
//         z.connection.connect(y.previousConnection);
//     }
//     return x;
// }

function state_regex(workspace, regex) {
    // 没有 | 筛()
    var groups = [];
    var index = 0;
    var start = 0;
    for (; index < regex.length; index++) {
        if (regex[index] == "(") {
            if (start < index) {
                groups.push([regex.slice(start, index)]);
            }
            var i = 1;
            var j = index + 1;
            for (j = index + 1; i != 0; j++) {
                if (regex[j] == "(") {
                    i++;
                } else if (regex[j] == ")") {
                    i--;
                }
            }
            var content = regex.slice(index, j);
            var rest = regex.slice(j);
            var freq = XRegExp.match(rest.join(""), pat_freq_name);
            if (freq && freq.length > 0) {
                group = [content, freq[0]];
                index = index + content.length + freq[0].length - 1;
            } else {
                group = [content, 1];
                index = index + content.length - 1;
            }
            groups.push(group);
            start = index + 1;
        }
    }
    if (start < index) {
        groups.push([regex.slice(start, index)]);
    }

    var start_block = null;
    var pointer = null;
    for (index = 0; index < groups.length; index++) {
        if (groups[index].length == 1) {
            var z = state_sub(workspace, groups[index][0]);
            if (pointer == null) {
                start_block = z[0];
                pointer = z[1];
            } else {
                pointer.nextConnection.connect(z[0].previousConnection);
                pointer = z[1];
            }
        } else {
            var z = block_group_s(
                workspace,
                groups[index][0],
                groups[index][1]
            );
            if (pointer == null) {
                start_block = z;
                pointer = z;
            } else {
                pointer.nextConnection.connect(z.previousConnection);
                pointer = z;
            }
        }
    }
    return start_block;
}

function block_group_s(workspace, regex, freq) {
    // 处理()
    var x = null;
    var y = XRegExp.exec(regex.join(""), pat_group_name); // 没有\
    var z = null;
    if (y) {
        // 非()
        if (y.groups.custom_group) {
            x = workspace.newBlock("block_group_capture");
            x.setFieldValue("TRUE", "is_index");
            x.setFieldValue(y.groups.group_name, "index");
        } else if (y.groups.no_capture) {
            x = workspace.newBlock("block_group_nocapture");
        } else if (y.groups.ahead_positive) {
            x = workspace.newBlock("block_assert");
            x.setFieldValue("ahead", "is_ahead");
            x.setFieldValue("positive", "is_positive");
        } else if (y.groups.ahead_negative) {
            x = workspace.newBlock("block_assert");
            x.setFieldValue("ahead", "is_ahead");
            x.setFieldValue("negative", "is_positive");
        } else if (y.groups.behind_positive) {
            x = workspace.newBlock("block_assert");
            x.setFieldValue("behind", "is_ahead");
            x.setFieldValue("positive", "is_positive");
        } else if (y.groups.behind_negative) {
            x = workspace.newBlock("block_assert");
            x.setFieldValue("behind", "is_ahead");
            x.setFieldValue("negative", "is_positive");
        }
        z = regex.slice(y.groups.group_s.length, regex.length - 1);
    } else {
        x = workspace.newBlock("block_group_capture");
        x.setFieldValue("FALSE", "is_index");
        x.setFieldValue("test", "index");
        z = regex.slice(1, regex.length - 1);
    }
    var block_freq = block_freq_s(workspace, freq);
    x.getInput("freq").connection.connect(block_freq.outputConnection);
    var state = constructor(workspace, z);
    var input = x.appendStatementInput("group");
    input.connection.connect(state.previousConnection);
    return x;
}

function state_sub(workspace, regex) {
    // 没有 | () 筛[] return [start_block, pointer]
    var groups = [];
    var index = 0;
    var start = 0;
    for (; index < regex.length; index++) {
        if (regex[index] == "[") {
            if (start < index) {
                groups.push([regex.slice(start, index)]);
            }
            var i = 1;
            var j = index + 1;
            for (j = index + 1; i != 0; j++) {
                if (regex[j] == "(") {
                    // i++;
                } else if (regex[j] == "]") {
                    i--;
                }
            }
            var content = regex.slice(index, j);
            var rest = regex.slice(j);
            var freq = XRegExp.match(rest.join(""), pat_freq_name);
            if (freq && freq.length > 0) {
                group = [content, freq[0]];
                index = index + content.length + freq[0].length - 1;
            } else {
                group = [content, 1];
                index = index + content.length - 1;
            }
            groups.push(group);
            start = index + 1;
        }
    }
    if (start < index) {
        groups.push([regex.slice(start, index)]);
    }
    var start_block = null;
    var pointer = null;
    for (index = 0; index < groups.length; index++) {
        if (groups[index].length == 1) {
            var z = block_real_s(workspace, groups[index][0]);
            if (pointer == null) {
                start_block = z[0];
                pointer = z[1];
            } else {
                pointer.nextConnection.connect(z[0].previousConnection);
                pointer = z[1];
            }
        } else {
            var z = block_real_range_s(
                workspace,
                groups[index][0],
                groups[index][1]
            );
            if (pointer == null) {
                start_block = z;
                pointer = z;
            } else {
                pointer.nextConnection.connect(z.previousConnection);
                pointer = z;
            }
        }
    }
    return [start_block, pointer];
}

function block_real_range_s(workspace, regex, freq) {
    // [] return x
    var x = workspace.newBlock("block_real_char");
    var start = 1;
    if (regex[1] == "^") {
        x.setFieldValue("exclude", "is_include");
        start++;
    }
    var block_freq = block_freq_s(workspace, freq);
    x.getInput("freq").connection.connect(block_freq.outputConnection);
    var y = x.appendStatementInput("real_char");
    var index = 1;
    // var start = 1;
    var start_block = null;
    var pointer = null;
    for (; index < regex.length - 1; index++) {
        if (regex[index] == "-" && index > 1 && index < regex.length - 2) {
            if (start < index - 1) {
                var z = workspace.newBlock("block_real_char_s");
                if (start == 1 && regex[1] == "^") {
                    z.setFieldValue(
                        regex.slice(start + 1, index - 1).join(""),
                        "string"
                    );
                } else {
                    z.setFieldValue(
                        regex.slice(start, index - 1).join(""),
                        "string"
                    );
                }
                if (start_block == null) {
                    start_block = z;
                    pointer = z;
                    y.connection.connect(pointer.previousConnection);
                } else {
                    pointer.nextConnection.connect(z.previousConnection);
                    pointer = z;
                }
            }
            z = workspace.newBlock("block_real_char_range");
            z.setFieldValue(regex[index - 1], "first_char");
            z.setFieldValue(regex[index + 1], "last_char");
            if (start_block == null) {
                start_block = z;
                pointer = z;
                y.connection.connect(pointer.previousConnection);
            } else {
                pointer.nextConnection.connect(z.previousConnection);
                pointer = z;
            }
            index++;
            start = index + 1;
        }
    }
    if (start < index) {
        var z = workspace.newBlock("block_real_char_s");
        z.setFieldValue(regex.slice(start, index).join(""), "string");
        if (start_block == null) {
            start_block = z;
            pointer = z;
            y.connection.connect(pointer.previousConnection);
        } else {
            pointer.nextConnection.connect(z.previousConnection);
            pointer = z;
        }
    }
    return x;
}

function block_real_s(workspace, regex) {
    // 基本结构 不含|()[] return [start_block, pointer]
    var str = regex.join("");
    var freq_split = XRegExp.split(str, pat_freq_seg);
    var freq_match = XRegExp.match(str, pat_freq_seg);
    if (freq_split[freq_split.length - 1] == "") {
        freq_split = freq_split.slice(0, freq_split.length - 1);
    }
    var index = 0;
    var start_block = null;
    var pointer = null;
    for (; index < freq_split.length; index++) {
        var split = seg(freq_split[index]);
        if (split.length > 1) {
            var z = workspace.newBlock("block_real_strings");
            z.setFieldValue(
                split.slice(0, split.length - 1).join(""),
                "string"
            );
            if (pointer == null) {
                start_block = z;
                pointer = z;
            } else {
                pointer.nextConnection.connect(z.previousConnection);
                pointer = z;
            }
        }
        var z = workspace.newBlock("block_real_string");
        z.setFieldValue(split[split.length - 1], "string");
        if (freq_match[index]) {
            var block_freq = block_freq_s(workspace, freq_match[index]);
        } else {
            var block_freq = block_freq_s(workspace, 1);
        }
        z.getInput("freq").connection.connect(block_freq.outputConnection);
        if (pointer == null) {
            start_block = z;
            pointer = z;
        } else {
            pointer.nextConnection.connect(z.previousConnection);
            pointer = z;
        }
    }
    return [start_block, pointer];
}

function block_freq_s(workspace, regex) {
    // 频率块 regex为字符串
    var x = null;
    var y = XRegExp.exec(regex, pat_freq_name); // 没有\
    if (y) {
        if (y.groups.freq_01) {
            x = workspace.newBlock("block_freq_01");
        } else if (y.groups.freq_0n) {
            x = workspace.newBlock("block_freq_0n");
        } else if (y.groups.freq_1n) {
            x = workspace.newBlock("block_freq_1n");
        } else if (y.groups.freq_exact_n) {
            x = workspace.newBlock("block_freq_exact_n");
            x.setFieldValue(Number(y.groups.freq_exact_n), "exact_n");
        } else if (y.groups.freq_0_max) {
            x = workspace.newBlock("block_freq_exact_max");
            x.setFieldValue(Number(y.groups.freq_0_max), "exact_max");
        } else if (y.groups.freq_min_inf) {
            x = workspace.newBlock("block_freq_exact_min");
            x.setFieldValue(Number(y.groups.freq_min_inf), "exact_min");
        } else if (y.groups.freq_min && y.groups.freq_max) {
            x = workspace.newBlock("block_freq_exact_range");
            x.setFieldValue(Number(y.groups.freq_max), "exact_max");
            x.setFieldValue(Number(y.groups.freq_min), "exact_min");
        }
        if (y.groups.is_greedy) {
            x.setFieldValue("lazy", "is_greedy");
        }
        return x;
    } else {
        x = workspace.newBlock("block_freq_1");
        x.setShadow(true);
        return x;
    }
}

// // x=test_workspace.newBlock("block_or") y=test_workspace.newBlock("block_anchor_end") x.nextConnection.connect(y.previousConnection)
// // z=x.appendStatementInput("or_1") z.connection.connect(y.previousConnection)
// // x=test_workspace.newBlock("block_group_capture") y=test_workspace.newBlock("block_freq_1n") x.getInput("freq").connection.connect(y.outputConnection)
// // search(/\\n/)
// // \106 matches the character F with index 1068 (7010 or 4616) literally (区分大小写)

// x = "a|b|c|d";
// // x = "[[[[abc]+]+]";
// y = seg(x);
// z = constructor(workspace, y);
// // z = state_sub(y);

// // debugger;

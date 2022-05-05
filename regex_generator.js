const regexGenerator = new Blockly.Generator("REGEX");
regexGenerator.scrub_ = function (block, code, opt_thisOnly) {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = "";
    if (nextBlock) {
        nextCode = regexGenerator.blockToCode(nextBlock);
    }
    return code + nextCode;
};

regexGenerator.ORDER_NONE = 0;
regexGenerator.ORDER_ATOMIC = 0;

regexGenerator["block_or"] = function (block) {
    var statements_or_1 = regexGenerator.statementToCode(block, "or_1");
    var statements_or_2 = regexGenerator.statementToCode(block, "or_2");
    var code = statements_or_1.slice(2) + "|" + statements_or_2.slice(2);
    for (let i = 1; i <= block.orCount_; i++) {
        var statements_or = regexGenerator.statementToCode(
            block,
            "or_" + (i + 2)
        );
        code = code + "|" + statements_or.slice(2);
    }
    return code;
};

regexGenerator["block_group_capture"] = function (block) {
    var checkbox_is_index = block.getFieldValue("is_index") == "TRUE";
    var text_index = block.getFieldValue("index");
    var value_freq = regexGenerator.valueToCode(
        block,
        "freq",
        regexGenerator.ORDER_ATOMIC
    );
    var statements_group = regexGenerator.statementToCode(block, "group");
    var code;
    if (checkbox_is_index) {
        code = "(?<" + text_index + ">";
    } else {
        code = "(";
    }
    code = code + statements_group.slice(2) + ")" + value_freq;
    return code;
};

regexGenerator["block_group_nocapture"] = function (block) {
    var value_freq = regexGenerator.valueToCode(
        block,
        "freq",
        regexGenerator.ORDER_ATOMIC
    );
    var statements_group = regexGenerator.statementToCode(block, "group");
    var code = "(?:" + statements_group.slice(2) + ")" + value_freq;
    return code;
};

regexGenerator["block_assert"] = function (block) {
    var dropdown_is_ahead = block.getFieldValue("is_ahead");
    var dropdown_is_positive = block.getFieldValue("is_positive");
    var value_freq = regexGenerator.valueToCode(
        block,
        "freq",
        regexGenerator.ORDER_ATOMIC
    );
    var statements_assert = regexGenerator.statementToCode(block, "group");
    var code;
    switch (dropdown_is_ahead) {
        case "ahead":
            switch (dropdown_is_positive) {
                case "positive":
                    code = "(?=";
                    break;
                case "negative":
                    code = "(?!";
                    break;
                default:
                    break;
            }
            break;
        case "behind":
            switch (dropdown_is_positive) {
                case "positive":
                    code = "(?<=";
                    break;
                case "negative":
                    code = "(?<!";
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    code = code + statements_assert.slice(2) + ")" + value_freq;
    return code;
};

regexGenerator["block_real_strings"] = function (block) {
    var text_string = block.getFieldValue("string");
    var code = text_string;
    return code;
};

regexGenerator["block_real_string"] = function (block) {
    var text_string = block.getFieldValue("string");
    var value_freq = regexGenerator.valueToCode(
        block,
        "freq",
        regexGenerator.ORDER_ATOMIC
    );
    var code = text_string + value_freq;
    return code;
};

regexGenerator["block_real_char"] = function (block) {
    var dropdown_is_include = block.getFieldValue("is_include");
    var value_freq = regexGenerator.valueToCode(
        block,
        "freq",
        regexGenerator.ORDER_ATOMIC
    );
    var statements_real_char = regexGenerator.statementToCode(
        block,
        "real_char"
    );
    var code =
        "[" +
        (dropdown_is_include == "include" ? "" : "^") +
        statements_real_char.slice(2) +
        "]" +
        value_freq;
    return code;
};

regexGenerator["block_real_char_range"] = function (block) {
    var text_first_char = block.getFieldValue("first_char");
    var text_last_char = block.getFieldValue("last_char");
    var code = text_first_char + "-" + text_last_char;
    return code;
};

regexGenerator["block_real_char_s"] = function (block) {
    var text_string = block.getFieldValue("string");
    var code = text_string;
    return code;
};

regexGenerator["block_real_char_meta"] = function (block) {
    var dropdown_meta_char = block.getFieldValue("meta_char");
    var text_meta_string = block.getFieldValue("meta_string");
    var code;
    switch (dropdown_meta_char) {
        case "meta_any":
            code = ".";
            break;
        case "meta_d":
            code = "\\d";
            break;
        case "meta_D":
            code = "\\D";
            break;
        case "meta_s":
            code = "\\s";
            break;
        case "meta_S":
            code = "\\d";
            break;
        case "meta_d":
            code = "\\S";
            break;
        case "meta_w":
            code = "\\w";
            break;
        case "meta_W":
            code = "\\W";
            break;
        case "meta_r":
            code = "\\r";
            break;
        case "meta_t":
            code = "\\t";
            break;
        case "meta_n":
            code = "\\n";
            break;
        case "meta_other":
            code = text_meta_string;
            break;
        default:
            break;
    }
    return code;
};

regexGenerator["block_freq_1"] = function (block) {
    var code = "";
    return [code, regexGenerator.ORDER_NONE];
};

regexGenerator["block_freq_01"] = function (block) {
    var dropdown_is_greedy = block.getFieldValue("is_greedy");
    var code = "?" + (dropdown_is_greedy == "lazy" ? "?" : "");
    return [code, regexGenerator.ORDER_NONE];
};

regexGenerator["block_freq_1n"] = function (block) {
    var dropdown_is_greedy = block.getFieldValue("is_greedy");
    var code = "+" + (dropdown_is_greedy == "lazy" ? "?" : "");
    return [code, regexGenerator.ORDER_NONE];
};

regexGenerator["block_freq_0n"] = function (block) {
    var dropdown_is_greedy = block.getFieldValue("is_greedy");
    var code = "*" + (dropdown_is_greedy == "lazy" ? "?" : "");
    return [code, regexGenerator.ORDER_NONE];
};

regexGenerator["block_freq_exact_n"] = function (block) {
    var number_exact_n = block.getFieldValue("exact_n");
    var dropdown_is_greedy = block.getFieldValue("is_greedy");
    var code =
        "{" + number_exact_n + "}" + (dropdown_is_greedy == "lazy" ? "?" : "");
    return [code, regexGenerator.ORDER_NONE];
};

regexGenerator["block_freq_exact_min"] = function (block) {
    var number_exact_min = block.getFieldValue("exact_min");
    var dropdown_is_greedy = block.getFieldValue("is_greedy");
    var code =
        "{" +
        number_exact_min +
        ",}" +
        (dropdown_is_greedy == "lazy" ? "?" : "");
    return [code, regexGenerator.ORDER_NONE];
};

regexGenerator["block_freq_exact_max"] = function (block) {
    var number_exact_max = block.getFieldValue("exact_max");
    var dropdown_is_greedy = block.getFieldValue("is_greedy");
    var code =
        "{" +
        number_exact_max +
        "}" +
        (dropdown_is_greedy == "lazy" ? "?" : "");
    return [code, regexGenerator.ORDER_NONE];
};

regexGenerator["block_freq_exact_range"] = function (block) {
    var number_exact_min = block.getFieldValue("exact_min");
    var number_exact_max = block.getFieldValue("exact_max");
    var dropdown_is_greedy = block.getFieldValue("is_greedy");
    var code =
        "{" +
        number_exact_min +
        "," +
        number_exact_max +
        "}" +
        (dropdown_is_greedy == "lazy" ? "?" : "");
    return [code, regexGenerator.ORDER_NONE];
};

regexGenerator["block_anchor_start"] = function (block) {
    var code = "^";
    return code;
};

regexGenerator["block_anchor_end"] = function (block) {
    var code = "$";
    return code;
};

regexGenerator["block_anchor_word"] = function (block) {
    var dropdown_is_word = block.getFieldValue("is_word");
    var code = "\\" + (dropdown_is_word == "word" ? "b" : "B");
    return code;
};

regexGenerator["block_real_string_meta"] = function (block) {
    var dropdown_meta_char = block.getFieldValue("meta_char");
    var text_meta_string = block.getFieldValue("meta_string");
    var value_freq = regexGenerator.valueToCode(
        block,
        "freq",
        regexGenerator.ORDER_ATOMIC
    );
    var code;
    switch (dropdown_meta_char) {
        case "meta_any":
            code = ".";
            break;
        case "meta_d":
            code = "\\d";
            break;
        case "meta_D":
            code = "\\D";
            break;
        case "meta_s":
            code = "\\s";
            break;
        case "meta_S":
            code = "\\d";
            break;
        case "meta_d":
            code = "\\S";
            break;
        case "meta_w":
            code = "\\w";
            break;
        case "meta_W":
            code = "\\W";
            break;
        case "meta_r":
            code = "\\r";
            break;
        case "meta_t":
            code = "\\t";
            break;
        case "meta_n":
            code = "\\n";
            break;
        case "meta_other":
            code = text_meta_string;
            break;
        default:
            break;
    }
    code = code + value_freq;
    return code;
};

regexGenerator["block_group_captured"] = function (block) {
    var number_group_index = block.getFieldValue("group_index");
    var checkbox_is_index = block.getFieldValue("is_index") == "TRUE";
    var text_index = block.getFieldValue("index");
    var value_freq = regexGenerator.valueToCode(
        block,
        "freq",
        regexGenerator.ORDER_NONE
    );
    var code =
        "\\" +
        (checkbox_is_index ? "k<" + text_index + ">" : number_group_index) +
        value_freq;
    return code;
};

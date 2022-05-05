Blockly.defineBlocksWithJsonArray([
    {
        type: "block_or",
        message0: "%1 %2",
        args0: [
            {
                type: "input_dummy",
            },
            {
                type: "input_statement",
                name: "or_1",
                check: "Main",
            },
        ],
        message1: "或者 %1 %2",
        args1: [
            {
                type: "input_dummy",
            },
            {
                type: "input_statement",
                name: "or_2",
                check: "Main",
            },
        ],
        previousStatement: "OR",
        nextStatement: "OR",
        colour: 270,
        tooltip: "",
        helpUrl: "",
        mutator: "or_mutator",
        // extensions: ["controls_if_tooltip"],
    },
    {
        type: "or_start",
        message0: "OR",
        nextStatement: null,
        enableContextMenu: false,
        colour: 270,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "or_or",
        message0: "OR",
        previousStatement: null,
        nextStatement: null,
        enableContextMenu: false,
        colour: 270,
        tooltip: "",
        helpUrl: "",
    },

    // {
    //     type: "block_or",
    //     message0: "两者之一 %1 %2 两者之一 %3 %4",
    //     args0: [
    //         {
    //             type: "input_dummy",
    //         },
    //         {
    //             type: "input_statement",
    //             name: "or_1",
    //             check: "Main",
    //         },
    //         {
    //             type: "input_dummy",
    //         },
    //         {
    //             type: "input_statement",
    //             name: "or_2",
    //             check: "Main",
    //         },
    //     ],
    //     previousStatement: "Main",
    //     nextStatement: "Main",
    //     colour: 230,
    //     tooltip: "",
    //     helpUrl: "",
    //     // mutator: "my_mutator",
    // },
    {
        type: "block_group_capture",
        message0: "捕获组，  自定义组名 %1 ： %2 %3 %4",
        args0: [
            {
                type: "field_checkbox",
                name: "is_index",
                checked: false,
            },
            {
                type: "field_input",
                name: "index",
                text: "test",
            },
            {
                type: "input_value",
                name: "freq",
                check: "Frequency",
            },
            {
                type: "input_statement",
                name: "group",
                check: ["Main", "OR"],
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 120,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_group_nocapture",
        message0: "非捕获组 %1 %2",
        args0: [
            {
                type: "input_value",
                name: "freq",
                check: "Frequency",
            },
            {
                type: "input_statement",
                name: "group",
                check: ["Main", "OR"],
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 120,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_assert",
        message0: "%1 %2 预查 %3 %4",
        args0: [
            {
                type: "field_dropdown",
                name: "is_ahead",
                options: [
                    ["正向", "ahead"],
                    ["反向", "behind"],
                ],
            },
            {
                type: "field_dropdown",
                name: "is_positive",
                options: [
                    ["肯定", "positive"],
                    ["否定", "negative"],
                ],
            },
            {
                type: "input_value",
                name: "freq",
                check: "Frequency",
            },
            {
                type: "input_statement",
                name: "group",
                check: ["Main", "OR"],
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 120,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_real_strings",
        message0: "字符(串) %1",
        args0: [
            {
                type: "field_input",
                name: "string",
                text: "abc",
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_real_string",
        message0: "字符 %1 %2",
        args0: [
            {
                type: "field_input",
                name: "string",
                text: "a",
            },
            {
                type: "input_value",
                name: "freq",
                check: "Frequency",
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_real_char",
        message0: "以下范围 %1 的单字符 %2 %3",
        args0: [
            {
                type: "field_dropdown",
                name: "is_include",
                options: [
                    ["内", "include"],
                    ["外", "exclude"],
                ],
            },
            {
                type: "input_value",
                name: "freq",
                check: "Frequency",
            },
            {
                type: "input_statement",
                name: "real_char",
                check: "CharRange",
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_real_char_range",
        message0: "从 %1 到 %2 中的一个",
        args0: [
            {
                type: "field_input",
                name: "first_char",
                text: "a",
            },
            {
                type: "field_input",
                name: "last_char",
                text: "z",
            },
        ],
        previousStatement: "CharRange",
        nextStatement: "CharRange",
        colour: 30,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_real_char_s",
        message0: "%1 中的一个",
        args0: [
            {
                type: "field_input",
                name: "string",
                text: "",
            },
        ],
        previousStatement: "CharRange",
        nextStatement: "CharRange",
        colour: 30,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_real_char_meta",
        message0: "特殊字符 %1 %2",
        args0: [
            {
                type: "field_dropdown",
                name: "meta_char",
                options: [
                    ["数字字符", "meta_d"],
                    ["非数字字符", "meta_D"],
                    ["空白字符", "meta_s"],
                    ["非空白字符", "meta_S"],
                    ["字母、数字、下划线", "meta_w"],
                    ["非字母、数字、下划线", "meta_W"],
                    ["换行符", "meta_n"],
                    ["回车符", "meta_r"],
                    ["制表符", "meta_t"],
                    ["其它转义符", "meta_other"],
                ],
            },
            {
                type: "field_input",
                name: "meta_string",
                text: "\\",
            },
        ],
        previousStatement: "CharRange",
        nextStatement: "CharRange",
        colour: 30,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_freq_1",
        message0: "1次",
        output: "Frequency",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_freq_01",
        message0: "0或1次 %1",
        args0: [
            {
                type: "field_dropdown",
                name: "is_greedy",
                options: [
                    ["贪婪", "greedy"],
                    ["懒惰", "lazy"],
                ],
            },
        ],
        output: "Frequency",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_freq_1n",
        message0: "1或多次 %1",
        args0: [
            {
                type: "field_dropdown",
                name: "is_greedy",
                options: [
                    ["贪婪", "greedy"],
                    ["懒惰", "lazy"],
                ],
            },
        ],
        output: "Frequency",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_freq_0n",
        message0: "0或多次 %1",
        args0: [
            {
                type: "field_dropdown",
                name: "is_greedy",
                options: [
                    ["贪婪", "greedy"],
                    ["懒惰", "lazy"],
                ],
            },
        ],
        output: "Frequency",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_freq_exact_n",
        message0: "%1 次 %2",
        args0: [
            {
                type: "field_number",
                name: "exact_n",
                value: 1,
                min: 0,
                precision: 1,
            },
            {
                type: "field_dropdown",
                name: "is_greedy",
                options: [
                    ["贪婪", "greedy"],
                    ["懒惰", "lazy"],
                ],
            },
        ],
        output: "Frequency",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_freq_exact_min",
        message0: "至少 %1 次 %2",
        args0: [
            {
                type: "field_number",
                name: "exact_min",
                value: 1,
                min: 0,
                precision: 1,
            },
            {
                type: "field_dropdown",
                name: "is_greedy",
                options: [
                    ["贪婪", "greedy"],
                    ["懒惰", "lazy"],
                ],
            },
        ],
        output: "Frequency",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_freq_exact_max",
        message0: "至多 %1 次 %2",
        args0: [
            {
                type: "field_number",
                name: "exact_max",
                value: 1,
                min: 0,
                precision: 1,
            },
            {
                type: "field_dropdown",
                name: "is_greedy",
                options: [
                    ["贪婪", "greedy"],
                    ["懒惰", "lazy"],
                ],
            },
        ],
        output: "Frequency",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_freq_exact_range",
        message0: "%1 - %2 次 %3",
        args0: [
            {
                type: "field_number",
                name: "exact_min",
                value: 0,
                min: 0,
                precision: 1,
            },
            {
                type: "field_number",
                name: "exact_max",
                value: 1,
                min: 0,
                precision: 1,
            },
            {
                type: "field_dropdown",
                name: "is_greedy",
                options: [
                    ["贪婪", "greedy"],
                    ["懒惰", "lazy"],
                ],
            },
        ],
        output: "Frequency",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_anchor_start",
        message0: "匹配字符串开始位置",
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_anchor_end",
        message0: "匹配字符串结束位置",
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_anchor_word",
        message0: "匹配 %1",
        args0: [
            {
                type: "field_dropdown",
                name: "is_word",
                options: [
                    ["单词边界", "word"],
                    ["非单词边界", "noword"],
                ],
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_real_string_meta",
        message0: "特殊字符 %1 %2 %3",
        args0: [
            {
                type: "field_dropdown",
                name: "meta_char",
                options: [
                    ["任意字符", "meta_any"],
                    ["数字字符", "meta_d"],
                    ["非数字字符", "meta_D"],
                    ["空白字符", "meta_s"],
                    ["非空白字符", "meta_S"],
                    ["字母、数字、下划线", "meta_w"],
                    ["非字母、数字、下划线", "meta_W"],
                    ["换行符", "meta_n"],
                    ["回车符", "meta_r"],
                    ["制表符", "meta_t"],
                    ["其它转义符", "meta_other"],
                ],
            },
            {
                type: "field_input",
                name: "meta_string",
                text: "\\",
            },
            {
                type: "input_value",
                name: "freq",
                check: "Frequency",
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "block_group_captured",
        message0: "已捕获组 %1 ，  自定义组名 %2 ： %3 %4",
        args0: [
            {
                type: "field_number",
                name: "group_index",
                value: 1,
                min: 0,
                precision: 1,
            },
            {
                type: "field_checkbox",
                name: "is_index",
                checked: false,
            },
            {
                type: "field_input",
                name: "index",
                text: "test",
            },
            {
                type: "input_value",
                name: "freq",
                check: "Frequency",
            },
        ],
        previousStatement: "Main",
        nextStatement: "Main",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
]);

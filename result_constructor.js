function result_constructor(workspace, regex, text) {
    var color = 230;
    var patt = new RegExp(regex, "g");
    var matches = [...text.matchAll(patt)]; //  match.index
    var xpatt = XRegExp(regex, "g");
    var xmatches = XRegExp.match(text, xpatt); // freq_exec.length freq_exec.groups
    workspace.clear();
    var start_block = workspace.newBlock("block_result_match");
    start_block.setFieldValue("匹配结果：", "match");
    for (let index = 0; index < matches.length; index++) {
        var start = matches[index].index;
        var match = xmatches[index];
        var x = workspace.newBlock("block_result_total");
        x.setFieldValue(start, "start");
        x.setFieldValue(start + match.length, "stop");
        x.setColour(color);
        color = (color + 60) % 360;
        // console.log(x.getColour());
        var y = workspace.newBlock("block_result_match");
        y.setFieldValue(match, "match");
        x.appendStatementInput("content").connection.connect(
            y.previousConnection
        );
        var xexec = XRegExp.exec(match, xpatt);
        var sub_start = null;
        var sub_stop = null;
        for (let iindex = 0; iindex < xexec.length; iindex++) {
            if (xexec[iindex]) {
                var z = workspace.newBlock("block_result_exec");
                z.setFieldValue(iindex + 1, "group");
                z.setFieldValue(xexec[iindex], "content");
                if (sub_start == null) {
                    sub_start = z;
                    sub_stop = z;
                } else {
                    sub_stop.nextConnection.connect(z.previousConnection);
                    sub_stop = z;
                }
            }
        }
        var groups = xexec.groups;
        if (groups) {
            var keys = Object.keys(groups);
            for (let iindex = 0; iindex < keys.length; iindex++) {
                if (groups[keys[iindex]]) {
                    var z = workspace.newBlock("block_result_exec");
                    z.setFieldValue(keys[iindex], "group");
                    z.setFieldValue(groups[keys[iindex]], "content");
                    if (sub_start == null) {
                        sub_start = z;
                        sub_stop = z;
                    } else {
                        sub_stop.nextConnection.connect(z.previousConnection);
                        sub_stop = z;
                    }
                }
            }
        }
        if (sub_start != null) {
            x.appendStatementInput("groups").connection.connect(
                sub_start.previousConnection
            );
        }
        start_block.nextConnection.connect(x.previousConnection);
        start_block = x;
    }
}

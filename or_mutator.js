const xmlUtils = Blockly.utils.xml;
// const Msg = Blockly.Msg;
const Mutator = Blockly.Mutator;

Blockly.Extensions.registerMutator(
    "or_mutator",
    {
        orCount_: 0,

        /**
         * Create XML to represent the number of else-if and else inputs.
         * Backwards compatible serialization implementation.
         * @return {Element} XML storage element.
         * @this {Block}
         */
        mutationToDom: function () {
            if (!this.orCount_) {
                return null;
            }
            const container = xmlUtils.createElement("mutation");
            if (this.orCount_) {
                container.setAttribute("or", this.orCount_);
            }
            return container;
        },

        /**
         * Parse XML to restore the else-if and else inputs.
         * Backwards compatible serialization implementation.
         * @param {!Element} xmlElement XML storage element.
         * @this {Block}
         */
        domToMutation: function (xmlElement) {
            this.orCount_ = parseInt(xmlElement.getAttribute("or"), 10) || 0;
            this.rebuildShape_();
        },

        /**
         * Returns the state of this block as a JSON serializable object.
         * @return {?{orCount: (number|undefined), haseElse: (boolean|undefined)}}
         *     The state of this block, ie the else if count and else state.
         */
        saveExtraState: function () {
            if (!this.orCount_) {
                return null;
            }
            const state = Object.create(null);
            if (this.orCount_) {
                state["orCount"] = this.orCount_;
            }
            return state;
        },

        /**
         * Applies the given state to this block.
         * @param {*} state The state to apply to this block, ie the else if count and
         *     else state.
         */
        loadExtraState: function (state) {
            this.orCount_ = state["orCount"] || 0;
            this.updateShape_();
        },

        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Workspace} workspace Mutator's workspace.
         * @return {!Block} Root block in mutator.
         * @this {Block}
         */
        decompose: function (workspace) {
            const containerBlock = workspace.newBlock("or_start");
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;
            for (let i = 1; i <= this.orCount_; i++) {
                const orBlock = workspace.newBlock("or_or");
                orBlock.initSvg();
                connection.connect(orBlock.previousConnection);
                connection = orBlock.nextConnection;
            }
            return containerBlock;
        },

        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Block} containerBlock Root block in mutator.
         * @this {Block}
         */
        compose: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();
            // Count number of inputs.
            this.orCount_ = 0;
            const valueConnections = [null];
            const statementConnections = [null];
            let elseStatementConnection = null;
            while (clauseBlock && !clauseBlock.isInsertionMarker()) {
                switch (clauseBlock.type) {
                    case "or_or":
                        this.orCount_++;
                        valueConnections.push(clauseBlock.valueConnection_);
                        statementConnections.push(
                            clauseBlock.statementConnection_
                        );
                        break;
                    default:
                        throw TypeError(
                            "Unknown block type: " + clauseBlock.type
                        );
                }
                clauseBlock =
                    clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
            }
            this.updateShape_();
            // Reconnect any child blocks.
            this.reconnectChildBlocks_(
                valueConnections,
                statementConnections,
                elseStatementConnection
            );
        },

        /**
         * Store pointers to any connected child blocks.
         * @param {!Block} containerBlock Root block in mutator.
         * @this {Block}
         */
        saveConnections: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();
            let i = 1;
            while (clauseBlock) {
                switch (clauseBlock.type) {
                    case "or_or": {
                        // const inputIf = this.getInput("OR" + i);
                        const inputDo = this.getInput("or_" + (i + 2));
                        // clauseBlock.valueConnection_ =
                        //     inputIf && inputIf.connection.targetConnection;
                        clauseBlock.statementConnection_ =
                            inputDo && inputDo.connection.targetConnection;
                        i++;
                        break;
                    }
                    default:
                        throw TypeError(
                            "Unknown block type: " + clauseBlock.type
                        );
                }
                clauseBlock =
                    clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
            }
        },

        /**
         * Reconstructs the block with all child blocks attached.
         * @this {Block}
         */
        rebuildShape_: function () {
            const valueConnections = [null];
            const statementConnections = [null];
            let elseStatementConnection = null;

            if (this.getInput("ELSE")) {
                elseStatementConnection =
                    this.getInput("ELSE").connection.targetConnection;
            }
            for (let i = 1; this.getInput("OR" + (i + 2)); i++) {
                const inputIf = this.getInput("OR" + (i + 2));
                const inputDo = this.getInput("or_" + (i + 2));
                valueConnections.push(inputIf.connection.targetConnection);
                statementConnections.push(inputDo.connection.targetConnection);
            }
            this.updateShape_();
            this.reconnectChildBlocks_(
                valueConnections,
                statementConnections,
                elseStatementConnection
            );
        },

        /**
         * Modify this block to have the correct number of inputs.
         * @this {Block}
         * @private
         */
        updateShape_: function () {
            // Delete everything.
            for (let i = 1; this.getInput("OR" + (i + 2)); i++) {
                this.removeInput("OR" + (i + 2));
                this.removeInput("or_" + (i + 2));
            }
            // Rebuild block.
            for (let i = 1; i <= this.orCount_; i++) {
                this.appendDummyInput("OR" + (i + 2)).appendField("或者");
                this.appendStatementInput("or_" + (i + 2)).setCheck("Main");
            }
        },

        /**
         * Reconnects child blocks.
         * @param {!Array<?RenderedConnection>} valueConnections List of
         * value connections for 'if' input.
         * @param {!Array<?RenderedConnection>} statementConnections List of
         * statement connections for 'do' input.
         * @param {?RenderedConnection} elseStatementConnection Statement
         * connection for else input.
         * @this {Block}
         */
        reconnectChildBlocks_: function (
            valueConnections,
            statementConnections,
            elseStatementConnection
        ) {
            for (let i = 1; i <= this.orCount_; i++) {
                Mutator.reconnect(valueConnections[i], this, "OR" + (i + 2));
                Mutator.reconnect(
                    statementConnections[i],
                    this,
                    "or_" + (i + 2)
                );
            }
            Mutator.reconnect(elseStatementConnection, this, "ELSE");
        },
    },
    null,
    ["or_or"]
);

"use strict";
/*
 * Copyright (c) 2014, Yahoo Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.engine = exports.create = exports.ExpressHandlebars = void 0;
const express_handlebars_1 = require("./express-handlebars");
exports.ExpressHandlebars = express_handlebars_1.default;
function create(config = {}) {
    return new express_handlebars_1.default(config);
}
exports.create = create;
function engine(config = {}) {
    return create(config).engine;
}
exports.engine = engine;
//# sourceMappingURL=index.js.map
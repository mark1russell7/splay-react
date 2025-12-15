"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Viewer = void 0;
var react_1 = require("react");
var splay_1 = require("@mark1russell7/splay");
exports.Viewer = (0, react_1.memo)(function Viewer(_a) {
    var _b;
    var data = _a.data, size = _a.size, _c = _a.path, path = _c === void 0 ? "$" : _c, registry = _a.registry;
    return (_b = (0, splay_1.dispatch)(data, size, path, {
        registry: registry,
        fallback: function (type) { return <div style={{ color: "red" }}>Unknown type: {type}</div>; },
    })) !== null && _b !== void 0 ? _b : null;
});

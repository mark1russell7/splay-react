"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectViewer = exports.arrayViewer = exports.dateViewer = exports.booleanViewer = exports.numberViewer = exports.stringViewer = exports.undefinedViewer = exports.nullViewer = void 0;
exports.registerPrimitives = registerPrimitives;
var splay_1 = require("@mark1russell7/splay");
var nullViewer = function () { return <span style={{ color: "#888" }}>null</span>; };
exports.nullViewer = nullViewer;
var undefinedViewer = function () { return <span style={{ color: "#888" }}>undefined</span>; };
exports.undefinedViewer = undefinedViewer;
var stringViewer = function (ctx) { return (<span>&quot;{String(ctx.data)}&quot;</span>); };
exports.stringViewer = stringViewer;
var numberViewer = function (ctx) { return (<span style={{ color: "#06c" }}>{String(ctx.data)}</span>); };
exports.numberViewer = numberViewer;
var booleanViewer = function (ctx) { return (<span style={{ color: "#909" }}>{String(ctx.data)}</span>); };
exports.booleanViewer = booleanViewer;
var dateViewer = function (ctx) { return (<span>{ctx.data.toISOString()}</span>); };
exports.dateViewer = dateViewer;
var arrayViewer = function (ctx) {
    var data = ctx.data;
    var items = (0, splay_1.gridLayout)(ctx.size, data.length, 2, 40);
    var lastItem = items[items.length - 1];
    var height = lastItem ? lastItem.pos.y + 40 : 0;
    return (<div style={{ position: "relative", width: ctx.size.width, height: height }}>
      {items.map(function (_a) {
            var pos = _a.pos, size = _a.size, index = _a.index;
            return (<div key={index} style={{
                    position: "absolute",
                    left: pos.x,
                    top: pos.y,
                    width: size.width,
                    height: size.height,
                }}>
          {ctx.render(data[index], size, "".concat(ctx.path, "[").concat(index, "]"))}
        </div>);
        })}
    </div>);
};
exports.arrayViewer = arrayViewer;
var objectViewer = function (ctx) {
    var data = ctx.data;
    var entries = Object.entries(data);
    var items = (0, splay_1.listLayout)(ctx.size, entries.length, 30);
    return (<div style={{ position: "relative", width: ctx.size.width }}>
      {items.map(function (_a) {
            var pos = _a.pos, size = _a.size, index = _a.index;
            var entry = entries[index];
            if (!entry)
                return null;
            var key = entry[0], value = entry[1];
            return (<div key={key} style={{
                    position: "absolute",
                    left: pos.x,
                    top: pos.y,
                    width: size.width,
                    height: size.height,
                    display: "flex",
                }}>
            <span style={{ width: "30%", fontWeight: "bold" }}>{key}:</span>
            <span style={{ width: "70%" }}>
              {ctx.render(value, { width: size.width * 0.7, height: size.height }, "".concat(ctx.path, ".").concat(key))}
            </span>
          </div>);
        })}
    </div>);
};
exports.objectViewer = objectViewer;
function registerPrimitives(registry) {
    registry.register("null", exports.nullViewer);
    registry.register("undefined", exports.undefinedViewer);
    registry.register("string", exports.stringViewer);
    registry.register("number", exports.numberViewer);
    registry.register("boolean", exports.booleanViewer);
    registry.register("date", exports.dateViewer);
    registry.register("array", exports.arrayViewer);
    registry.register("object", exports.objectViewer);
}

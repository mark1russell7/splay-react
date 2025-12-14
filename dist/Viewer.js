import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useMemo } from "react";
import { inferType } from "@mark1russell7/splay";
export const Viewer = memo(function Viewer({ data, size, path = "$", registry, }) {
    const type = inferType(data);
    const factory = registry.get(type);
    if (!factory) {
        return _jsxs("div", { style: { color: "red" }, children: ["Unknown type: ", type] });
    }
    const ctx = useMemo(() => ({
        data,
        size,
        path,
        depth: path.split(".").length,
        render: (childData, childSize, childPath) => (_jsx(Viewer, { data: childData, size: childSize, path: childPath, registry: registry })),
    }), [data, size, path, registry]);
    return _jsx(_Fragment, { children: factory(ctx) });
});
//# sourceMappingURL=Viewer.js.map
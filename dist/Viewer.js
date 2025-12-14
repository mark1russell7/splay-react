import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { dispatch } from "@mark1russell7/splay";
export const Viewer = memo(function Viewer({ data, size, path = "$", registry, }) {
    return dispatch(data, size, path, {
        registry,
        fallback: (type) => _jsxs("div", { style: { color: "red" }, children: ["Unknown type: ", type] }),
    }) ?? null;
});
//# sourceMappingURL=Viewer.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireDirectory = require("require-directory");
var options = {
    extensions: ["ts", "js"],
    recurse: true,
    visit: function (obj) {
        return (typeof obj === "object" && obj.default !== undefined) ? obj.default : obj;
    },
};
var RouterFinder = /** @class */ (function () {
    function RouterFinder() {
    }
    RouterFinder.findAll = function (path) {
        return Object.values(requireDirectory(module, path, options));
    };
    return RouterFinder;
}());
exports.RouterFinder = RouterFinder;

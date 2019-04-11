"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var promisify = require("es6-promisify");
var pa11y = require("pa11y");
var supertest = require("supertest");
var app_1 = require("../../main/app");
var agent = supertest.agent(app_1.app);
var pa11yTest = pa11y();
var test = promisify(pa11yTest.run, pa11yTest);
describe("Accessibility", function () {
    // testing accessibility of the home page
    testAccessibility("/");
    // TODO: include each path of your application in accessibility checks
});
function testAccessibility(url) {
    describe("Page " + url, function () {
        it("should have no accessibility errors", function (done) {
            ensurePageCallWillSucceed(url)
                .then(function () {
                return test(agent.get(url).url);
            })
                .then(function (messages) {
                expectNoErrors(messages);
                done();
            })
                .catch(function (err) { return done(err); });
        });
    });
}
function ensurePageCallWillSucceed(url) {
    return agent.get(url)
        .then(function (res) {
        if (res.redirect) {
            throw new Error("Call to " + url + " resulted in a redirect to " + res.get("Location"));
        }
        if (res.serverError) {
            throw new Error("Call to " + url + " resulted in internal server error");
        }
    });
}
function expectNoErrors(messages) {
    var errors = messages.filter(function (m) { return m.type === "error"; });
    if (errors.length > 0) {
        var errorsAsJson = "" + JSON.stringify(errors, null, 2);
        assert_1.fail("There are accessibility issues: \n" + errorsAsJson + "\n");
    }
}

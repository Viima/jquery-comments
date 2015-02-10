module.exports = function(config) {
    config.set({
        basePath: "../",
        files: [
            "test/spec/*.js"
        ],
        autoWatch: true,
        frameworks: [
            "jasmine-jquery",
            "jasmine",
            "sinon"
        ],
        browsers: ["Chrome"],
        plugins: [
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-jasmine",
            "karma-jasmine-jquery",
            "karma-sinon",
            "karma-junit-reporter"
        ],
        junitReporter: {
            outputFile: "target/unit.xml",
            suite: "unit"
        }
    });
};

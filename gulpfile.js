const gulp = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const tsProject = require("gulp-typescript").createProject("tsconfig.json");
const replace = require("gulp-replace");

// CSS
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");

// JSON file writing
const fs = require("fs");

const browserSync = require("browser-sync").create();

const config = require("./config.json")

function buildHtml() {
    // shallow clone - we only care about the root mutating
    let data = {...config.nunjucksData};
    data.currentYear = new Date().getFullYear();
    return gulp.src("src/pages/**/*.njk")
        .pipe(nunjucksRender({
            path: ["src/templates/"],
            data: data
        }))
        .pipe(gulp.dest("build"));
}

function outputJson(cb) {
    let data = {...config.nunjucksData};
    fs.writeFileSync("build/data.json", JSON.stringify(data));
    cb();
}

function buildJavascript() {
    return gulp.src("src/ts/**/*.ts")
        .pipe(tsProject())
        .js
        .pipe(replace(/\"@product\"/g, JSON.stringify(config.nunjucksData.products)))
        .pipe(gulp.dest("build/js"));
}

function buildStyle() {
    return gulp.src("src/scss/**/style.scss")
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(gulp.dest("build/css"));
}

function copyStatic() {
    return gulp.src("src/static/**/*.*")
               .pipe(gulp.dest("build/static"))
}

const build = gulp.parallel([buildHtml, buildJavascript, buildStyle, outputJson, copyStatic]);

function initBrowserSync(cb) {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });
    cb();
}

function reloadBrowser(cb) {
    browserSync.reload();
    cb();
}

function watch() {
    return gulp.watch(["src/"], gulp.series(build, reloadBrowser));
}

exports.default = build;
exports.watch = gulp.series([build, initBrowserSync, watch]);
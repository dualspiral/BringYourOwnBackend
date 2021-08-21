const gulp = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const tsProject = require("gulp-typescript").createProject("tsconfig.json");

// CSS
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");

const browserSync = require("browser-sync").create();

function buildHtml() {
    return gulp.src("src/pages/**/*.njk")
        .pipe(nunjucksRender({
            path: ["src/templates/"]
        }))
        .pipe(gulp.dest("build"));
}

function buildJavascript() {
    return gulp.src("src/ts/**/*.ts")
        .pipe(tsProject())
        .js
        .pipe(gulp.dest("build/js"));
}

function buildStyle() {
    return gulp.src("src/scss/**/*.scss")
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(gulp.dest("build/css"));
}

function copyStatic() {
    return gulp.src("src/static/**/*.*")
               .pipe(gulp.dest("build/static"))
}

const build = gulp.parallel([buildHtml, buildJavascript, buildStyle, copyStatic]);

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
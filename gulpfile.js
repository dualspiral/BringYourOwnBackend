const gulp = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const tsProject = require("gulp-typescript").createProject("tsconfig.json");

// CSS
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("autoprefixer");

const browserSync = require("browser-sync").create();

function buildHtml() {
    return gulp.src("src/pages/**/index.njk")
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

exports.default = gulp.parallel([buildHtml, buildJavascript, buildStyle]);
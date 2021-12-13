"use strict";

const imagemin = require('gulp-imagemin');

const GulpClient = require('gulp'), { series, parallel, src, dest} = require('gulp'),
        browsersync = require('browser-sync').create(),
        fileinclude = require('gulp-file-include'),
        sass = require('gulp-sass')(require('sass')),
        groupmedia = require('gulp-group-css-media-queries'),
        imagemin = require('gulp-imagemin');

const project_folder = "dist/";
const source_folder = "src/";

const path = {
    build : {
        html : project_folder,
        css : project_folder + "src/css/",
        js : project_folder + "js/",
        img : project_folder + "img/",
        fonts : project_folder + "fonts/",
    },
    
    src : {
        html : source_folder + "*.html",
        css : source_folder + "scss/style.scss",
        js : source_folder + "js/script.js",
        img : source_folder + "img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts : source_folder + "fonts/*.ttf",
    },

    watch : {
        html : source_folder + "**/*.html",
        css : source_folder + "scss/**/*.scss",
        js : source_folder + "js/**/*.js",
        img : source_folder + "img/**/*.{jpg,png,svg,gif,ico,webp}",
    },

    clean : "./" + project_folder
}

function browserSync(cb) {
    browsersync.init({
        server : {
            baseDir: "./" + project_folder
        },
        port: 8888,
        notify: false
    });
    cb();
}

function html(cb) {
    cb();
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css(cb) {
    cb();
    return src(path.src.css)
        .pipe(
            sass({
                outputStyle : "expanded"
            })
            .on('error', sass.logError)
        )
        .pipe(groupmedia())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js(cb) {
    cb();
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images(cb) {
    cb();
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive : true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function watchFiles(cb) {
    GulpClient.watch([path.watch.html], html);
    GulpClient.watch([path.watch.css], css);
    GulpClient.watch([path.watch.js], js);
    GulpClient.watch([path.watch.img], img);
    cb();
}

function clean(cb) {
    cb();
    return delete(path.clean);
}

let build = series(clean, parallel(js, css, html, images));
let watch = parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.clean = clean;
exports.build = build; 
exports.watch = watch; 
exports.default = watch;
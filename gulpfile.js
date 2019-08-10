//引入gulp模块
const gulp = require('gulp');
const concat = require('gulp-concat');//合并js
const uglify = require('gulp-uglify');//压缩js
const rename = require('gulp-rename');//重命名
const less = require('gulp-less');//编译less
const clean_css = require('gulp-clean-css');//压缩css
const htmlMin = require('gulp-htmlmin');//压缩html
const livereLoad = require('gulp-livereload');//半自动化自动更新文件
const connect = require('gulp-connect');//热加载

//注册任务
gulp.task('js', function() {
    // 配置任务操作注册合并压缩js的任务
    return gulp.src('src/js/*.js')   //找到目标源文件把数据读取到gulp中
        .pipe(concat('build.js'))//临时合并文件
        .pipe(gulp.dest('dist/js/'))
        .pipe(uglify())             //压缩文件
        .pipe(rename({suffix:'.min'}))//重命名
        .pipe(gulp.dest('dist/js'))//输出
        .pipe(livereLoad())
        .pipe(connect.reload())
});
gulp.task('less', function() {
    // 配置任务操作注册less转化为css任务
    return gulp.src('src/less/*.less')   //找到目标源文件把数据读取到gulp中
        .pipe(less())             //编译为css文件
        .pipe(gulp.dest('src/css/'))
        .pipe(livereLoad())
        .pipe(connect.reload())
});
gulp.task('css',['less'],function() {
    // 配置任务操作注册合并压缩css任务
    return gulp.src('src/css/*.css')   //找到目标源文件把数据读取到gulp中
        .pipe(concat('main.css'))//临时合并文件
        .pipe(gulp.dest('dist/css/'))
        .pipe(clean_css())             //压缩css文件
        .pipe(rename({suffix:'.min'}))//重命名
        .pipe(gulp.dest('dist/css'))//输出
        .pipe(livereLoad()) //实时刷新
        .pipe(connect.reload())
});
gulp.task('html',function() {
    // 配置任务操作注册合并压缩css任务
    return gulp.src('index.html')   //找到目标源文件把数据读取到gulp中
        .pipe(htmlMin({collapseWhitespace:true}))//临时合并文件
        .pipe(gulp.dest('dist/'))
        .pipe(livereLoad())
        .pipe(connect.reload())
});
//半自动监视任务
gulp.task('watch',['default'],function () {
    //开启监听
    livereLoad.listen();
    //确认监听的目标以及绑定相应的任务
    gulp.watch('src/js/*.js',['js']);
    gulp.watch(['src/css/*.css','src/less/*.less'],['css']);
    gulp.watch('index.html',['html']);
});
//全自动监视任务
gulp.task('server',['default'],function () {
    //配置服务器的选项
    connect.server({
        root:'./dist/',
        livereload:true,
        port:5000
    });
    //确认监听的目标以及绑定相应的任务
    gulp.watch('src/js/*.js',['js']);
    gulp.watch(['src/css/*.css','src/less/*.less'],['css','lesss']);
    gulp.watch('index.html',['html']);
});
//注册默认任务
gulp.task('default', ['js','less','css','html']);//+return异步执行不加同步执行
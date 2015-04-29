var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    shell = require('gulp-shell')
    ;

/**
 * 运行服务
 */
gulp.task('server', shell.task([
  'hexo server'
]))

/**
 * 内容或风格变动自动刷新
 */
gulp.task('watch_source_themes', function() {
  livereload.listen();
  gulp.watch(['source/**','themes/**'], function(event){  
      setTimeout(function(){
          var consoleInfo = event.path.replace(__dirname,'');
          livereload.changed(consoleInfo);
      },500);
  });  
});

/**
 * 发布上线
 */
gulp.task('publish', shell.task([
  'hexo d -g'
]))


gulp.task('default', ['server','watch_source_themes']);
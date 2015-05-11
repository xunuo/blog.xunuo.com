var gulp = require('gulp'),
    shell = require('gulp-shell'),
    exec = require('child_process').exec,
    serverPort = 1234,
    enConfigString = ' --config _config-en.yml',
    cnConfigString = ' --config _config-cn.yml'
    ;

/**
 * 新增文章
 */
gulp.task('add-new-blog', shell.task([
  'hexo new this-is-a-new-blog'
]));

/**
 * 新增页面 (to source root base)
 */
gulp.task('add-new-page', shell.task([
  'hexo new page this-is-a-new-page'
]));

/**
 * 运行服务
 */
gulp.task('server', function (cb) {
    
  console.log('启动服务 : "http://localhost:' + serverPort + '"');
    
  exec('hexo server -p ' + serverPort + enConfigString);
    
  // 等待服务启动打开浏览器
  setTimeout(function(){
      exec('open -a Google\\ Chrome "http://localhost:' + serverPort + '"', function (err, stdout, stderr) {
        cb(err);
      });
  },3000);
    
})

/**
 * 终止残余服务
 */
gulp.task('kill-server', shell.task([
  'kill -9 $(lsof -i:' + serverPort + ' |awk \'{print $2}\' | tail -n 2)'
]));


/**
 * 清理生成临时文件及中断当前运行服务的端口
 */
gulp.task('clean', shell.task([
  'kill -9 $(lsof -i:' + serverPort + ' |awk \'{print $2}\' | tail -n 2)',
  'hexo clean',
  'rm -rf .deploy_git'
]));


/**
 * 发布上线
 */
// 'PP' == 'push-and-publish'
gulp.task('PP',shell.task([
    
  'echo "正在推送到 Github Pages ..."',
  'hexo d -g' + enConfigString,
  'echo "成功推送到 Github Pages。"',
    
  'echo "正在推送到 Gitcafe Pages ..."',
  'hexo d -g' + cnConfigString,
  'echo "成功推送到 Gitcafe Pages。"',
    
  'echo "PUSH变更到仓库..."',
  'git add . && git commit -a -m "update" && git push',
  'echo "PUSH成功。"'
    
]))

gulp.task('default', ['server','watch_source_themes','watch_config']);
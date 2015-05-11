var gulp = require('gulp'),
    shell = require('gulp-shell'),
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
gulp.task('server', shell.task([
  'hexo server -p ' + serverPort
]));

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
  
  'echo "PUSH变更到仓库..."',
  'git add . && git commit -a -m "update" && git push',
  'echo "PUSH成功。"',
    
  'echo "正在推送到 Github Pages ..."',
  'hexo d -g' + cnConfigString,
  'echo "成功推送到 Github Pages。"'
    
  //'echo "正在推送到 Gitcafe Pages ..."',
  //'hexo d -g' + cnConfigString,
  //'echo "成功推送到 Gitcafe Pages。"'
    
]))

gulp.task('default', ['server','watch_source_themes','watch_config']);
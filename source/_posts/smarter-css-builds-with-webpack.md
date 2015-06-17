title: 「译」- 使用Webpack更加智能的编译CSS
category: 开发者工具
tags: [webpack, CSS，预编译，翻译]
---

现在应该没人会把所有样式都写入一个超大的CSS里面了吧...

> 原文：[Smarter CSS builds with Webpack](http://bensmithett.com/smarter-css-builds-with-webpack/)

<!--more-->

---


作为一个常常写CSS的开发人员，如果你接触过[SMACSS](https://smacss.com/)、[SUIT](https://suitcss.github.io/)或[BEM](https://en.bem.info/method/definitions/)的话，应该会自然而然的将文件拆成更小更分散的模块。

```
stylesheets/
  config/
    colors.sass
    media_queries.sass
  modules/
    btn.sass
    dropdown.sass
    header.sass
  utilities/
    align.sass
    clearfix.sass
```

当你需要将这些编译成单个文件(如`bundle.css`)供用户下载时，你不得不手工指定应用需要哪些文件。

在SASS中，`@import`也许是这样的：

```
@import "vendor/normalize"

@import "config/colors"
@import "config/media_queries"

@import "modules/btn"
@import "modules/dropdown"
@import "modules/header"

@import "utilities/align"
@import "utilities/clearfix"
```

如果你使用过 [Rail](http://guides.rubyonrails.org/asset_pipeline.html) 或 [Middleman](https://middlemanapp.com/)，你一定对 [Sprockets](https://github.com/sstephenson/sprockets#managing-and-bundling-dependencies) 的 `//= require` 语句不陌生:

```
//= require vendor/normalize
//= require_tree ./modules
//= require_tree ./utilities
```

或者可能你有自己的一套流水线，使用[Gulp](http://gulpjs.com/)或[Grunt](http://gruntjs.com/)去收集、处理与合并这些单独的文件：

```javascript
gulp.task('styles', function () {
  gulp.src('styles/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./tmp'))
    .pipe(concat('bundle.css'))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./build'));
});
```

所有的这些方式都有个前提，就是你需要知道哪些CSS是你的应用真正用到的，你不得不硬着头皮去维护一个无聊的依赖文件列表，或是干脆包含一整个目录的文件。

这样一来，你很有可能引入一些冗余的CSS，而且只能寄托于在偶尔编写HTML模板时候根据标签里的class name来发现并清理它们。（当然这里有一些很棒的工具可以帮到你，如：[uncss](http://addyosmani.com/blog/removing-unused-css/)）

无论如何，在HTML头部去维护一份CSS依赖，对于我来说，都是个无法忍受的事情。

不过不用担心，如果你使用Javascript模块来生成HTML，一切将迎刃而解（如果你还没这样做，不如趁早尝试这种来自未来的技术）。

## 使用Webpack引入UI依赖

用[Webpack](http://webpack.github.io/)处理模块就像在耍瑞士军刀一样，[一切](http://webpack.github.io/docs/motivation.html)都是为了让你在编写UI模块的时候能够更加精准的引入依赖。

或许你曾使用过[CommonJS规范](http://dailyjs.com/2010/10/18/modules/)编写过模块：

```
var _ = require("underscore");

var findTastiestPizza = function (pizzas) {
  return _.find(pizzas, function (pizza) {
    return pizza === "hawaiian";
  });
};

module.exports = findTastiestPizza;
```

在NodeJS中用CommonJS依赖加载不是什么稀奇事，但是到了浏览器端，因为网络请求是异步的，所以比较麻烦，需要借助SeaJS、requireJS。

为了让我们的模块能跑在浏览器上，我们得使用Webpack或[Browserify](http://browserify.org/)来将我们页面的所有依赖都打包成单个文件。

可是UI组件不仅仅包含JS，还有CSS、图片甚至字体，[Webpack认识到了这点](http://webpack.github.io/docs/motivation.html#why-only-javascript)，得益于它的[loader机制](http://webpack.github.io/docs/using-loaders.html)，使`require`语法强大到能够精准的引用你需要的任何依赖，而不仅仅是一个单纯的JS文件：

```javascript
require("stylesheets/modules/btn");
var img = require("images/default_avatar.png");
```

嗯，让我们回到我们最初的问题，如何使用程序程序更加智能的生成`bundle.css`，一个基于HTML真正使用到的CSS，脱离之前手工维护列表的苦海。

所有你需要的做的就是在在所有模板视图声明你的CSS和SASS依赖，和声明JS依赖一样，Webpack将生成最终你需要的所有内容，当然，如果需要，还可以对内容进行预先处理或后置加工。

举个栗子，为我们的应用声明一个加载点：

```javascript
// index.js
var React = require("react");
var Header = require("./header");
var Footer = require("./footer");

var Page = React.createClass({
  render () {
    return (
      <div>
        <Header />
        <Footer />
      </div>
    );
  }
});

React.render(<Page />, document.querySelector("#main"));
```

...而那些引入的子模块，它们自身声明了自己所需的SASS依赖...

```javascript
// header.js
var React = require("react");

require("stylesheets/modules/header");

var Header = React.createClass({
  render () {
    return (
      <div className="header">
        Header
      </div>
    );
  }
});

module.exports = Header;
```

```javascript
// footer.js
var React = require("react");

require("stylesheets/modules/footer");
require("stylesheets/utilities/clearfix");

var Footer = React.createClass({
  render () {
    return (
      <div className="footer u-clearfix">
        Footer
      </div>
    );
  }
});

module.exports = Footer;
```

...Webpack 最终将生成的像下面这样的CSS文件

```css
.header { /* ... */ }
.footer { /* ... */ }
.u-clearfix { /* ... */ }
```

你看，是不是很神奇！

## 其它的一些秘密

### 不再依赖代码书写顺序

值得注意的是，使用这种方式你将无法像手动模式那样组织代码顺序，Webpack将以你指定的`require`顺序生成代码，就像叠叠乐一样。

所以当我们改变 `header`和`footer` 模块的依赖顺序...

```javascript
// index.js
var Footer = require("footer");
var Header = require("header");
```

footer 模块的依赖的样式内容，以及footer中包含的.u-clearfix样式（clearfix），将首先生成出来：

```css
.footer { /* ... */ }
.u-clearfix { /* ... */ }
.header { /* ... */ }
```

通常我们在手工维护一个CSS依赖列表时候会根据不同功能类型来进行特定排序，如：

- base
- modules
- utilities

这些顺序确保了样式间的相互覆写正常。

现在，你无法继续依赖手工排序了，所以你必须更加谨慎的书写你的样式。

我就从来都不喜欢被代码顺序牵着走，我通常会避免在不同的文件中声明相同一个HTML元素的样式，但是有些特殊情况会出现在几个class中都声明了相同的样式属性，不得已的时候你可能会写成这样：

```html
<div class="footer u-clearfix">
```

这个例子中你需要对这些选择器的处理非常小心才行，SUIT [推荐使用 !important](https://github.com/suitcss/utils#usage) 来处理这种情况，或者你可以试试这种[多重指定class的HACK方式](http://csswizardry.com/2014/07/hacks-for-dealing-with-specificity/#safely-increasing-specificity)来提高优先级。


### 关于SASS全局声明

如果你使用SASS的`@import`处理你的样式，你可能还需要在各个模块共享你的变量和mixin声明，那么你可能会写过这样的代码：

```css
@import "config/variables"
@import "mixins/vertical_align"

@import "modules/header"
@import "modules/footer"
```

这样一来跟随在后面的模块都可以共享到config和mixins的内容。

在Webpack的世界里，每一个sass文件都是隔离编译的，[这不无道理](http://blog.teamtreehouse.com/tale-front-end-sanity-beware-sass-import)，但我觉得有个好的办法来处理这种事情，那就是在你需要引入变量和mixins的地方手动引入它们：

```css
// header.sass
@import "config/colors"

.header
  color: $red
```

```css
// footer.sass
@import "config/colors"

.footer
  color: $blue
```

各文件明确指定了自己要的依赖，在我看来，非常轻巧，非常棒！

## 最最有价值的留在最后

我在Github上创建了一个[例子](https://github.com/bensmithett/webpack-css-example)供大家把玩，当然别忘了Star一下 :)

---

## 译文之外

还有一篇不错的 [Webpack for react](http://christianalfoni.github.io/react-webpack-cookbook/index.html) 的book，其中也有关于sass、less的相关配置，可以参考一下 :)
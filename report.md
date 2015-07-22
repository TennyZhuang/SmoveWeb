# Web前端技术实训综合实验报告
## --SmoveWeb 
<br>
<br>
### 2014012056 庄天翼
### 2013013295 柯豪
### 邮箱 <mailto:zty0826@gmail.com>
### 项目发布链接 <https://smoveweb.firebaseapp.com>

<br>
<br>

## 目录
1. 游戏简介
	1. 游戏元素
	2. 游戏规则
	
2. 项目架构
	1. 文件结构
	2. 第三方库
	3. 外部文件
	4. 分工情况

3. 游戏实现 
	1. 实现细节
	2. 困难与处理方法
	3. 性能优化
    4. 单元测试
	
4. 本地运行方式

5. 分工情况


## 游戏简介

### 游戏元素

1. 玩家棋子：显示为红色或白色棋子，其中红色表示自己控制的棋子，白色是其他玩家
2. 敌方棋子：显示为黑色的棋子，从四个方向不断出现，沿直线运动
3. 死亡玩家：显示为灰色的棋子，固定在界面上。
4. 计时器：在右上角显示，坚持的时间最长的玩家胜利。

### 游戏规则

1. 登陆阶段：输入用户名并回车后即进入准备完成状态，同时等待其他玩家准备。
2. 准备阶段：所有用户准备完成后立刻进入游戏。如果用户准备完成十秒后仍有其他用户没有完成准备，该用户可以移除未准备用户进入游戏。
3. 游戏开始：界面的四个方向会有黑色棋子出现，玩家要躲避黑色棋子。玩家移动时，不能移动到已经有其他玩家的位置。每次背景颜色变化表示用户进入了下一关卡。
4. 玩家失败：当玩家棋子碰到黑色棋子后，玩家的状态会变更为失败。玩家可以继续观看游戏，但不能进行任何操作。
5. 游戏结束：所有玩家死亡后，显示玩家的排名，并可以选择重新开始游戏。

<br>


## 项目架构

### 文件结构

+ app
	+ audios
		+ *.ogg 
		+ *.mp3 `// 游戏用到的音乐文件  `
	+ fonts
	+ index.html
	+ robots.txt
	+ styles
		+ main.css
	+ favicon.ico
	+ images
		+ smove_logo.png `// 使用 Adobe Illustrator 绘制 `
	+ level.json  `// 关卡数据`
	+ scripts
		+ remote.js `// 主要处理与 firebase 的交互`
		+ maiin.js  `// 主要处理游戏本身的运行逻辑 `
+ dist
	+ ... `// app 通过 gulp build 生成的目录 `
+ node_modules
	+ ...
+ test
	+ index.html `// test serve `
	+ spec 
		+ test.js 
+ bower.json 
+ package.json
+ bower_components
	+ ...
+ gulpfile.babel.js
+ firebase.json `// for deploy the dist derectory to firebaseapp `

### 第三方库

开发和测试中使用了Yeoman、gulp、mocha等一系列工具。

发布的游戏中引用的第三方库仅有 jQuery 与 firebase。

jQuery 用于 ajax 和一些页面基本操作。

firebase 提供数据库功能，保持玩家之间的同步。

### 外部文件

`LevelGenerator.py` 用于生成关卡数据，通过调整参数可以改变游戏难度。

`smove_logo.ai` 为画 logo 时用到的AI文件。

### 分工情况

庄天翼主要负责项目架构，游戏 Canvas 部分（main.js）和 UI 设计（外部文件AI）。

柯豪主要负责 关卡数据的生成（外部文件 Python） 与 firebase 交互的API （remote.js）和测试部分。

<br>


## 游戏实现

### 实现细节

`remote.js` 处理了 login 的相关事件，并提供了很多用于和 firebase 交互的全局 API。

`main.js` 是在游戏运行时执行，有三个类，分别为 Game， Chess 和 Enemy。`Game.prototype.run` 为封装好的游戏开始函数，在 `remote.js` 里被调用。

firebase 储存了所有用户的状态，用户进入页面时为 `online`，登陆完成后变更为 `ready`，通过 `on('value')` 监测所有用户，所有用户都登陆后就会调用 `Game.prototype.run`。

`Game.prototype.run` 被调用以后，所有用户的状态由 `ready` 变更为 `alive`，`Game.prototype.refresh` 和 `Game.prototype.enemiesMove` 被每 30 ms 调用一次，同时增加碰撞检测监听。

碰撞检测在 `Game.prototype.enemiesMove` 中进行，move 后检查 Chess 和 Enemy 的圆心距离，如果大于他们的半径之和就会通过 jQuery 模拟一个 `fail` 事件。

`document` 监测到 `fail` 事件后调用，会将该玩家的状态变更为 `failed`，并移除键盘操控事件。

当状态为 `alive` 的玩家为 0 时，gameProcess 会在 `remote.js` 中调用 endGame。

用户按下 RESTART 按钮后，刷新页面，重新开始。

### 困难与处理方法

#### 随机黑棋数据的生成与同步问题

因为没有服务器端的代码，所以随机黑棋数据的同步是一个比较困难的情况。为了处理这种情况，我们通过 Python 脚本预先生成数据，并放在 app 目录下，游戏开始前先加载完黑棋的数据，在游戏开始后以相同的时间差依次将黑棋的数据取出。

生成数据的脚本在 ext 目录里，生成的数据保存在 `app/level.json` 里，记录了一百多波黑棋的速度和方位等。

#### 开始时间的同步问题

这个情况由第一个问题的解决方案衍生而来，由于黑棋的数据是保存在浏览器端的，所以开始时间的统一对游戏的同步特别重要。目前我们设想的解决方案是通过记录一个时间戳，将最后一个登陆玩家的时间加上 1s 作为游戏的统一开始时间。


#### 玩家移动位置的冲突

作为一个多人游戏，本游戏中玩家之间一个重要的交互就是能互相卡位，这也是实现上的一个比较大的难点，必须实时更新玩家的位置信息并查询。

为了加快访问数据库的速度，减少卡顿，我们采取了空间换时间的策略，在数据库里维护了一个 `Chess` 数组，保存了棋盘上所有位置的玩家信息，并在 `UserList` 中保存的信息中移除了位置信息。

通过这种方式，带来的优化有 

+ 大幅度减少了对 UserList on value 事件的触发，仅在玩家状态或者人数发生改变时做相应的处理。
+ 加快了位置冲突情况的判定，将原先遍历 `UserList` 的 *O(n)* 时间复杂度 优化为 直接访问 `Chess` 的 *O(1)* 复杂度。

### 性能优化

1. 调整合适的刷新频率，不影响视觉效果的情况下减少卡顿。
2. 用了一些全局变量减少界面刷新时的消耗。
3. 使用 HTML5 的 page visibility 属性，在用户不访问当前标签页的时候，暂停页面刷新。
4. 在登陆界面加载完成后，游戏开始前，等待用户输入的过程中，加载音乐，避免因为音乐加载导致页面卡顿。
5. 对 firebase 数据库结构的优化，见 困难与处理方法/玩家移动位置的冲突。

### 单元测试
1. 使用了YeoMan架构生成的Test目录下，使用BDD模式的Mocha编写的unitTest
2. 测试结果如下

![](http://i.imgur.com/BLQzZc8.png)

## 本地运行方式

预先安装 gulp

	npm install --global gulp

在根目录下执行

	npm install
	bower install
	gulp serve

可以实时监听文件并在 <http://localhost:9000> 进行调试

执行

	gulp serve:test
	
可以运行测试环节，我们在测试中验证了一些 firebase 的 API 的正确性。


执行 

	gulp build
	
可以生成压缩过的代码并集成在 dist 目录下。

安装 firebase-tools

	npm install -g firebase-tools
	
并执行
	
	firebase deploy

可以将项目下的dist目录部署到 firebaseapp。




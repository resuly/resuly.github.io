---
layout: post
title: "把Jupyter Notebook配置成Coding神器"
date: "2017-11-03 16:33:29 +0800"
author: "resuly"
header-img: "img/post-bg-unix-linux.jpg"
tags:
  - Jupyter, Windows, python
---

Anaconda装完以后，还是有很多不爽的地方。比如在Windows平台下默认的Jupyter Notebook字体是宋体，看起来十分难受。比如写代码时候的快捷键、自动格式化代码等功能也都不如在Sublime Text编辑器中那样顺畅。本文主要介绍如何在安装好Jupyter之后，进一步的配置它，让它用起来更加得心应手，极大提高你的开发效率。

## 修改字体+配置Sublime Text快捷键
第一步当然是修改字体了，由于强迫症的原因，我没法在中英文都是宋体的情况下编程。

首先安装[jupyterthemes](https://github.com/dunovank/jupyter-themes)，并配置默认主题。安装命令如下：

{% highlight python %}
# install jupyterthemes
pip install jupyterthemes

# 配置默认主题
jt -r
{% endhighlight %}

重置完了默认主题之后，你可以发现这个目录已经被创建：C:/Users/用户名/.jupyter/custom

![](/img/in_post/2017/11/20171103164904.png)

Jupyter每次运行的时候，都会从这个目录自动加载两个文件custom.css和custom.js。从名字就可以看出来，这两个个性化的文件可以写入个性化的配置内容。所以我们在css中修改字体样式、界面风格等等。在js文件中可以加入快捷键等个性化设置。

如果你不想了解具体内容，可以直接下载我配置好的文件进行替换，字体和快捷键设置就大功告成了。下载 <a href="/img/in_post/2017/11/custom.zip">custom.zip</a>

Sublime Text快捷键有哪些好处，如何使用请继续往下看。

### 修改字体
在custom.css中写入如下内容：
{% highlight css %}
.introspection, .input_prompt,.output_prompt, .output pre, .CodeMirror pre {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 15px;
    line-height: 22px;
}
{% endhighlight %}
熟悉css的同学应该可以看出，这段代码主要是把标题、代码内容等区域的css样式改了。你也可以把其中的font-family替换成自己喜欢的字体，比如微软雅黑：
{% highlight css %}
font-family: "Microsoft Yahei";
{% endhighlight %}
刷新一下你的撸码页面，字体是不是看起来顺眼多了？
### Sublime Text快捷键
修改方法很简单，在上述custom.js中写入如下内容，刷新即可（[参考文献](http://blog.rtwilson.com/how-to-get-sublime-text-style-editing-in-the-ipythonjupyter-notebook/)）：
{% highlight js %}
require(["codemirror/keymap/sublime", "notebook/js/cell", "base/js/namespace"],
    function(sublime_keymap, cell, IPython) {
        cell.Cell.options_default.cm_config.keyMap = 'sublime';
        var cells = IPython.notebook.get_cells();
        for(var cl=0; cl< cells.length ; cl++){
            cells[cl].code_mirror.setOption('keyMap', 'sublime');
        }
    }
);
{% endhighlight %}

Sublime Text编辑器中内置了多种快捷键，可以很方便的进行代码编辑。
我结合日常使用习惯，把Jupyter中的常用快捷键进行了整理，并录制了GIF演示图。（手机浏览请左右滑动下面的表格）
<style>
#shortcuts img{margin:0}
</style>
<table id="shortcuts">
	<thead>
		<tr>
			<th>快捷键</th>
			<th>作用</th>
			<th>演示</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>L</kbd>
			</td>
			<td>选择一行(连续选取多行)</td>
			<td><img src="/img/in_post/2017/11/ss1.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>D</kbd>
			</td>
			<td>选择当前变量(或重复选择并编辑)</td>
			<td><img src="/img/in_post/2017/11/ss2.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>Shift</kbd>+
				<kbd>M</kbd>
			</td>
			<td>选择括号里面的内容</td>
			<td><img src="/img/in_post/2017/11/ss3.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>Shift</kbd>+
				<kbd>K</kbd>
				<br>或
				<kbd>Ctrl</kbd>+
				<kbd>X</kbd>
			</td>
			<td>删除一行</td>
			<td><img src="/img/in_post/2017/11/ss4.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>K</kbd>
				<kbd>K</kbd>
			</td>
			<td>删除本行光标后的所有内容</td>
			<td><img src="/img/in_post/2017/11/ss5.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>Shift</kbd>+
				<kbd>D</kbd>
			</td>
			<td>快速复制一行</td>
			<td><img src="/img/in_post/2017/11/ss6.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>K</kbd>
				<kbd>U</kbd>
			</td>
			<td>大写</td>
			<td><img src="/img/in_post/2017/11/ss7.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>K</kbd>
				<kbd>L</kbd>
			</td>
			<td>小写</td>
			<td><img src="/img/in_post/2017/11/ss8.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>/</kbd>
			</td>
			<td>注释</td>
			<td><img src="/img/in_post/2017/11/ss9.gif"></td>
		</tr>
		<tr>
			<td>
				<kbd>Ctrl</kbd>+
				<kbd>Tab</kbd>
			</td>
			<td>代码提示,可以连续多按</td>
			<td><img src="/img/in_post/2017/11/ss10.gif"></td>
		</tr>
	</tbody>
</table>

# 安装Jupyter拓展插件
除了以上功能，我个人还比较偏向代码折叠，自动整理对齐等功能。jupyter_contrib_nbextensions正是为了解决这样的个性化需求所提供的一款插件，安装代码如下：
{% highlight cmd %}
pip install jupyter_contrib_nbextensions
pip install jupyter_nbextensions_configurator
jupyter nbextensions_configurator enable --user
{% endhighlight %}

重启 jupyter server，就可以看见插件管理的Tab了。如果看不见，请检查自己电脑上是不是有多个python环境，请把插件安装到和jupyter一致的python环境中。
![](/img/in_post/2017/11/20171107202611.png)

### 代码折叠、标题折叠
把Codefolding和Collapsible Headings打开即可：
![](/img/in_post/2017/11/20171107202752.png)
![](/img/in_post/2017/11/folding.gif)


### 自动整理代码
首先安装yapf，然后把Code prettify打开即可，点击标题可以自己设置快捷键。
{% highlight cmd %}
pip install yapf
{% endhighlight %}
![](/img/in_post/2017/11/20171107203426.png)
启用后可以按快捷键，或者小锤子图标进行代码自动整理。比如下面这杂乱不堪的代码：
![](/img/in_post/2017/11/formatting.gif)


其实还有很多其他功能可以使用，希望大家都能够利用Jupyter Notebook提高自己的开发效率。欢迎留言，一起探索交流。

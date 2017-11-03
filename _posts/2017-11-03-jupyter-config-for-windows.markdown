---
layout: post
title: "Windows平台配置 Jupyter 字体和快捷键"
date: "2017-11-03 16:33:29 +0800"
author: "resuly"
header-img: "img/post-bg-e2e-ux.jpg"
tags:
  - Jupyter,Windows
---

Anaconda装完以后，默认的Jupyter字体貌似是宋体？其实我并不是很讨厌默认的主题和配色方案，只是我没法接受在中英文都是宋体的情况下编程，修改流程如下。
![](/img/in_post/2017/11/20171103170348.png)

### 安装插件 jupyterthemes
{% highlight python %}
# install jupyterthemes
pip install jupyterthemes

# 配置默认主题
jt -r
{% endhighlight %}

重置完了默认主题之后，你可以发现这个目录已经被创建：C:/Users/用户名/.jupyter/custom

进入这个目录。
### 修改默认样式
![](/img/in_post/2017/11/20171103164904.png)

下载<a href="/img/in_post/2017/11/custom.zip">custom.zip</a>,并把两个文件解压到这个目录，大功告成。

第二种方案：<a href="/img/in_post/2017/11/custom.zip">custom2.zip</a>

其中CSS文件是修改了字体样式，JS文件添加了一个快捷键。<b>Ctrl+方向键下</b>就可以快速复制一行。

### 最终效果
![](/img/in_post/2017/11/20171103165510.png)

字体是不是看起来顺眼多了？

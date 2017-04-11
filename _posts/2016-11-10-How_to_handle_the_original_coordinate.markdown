---
layout: post
title: How to handle the original coordinate?
subtitle: Data clean for visualizaiton
date: {}
author: resuly
header-img: img/post-bg-2015.jpg
catalog: true
tags:
  - 坐标
  - Visualization
published: false
---

# Problems
The coordinate from Visum is based on real distance.

There are many different coordinates for various uses. In our case, the dataset has consisted of many big numbers base on x and y coordinate axis. They are not longitude and latitude value for geographic use, so we can't use this data directly for Google Maps or Baidu Maps.

![1.png]({{site.baseurl}}/_posts/1.png)


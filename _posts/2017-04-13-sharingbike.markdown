---
layout: post
title: "畅想公共自行车导航"
subtitle: "The outline of sharing bike navigation"
date: "2017-04-08 16:05:05 +0800"
author: "resuly"
header-img: "img/post-bg-bike.jpg"
catalog: true
tags:
  - 爬虫
  - PHP
  - 共享单车
---

## 前言

共享单车是近期国内的热门话题。各种单车厂商五花八门，往往需要安装多个App才能很好的使用单车。两三个应用切来切去找车，这让我非常头疼。

我想做一个项目，将城市共享单车的资源整合到一起，争取利用深度学习技术对共享单车做出交通预测，相成一个包括自行车在内的路线导航系统。

注：本项目仍在开发与构思中。

## 数据整合

在分析完永安自行车、ofo、摩拜单车的找车接口后，我成功的将他们整合到了一起。并用 Leaflet.js 将他们放到一个地图里面显示。目前只能当作一个找车应用使用。

永安自行车是固定车桩的，所以能显示车桩的可借数量。ofo与摩拜单车没有固定车位，得到的是GPS和车辆的信息。

数据示例（整合成统一的json格式）：

{% highlight javascript %}
# 永安
"geometry": {
  "coordinates": [
    120.741994,
    31.268605
  ],
  "type": "Point"
},
"type": "Feature",
"properties": {
  "type": "yongan",
  "name": "苏大二期东",
  "availBike": "0",
  "address": "苏大公寓2期门口",
  "capacity": "30"
}
{% endhighlight %}

{% highlight javascript %}
# ofo
"geometry": {
  "coordinates": [
    120.748678,
    31.262896
  ],
  "type": "Point"
},
"type": "Feature",
"properties": {
  "type": "ofo",
  "name": "BAO1w",
  "ordernum": "qK0wGn",
  "userIdLast": "5"
}
{% endhighlight %}
ofo有几个有意思的变量命名，我们可以发现 name 和 ordernum 貌似是同一种加密方式处理过的字符串，我想应该就是车牌号和四位数的密码。一旦将 ordernum 递交给服务器进行解码，应该就是生成了一个订单。userIdLast 我猜是用户 id 的最后一位数字，实际没什么太大利用价值。

{% highlight javascript %}
# 摩拜单车
"geometry": {
  "coordinates": [
    120.748678,
    31.262896
  ],
  "type": "Point"
},
"type": "Feature",
"properties":{
  "type": "mobike",
  "name": "0256509012#",
  "biketype": 999,
  "distId": "0256509012",
  "distNum": 1,
  "distance": "149"
}
{% endhighlight %}

显示效果：

![](/img/in_post/2017/04/2.jpg)

![](/img/in_post/2017/04/3.png)

![](/img/in_post/2017/04/4.png)


测试地址：

实时定位
[https://afc.v2tm.com/bike/](https://afc.v2tm.com/bike/)

模拟南京东南大学
[https://afc.v2tm.com/bike/test](https://afc.v2tm.com/bike/test)

## 值得注意的问题

- Leaflet 能使用的中国地图就几个，见[ChineseTmsProviders](https://github.com/htoooth/Leaflet.ChineseTmsProviders)。
由于他们调用都是的图片，所以清晰度欠佳。现在很多地图都是直接 canvas 绘图，所以下一步打算换高德的官方 Javascript SDK 试一试。
- HTML5 请求地理位置、摄像头等，必须启用https。当然 localhost 也可以，但等我部署到服务器上才发现有这么个错误。本来已经弄完打算收工了，申请ssl证书，配置服务器又折腾到半夜。
- ofo的数据必须携带 token，登录某个帐号才能生成这个 token。
- 永安的接口含有大量中文字符，使用PHP处理的话，可以参考以下函数：
{% highlight php %}
public function ext_json_decode($str, $mode=false){  
    $str = preg_replace('/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/','$1"$3":',$str);
    $str = str_replace('\'','"',$str);
    $str = str_replace(" ", "", $str);
    $str = str_replace('\t', "", $str);
    $str = str_replace('\r', "", $str);
    $str = str_replace("\l", "", $str);
    $str = preg_replace('/s+/', '',$str);
    $str = trim($str,chr(239).chr(187).chr(191));

    return json_decode($str, $mode);  
}
{% endhighlight %}


## 下一步

期待抓取适量的数据，使用 Deep Learning 预测某时某地的自行车数量，形成一个完整的公交导航系统。

未完待续...

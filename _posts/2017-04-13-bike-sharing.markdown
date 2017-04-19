---
layout: post
title: "畅想公共自行车导航"
subtitle: "The plan of bike-sharing navigation"
date: "2017-04-08 16:05:05 +0800"
author: "resuly"
header-img: "img/post-bg-bike2.jpg"
catalog: true
tags:
  - 爬虫
  - PHP
  - 共享单车
---

## 前言

自从ofo的CEO兼联合创始人戴威发布第一辆小黄车之后，共享单车变迅速国内的热门话题。现如今的ofo已经市值超过2亿美元。无固定车桩，可以随时随地归还是共享单车火起来的重要原因之一，基数大、低门槛的特点给公共交通的发展带来了一个新的契机。

目前市场上的各种单车厂商五花八门，仅在南京，就有超过五六家的竞争者在投放运营着这些单车。对于消费者而言，往往需要安装多个App才能顺利找到一辆可以用的车。有人测试过，从 App Store 可以下载的单车软件，iPhone 6 一个屏幕都装不下。而用户通过两三个应用切来切去找车，让人非常头疼。

传统的公共交通导航，比如高德百度，已经将地铁公交步行等公共交通资源整合的非常好。但偏偏公共自行车没有很好的纳入一个统一的导航系统中。这促使我想完成一个项目，将城市共享单车的资源整合到一起，争取利用深度学习技术对共享单车做出交通预测，相成一个包括自行车在内的路线导航系统。

预测自行车的数量与位置主要有利于两个方面。首先对于运营者来说，能够知道某时某地的自行车需求量、还车量，能够提早进行车辆调度，避免资源过渡集中。此外通过位置预测，而可以通过发红包等形式做交通诱导，鼓励用户合理停车。其次对于使用者来说，如果能够在出行导航中加入自行车的位置预测，可以更加完整流畅的完成公共交通出行，进一步解决最后一公里的问题。

我将本项目分成两个阶段。

第一阶段为数据收集与分析。我已经完成了部分单车数据收集的工作，这里面主要存在如下两个问题：
- 共享车辆厂家太多，数据整合较为困难（亟需一套规范标准）
- 无固定车桩式单车位置预测

第二阶段是完成一个完整的导航系统。核心步骤是利用神经网络预测短期自行车位置：
- 收集主流厂商的自行车实时位置数据
- 建立一个合理的模型进行训练
- 进行短期预测

关于这个导航系统的示例如下图：起点和终点已经标注出来了，需要先坐地铁，然后走一大段路才能到达目的地。而在这个应用中，我希望能够在用户乘坐地铁之前就能预测出能不能在下地铁的时候借到自行车，什么地方大概可以借到。

![](/img/in_post/2017/04/20170416154448.jpg)

注：本项目仍在开发与构思中。

## 数据收集

在分析完永安自行车、ofo、摩拜单车的找车接口后，我成功的将他们整合到了一起。并用 Leaflet.js 将他们放到一个地图里面显示。目前只能当作一个找车应用使用。下图显示的是这三种自行车。

[![](/img/in_post/2017/04/3bikes.jpg)](/img/in_post/2017/04/3bikes.jpg)

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
下一步是进一步完善数据收集工作，利用深度学习技术预测某时某地的自行车数量，形成一个完整的公交导航系统。

自行车换车行为有很大的随机性，深度神经网络或许能够很好的揭示用户历史行为与自行车未来位置之间的某种联系。

Tensorflow是现在最好的深度学习工具，我打算利用它建立训练我的神经网络。祝我好运。

未完待续...

相关的文章：[Big data in Trasport](/2017/03/15/traffic-with-big-data/)

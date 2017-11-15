---
layout: post
title: "轨道交通服务半径分析"
date: "2017-11-15 10:37:01 +0800"
header-img: "img/post-bg-metrogirl.jpg"
tags:
  - metro
---
![](/img/in_post/2017/11/20171115155851.png)
这是一张很有意思的地图，由Chris Whong在2015年创建，作者称[这副图](https://chriswhong.com/local/this-ugly-map-got-a-lot-of-attention-today/)为地铁沙漠（subway deserts）。它显示的区域，是纽约地铁站500m范围内覆盖不到的地方。作者将地铁站附近的区域覆盖起来，然后看看剩余的地方是什么样子的。这对轨道交通的服务范围和规划工作有一定的参考意义。如今中国的地铁站的通常被共享单车包围，骑行或者步行的范围是多大？还有哪些地方没有被覆盖到，这是一个值得关注的问题。

随着数据可视化技术的迅速发展，Chris Whong的地图现在已经比较容易实现。本文利用Mapbox GL JS API进行开发，对南京和苏州的地铁站的服务半径进行分析。

## 确定骑行和步行距离
实际上地铁沙漠图就是以地铁站为中心画圆，首先需要确定这个圆的半径。本文考虑分别对步行距离和公共自行车的骑行距离为半径进行画圆，看看两种方式的差异，以及潜在的问题。

南京对共享单车缺乏监管，导致共享单车万花筒式发展，但大家骑车一般有多快？Mobike给出了这个问题的答案。在[从共享单车大数据看TOD](http://blogs.worldbank.org/sustainablecities/understanding-transit-oriented-development-through-bike-sharing-big-data)的报告中指出：
* 男性：10.7mins 9.26km/h
* 女性：10.9mins 9.17km/h
* 平均：10.8mins 9.22km/h

所以摩拜单车的平均骑行速度为9.22km/h，骑行距离为1.659km。这个距离也可以代表南京市民的平均骑行距离。

遗憾的是，苏州至今仅有永安行自行车可用。从以往的数据分析可知，有效骑行记录为18823892条，平均骑行时间为16.106分钟。假设不同品牌的单车骑行速度相差不多的情况下，参考摩拜单车的平均骑行速度（9.22km/h），苏州市民平均骑行距离为2.474km。

在步行距离方面，根据交通运输部&高德联合发布的[2016年度中国主要城市公共交通大数据分析报告](https://report.amap.com/download_city.do):
* 南京市民的平均步行出行距离为0.783公里
* 苏州市民的平均步行出行距离为0.637公里

## 从高德API接口获取所有地铁线路
想要知道轨道交通的服务半径，覆盖范围，首先得知道这个城市有哪些地铁站、它们的坐标是什么。高德地图为我们提供了非常方便的数据接口，不论是地铁还是公交，都可以进行查询：
{% highlight python %}
import requests
import json

base_url = 'http://restapi.amap.com/v3/bus/linename/'  # 接口说明：http://lbs.amap.com/api/javascript-api/example/bus-search/search-bus-station/
city = '苏州'
key = '你申请的key值'  # 申请地址：http://lbs.amap.com/ (需要创建一个JavaScript应用)
keywords = '4'

r = requests.get('http://restapi.amap.com/v3/bus/linename?s=rsv3&extensions=all&key='+key+'&output=json&pageIndex=1&city='+city+'&keywords='+keywords+'&callback=jsonp')
lines = json.loads(r.text[len('jsonp('):-1])
{% endhighlight %}

![](/img/in_post/2017/11/20171115151659.png)

首先设定好城市、key值、关键词，然后请求高德的接口进行查询并得到json结果。比如上面的例子是查询苏州市的4相关的线路，前面的结果都是地铁四号线的信息，后面是公交的信息。同一条线路往往包含两个结果（两个方向），因为方向不同，站点和路径有可能不同。每一条结果包含了经过的站点、线路轨迹、车站名称及坐标、运营公司等信息。我们依次查询苏州市的1、2、4号线路，然后把这些线路的json结果合并起来就可以了。

由于高德的坐标都是GCJ-02的，为了后面能匹配上Mapbox的坐标，我们把所有的经纬度都转换成WGS84坐标系下的结果。其中会用到一个坐标转换的function，点击这里下载：<a href="/img/in_post/2017/11/coordTransform_utils.py">coordTransform_utils.py</a>
{% highlight python %}
from coordTransform_utils import *

result = []
def addstations(line):
    for x in line['via_stops']:
        name = x['name']
        coords = gcj02_to_wgs84(x["location"]["lng"],x["location"]['lat'])
        lng = coords[0]
        lat = coords[1]
        newitem = [name, lng, lat]
        if newitem not in result:
            result.append(newitem)

addstations(lines[0])        
{% endhighlight %}


## Mapbox Studio 设计底图
![](/img/in_post/2017/11/20171115153708.jpg)
[Mapbox Studio](https://www.mapbox.com/studio/)是一个在线的地图地图设计平台，利用在线的工具就可以针对地图进行个性化的设置。由于网络有点慢，我在这里消耗了很久才搞明白大致的定制操作。一般需要从预设的官方主题进行修改，很多内容可能地图上是没有的，比如快速路、地铁站、地铁线路等等。这时候需要新建一个layer，从原始数据中筛选你想要的东西。至于字体、配色方案，需要一些审美水平才可以搭配出比较好看的底图。以我个人的经验来看，需要展示的数据形式往往直接决定了底图的风格，数据和配色方案需要统一考虑。
![](/img/in_post/2017/11/20171115153816.jpg)
这里使用了官方提供的配色方案Moonlight，我应该是微调了一点点。把这张地图发布之后，就可以使用这张定义好的地图进行下一步开发了。Mapbox也贴心的为我们提供了各种各样的调用方式，如果你用Mapbox的JavaScript WebGL接口进行开发，直接使用"mapbox://"这样的链接就可以了（Leaflet.js也有这样的调用插件）。

## 在Mapbox框架中画圆
地图上画圆，需要考虑缩放的问题。所以想画一个1公里的圆圈，要考虑很多因素。结合stackoverflow上的[讨论](https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js)，画N个圆的方法如下：
{% highlight js %}
function createGeoJSONCircle(stations) {
	var features = []; // GeoJson的对象
	var points = 64; // 一个圆由多少个点构成
	var km = 2.474; // 设置圆的半径

	for (var j = 0; j < stations.length; j++) {
		center = stations[j];
		var coords = {
			latitude: center[1],
			longitude: center[0]
		};

		var ret = [];
		var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
		var distanceY = km / 110.574;

		var theta, x, y;
		for (var i = 0; i < points; i++) {
			theta = (i / points) * (2 * Math.PI);
			x = distanceX * Math.cos(theta);
			y = distanceY * Math.sin(theta);
			ret.push([coords.longitude + x, coords.latitude + y]);
		}

		ret.push(ret[0]);
		features.push({
			"type": "Feature",
			"geometry": {
				"type": "Polygon",
				"coordinates": [ret]
			}
		});
	};

  // 返回 GeoJson
	return {
		"type": "geojson",
		"data": {
			"type": "FeatureCollection",
			"features": features
		}
	};
};

map.on('load', function() {
  // 在地图加载的时候载入这些形状
	map.addSource("polygon", createGeoJSONCircle(stations));
	map.addLayer({
		"id": "polygon",
		"type": "fill",
		"source": "polygon",
		"layout": {},
		"paint": {
			"fill-color": "blue",
			"fill-opacity": 0.3
		}
	});
});

{% endhighlight %}

## 结果
最终加上可以调节服务半径的控件就大功告成了。在线版的应用点击左上角的标签，可以进行半径切换。
* 南京市的在线访问地址：[http://afc.v2tm.com/metro/service/najing.html](http://afc.v2tm.com/metro/service/najing.html)
* 苏州市的在线访问地址：[http://afc.v2tm.com/metro/service/suzhou.html](http://afc.v2tm.com/metro/service/suzhou.html)

由于Mapbox服务器在国外，访问可能略慢，稍等一会儿（或多刷新几次）就好。

南京市步行半径与骑行半径对比：
![](/img/in_post/2017/11/mn.jpg)
苏州市步行半径与骑行半径对比：
![](/img/in_post/2017/11/ms.jpg)

从结果可以看出，公共自行车的确将原有轨道交通服务范围扩大了不少。即使如此，城市中新地区仍有不少“地铁沙漠”，这可能是线网需要进一步加密的地方，或考虑接驳优化的地方。

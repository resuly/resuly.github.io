---
layout: post
title: "shp文件转GeoJSON文件"
subtitle: "Convert shp file to geojson by using Arcgis and Python"
date: "2018-03-25 15:09:22 +0800"
header-img: "img/post-bg-gta2.jpg"
---


## 所用到的工具
- Arcgis Map
- Python 环境
- pyshp

## 在 Arcgis Map 中转换坐标系
如果拿到一个shp文件，坐标系很可能并不是你想要的。这里举个例子，如何转换shp文件的坐标系到 WGS 1984。

![](/img/in_post/2018/03/20180325165324.jpg)

首先打开投影菜单，输入选择原始的shp文件，点击输出坐标系右边的小按钮。搜索 4326 ，即 WGS 1984，然后导出，完成。
![](/img/in_post/2018/03/20180325165444.png)


导出新的shp文件。

![](/img/in_post/2018/03/20180325165657.jpg)

![](/img/in_post/2018/03/20180325165923.png)

## 使用Python输出GeoJSON
安装 [pyshp](https://github.com/GeospatialPython/pyshp) ：
{% highlight python %}
pip install pyshp
{% endhighlight %}

如果有什么包需要编译，没法安装的话，到 [https://www.lfd.uci.edu/~gohlke/pythonlibs/](https://www.lfd.uci.edu/~gohlke/pythonlibs/) 下载轮子安装。

使用脚本导出：
{% highlight python %}
import shapefile
from json import dumps

# read the shapefile
reader = shapefile.Reader("example.shp")
fields = reader.fields[1:]
field_names = [field[0] for field in fields]
buffer = []
for sr in reader.shapeRecords():
    atr = dict(zip(field_names, sr.record))
    geom = sr.shape.__geo_interface__
    buffer.append(dict(type="Feature", geometry=geom, properties=atr))

geojson = open("example.json", "w", encoding='utf-8')
geojson.write(dumps({"type": "FeatureCollection","features": buffer}, indent=4) + '\n')
geojson.close()
{% endhighlight %}


然后就可以愉快的使用各种Map组件了。
![](/img/in_post/2018/03/shpexample.gif)

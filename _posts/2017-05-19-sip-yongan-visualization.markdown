---
layout: post
title: "苏州永安自行车数据可视化"
subtitle: "Visualizaiton for SIP public bike station"
date: "2017-05-19 16:49:00 +0800"
author: "resuly"
header-img: "img/post-bg-map.jpg"
catalog: true
tags:
  - 公共自行车
  - Visualization
---

## 前言
永安的自行车是固定车桩的，借车和换车都要去这样的车桩刷卡或者扫描才可以。
遥想当年刚来高教区的时候，和小伙伴三个人一起跑了很多地方去办卡，不仅要200押金，还要居住证等一大堆手续才能享受公共自行车的服务。直到今年春天，苏州市陆陆续续开始支持支付宝二维码借车，通过蚂蚁信用积分就能轻松借车，各类共享自行车也如雨后春笋般涌现。

![公共自行车文汇广场站](/img/in_post/2017/05/20170519172456.jpg)

前几天睡觉之前突发奇想，尝试把某个接口中的查询半径增加到了几百公里，然后顺利的返回了整个苏州市的永安自行车车桩数据。一鼓作气，一直折腾到两三点，让它自己一分钟抓取一次车桩的状态。看看整个苏州每个租车站点的使用情况是什么样。

## 数据采集
首先给数据库设计了两个表，一个记录永安各个站点的信息，另一个记录采集的时间和各个站点的使用情况（还有多少车能借）。

![](/img/in_post/2017/05/db1.jpg)
![](/img/in_post/2017/05/db2.jpg)

后端程序无非是数据抓取入库，非常简单，就不上代码了，呵呵。

为了能全自动的执行数据采集任务，一般在Windows环境下配置定时任务，Linux 服务器配置 crontab。
{% highlight text %}
# 命令
command: crontab -e

# 一分钟一次
add: * * * * * /usr/bin/curl URL
{% endhighlight %}


开始以一分钟一次的速度从半夜两点开始抓取。就这样一觉睡到第二天中午，猛然发现数据量已经增长的非常庞大，超过了一百万条。因为整个苏州有两千多个站点，每分钟都拍一次快照的话，数据量会增长的非常快。为了防止服务器爆炸，当晚十点多把定时任务关了。最终得到大约150MB的数据。

## 可视化 尝试1
这还不简单，直接把数据上传到 [Carto](http://www.carto.com/) 然后生成可视化文件不就行了？
但事实没那么简单。为了输出Carto支持的CSV格式，我得把上百万的数据逐一查一遍相应的站点信息（GPS坐标、名称什么的），使用了这个号称最好用的csv处理轮子 [league/csv](http://csv.thephpleague.com/)， 把执行内存调到了2G，等了二十分钟终于输出了一个庞大的CSV文件。数据中间用的是 GCJ-02 坐标，输出的时候我得把它转成 WGS-84，早知道我就应该当时入库的时候转换一下啊，唉。坐标转换用的是 EvilTransform。

Mysql 转换输出
{% highlight php %}
use League\Csv\Writer;
public function csv(){
    ini_set('memory_limit', '2048M');
    set_time_limit(0);

    $Bike_yongan = M('Bike_yongan');
    $Bike_yongan_data = M('Bike_yongan_data')->select();

    $header = ['id', 'name','longitude','latitude', 'capacity', 'available', 'percentage', 'time'];
    $records = [];
    foreach ($Bike_yongan_data as $key => $value) {
        $station = $Bike_yongan->where(['yongan_id'=>$value['yongan_id']])->find();
        $GPS = $this->GCJtoWGS($station['lat'],$station['lng']);
        $insert = [
            'id'=> $station['yongan_id'],
            'name'=> $station['name'],
            'latitude'=> $GPS[0],
            'longitude'=> $GPS[1],
            'capacity'=> $station['capacity'],
            'available'=> $value['availbike'],
            'percentage'=> round((floatval($value['availbike']) / floatval($station['capacity'])), 3),
            'time' => $value['time']
        ];
        $records[] = $insert;
    }

    //load the CSV document from a string
    $csv = Writer::createFromString('');

    //insert the header
    $csv->insertOne($header);

    //insert all the records
    $csv->insertAll($records);

    header("Content-type:text/csv");
    header("Content-Type: application/force-download");
    header("Content-Disposition: attachment; filename=yongan_".date('Y-m-d').".csv");
    header('Expires:0');
    header('Pragma:public');
    echo $csv; //returns the CSV document as a string
}
{% endhighlight %}

![](/img/in_post/2017/05/20170519181214.jpg)
费了半天劲才上传上去，选择动画效果，把每个参数都调了一个遍，数据可以按照时间变化，但没法由特定的值显示不同的样式。其他的一些显示方式支持根据某些字段，显示不同的样式，但由不支持时间序列。操作卡顿，渲染卡顿，效果实现不了，坑爹！放弃！

然后尝试了 Ploy.ly 平台，发现上传文件大小就直接限制了。

## 可视化 尝试2
既然平台不行，只能自己选框架慢慢开发了。
关于地图的基础框架，依然选用了鲁棒性很强的([Leaflet.js](http://leafletjs.com/))。

由于是时间轴+各种数据的变化，时间控件选择了 [Leaflet.timeline](http://skeate.github.io/Leaflet.timeline/)。

当然还有一些其他的插件可以选择，不过没空一个一个尝试了，例如：
- [Leaflet Playback](https://github.com/hallahan/LeafletPlayback)
- [Leaflet Realtime](https://github.com/perliedman/leaflet-realtime)
- [Leaflet TimeDimension](https://github.com/socib/Leaflet.TimeDimension) 上午纠结了很久要不要用这个

关于底图数据，需要特别说一句。现在Leaflet的底图一般都是切片图片，然后今天偶然看到一个十分惊艳的基于WebGL的地图，当然矢量数据主要是Openstreetmap，不过不论是2D还是3D效果都非常好，可定制性也很强。下一步计划折腾一下这个底图插件。上一个Demo看一下: [https://tangrams.github.io/simple-demo/](https://tangrams.github.io/simple-demo/)

数据的采集时间是2017-05-12日 02:00 到 22:00，为了减少数据量首先我们得确定一个区域。这个区域选的是独墅湖高教区，因为附近情况比较熟悉，可以脑补各个车桩的画面。
独墅湖高教区的 Boundary Box 坐标： [120.71365356445312,31.248617076299006, 120.75485229492188,31.28383230543126]。 也就是说，坐标落到这个正方形里面，就是独墅湖高教区里面的车桩。这里转不转坐标其实影响不是很大，毕竟偏移量比较小。

经过此轮处理，车桩数量从两千多个减少到40多个。

{% highlight php %}
public function getSIP()
{
    $sip = M('Bike_yongan')->where("lat > 31.248617076299006 and lat < 31.28383230543126 and lng > 120.71365356445312 and lng < 120.75485229492188")->select();
    return $sip;
}
{% endhighlight %}

所以我们该怎么构造SQL查询呢？
注：下面的园区 id SET是上一步根据 bbox 查出来的。
{% highlight sql %}
SELECT * FROM `afc_bike_yongan_data` WHERE `yongan_id` IN (580, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 722, 735, 737, 903, 904, 910, 911, 912, 919, 922, 923) AND (`time` > '2017-05-12 07:00:00'AND `time` < '2017-05-12 07:30:00')
{% endhighlight %}

[GeoJson](https://geojson.org/) 是一种针对地理信息的通用Json格式，可以描述各种基于地理坐标的点、线、面，更多信息参阅官网手册。而我们这个可视化程序主要是读取自行车的GeoJson文件，然后再根据时间显示出来。

经过后来测试，数据量还是太大，所以后端每隔10分钟输出一次 GeoJson 数据，json文件也降到了不到 2MB：
{% highlight php %}
public function GeoJson($start='2017-05-12 05:00:00', $end = '2017-05-12 22:00:00', $intval = 10)
{
    ini_set('memory_limit', '2048M');
    set_time_limit(0);

    <!-- if (!empty($_GET)) {
        $start = $_GET['start'];
        $end = $_GET['end'];
    } -->

    $ids = "(580, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 722, 735, 737, 903, 904, 910, 911, 912, 919, 922, 923)";

    $SIP_data = M('Bike_yongan_data')->where("`yongan_id` IN $ids AND (`time` > '$start' AND `time` < '$end') AND MINUTE(`time`) % $intval = 0")->select();

    // Output GEOjson
    $points = array(
        "type" => "FeatureCollection",
        "features" => array(),
    );

    $Bike_yongan = M('Bike_yongan');
    foreach ($SIP_data as $key => $value) {
        $station = $Bike_yongan->where(['yongan_id'=>$value['yongan_id']])->find();
        $GPS = $this->GCJtoWGS($station['lat'],$station['lng']);
        $start = $value['time'];
        $end = date('Y-m-d H:i:s',strtotime("+$intval Minute", strtotime($value['time'])));
        $tmp_array = array(
            "type" => "Feature",
            "properties"=> array(
                'id'=> $station['yongan_id'],
                'name'=> $station['name'],
                'capacity'=> $station['capacity'],
                'available'=> $value['availbike'],
                'percentage'=> round((floatval($value['availbike']) / floatval($station['capacity'])), 3),
                "start" => $start,
                "end" => $end,
            ),
            "geometry" => array(
                "coordinates" => [$GPS[1], $GPS[0]],
                "type" => "Point",  
            ),
        );
        $points['features'][] = $tmp_array;
    }

    header("Content-type: application/json");
    echo json_encode($points);
}
{% endhighlight %}

好了，最后写前端代码，完成这个大作：

{% highlight html %}
<!-- 引入资源 -->
<script src="__CSS__/leaflet/leaflet.js"></script>
<script src="__CSS__/leaflet/moment.min.js"></script>
<link href="__CSS__/leaflet/leaflet.css" rel="stylesheet">
<script src="__CSS__/leaflet/jquery.min.js"></script>
<script src="__CSS__/leaflet/leaflet.timeline.js"></script>

<div id="map"></div>
<script>
var map = L.map('map').setView([31.2705887594, 120.73131367113], 14);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/ebrelsford.ho06j5h0/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
}).addTo(map);

var slider = L.timelineSliderControl({
    formatOutput: function(date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss"); // 注意时间格式
    },
});
map.addControl(slider);

// 先请求数据再说
$.ajax({
    // url: '/App/Bike/GeoJson/', // 根据下面的 data 参数动态请求接口 可以做更多的控件
    url: '__CSS__/leaflet/sip.json', // 直接请求静态的 GeoJson 文件 节省运算
    data: {
        start: '2017-05-12 05:00:00',
        end: '2017-05-12 22:00:00',
    },
    type: 'GET',
    success: function(data) {
        var pointTimeline = L.timeline(data,{
            pointToLayer: function(data, latlng){
                var hue_min = 120;
                var hue_max = 0;
                var hue = (1 - data.properties.percentage) * (hue_max - hue_min) + hue_min; // 这一句是车多绿色 车少红色的精华
                return L.circleMarker(latlng, {
                    radius: 8, // 半径随意调
                    color: "hsl(" + hue + ", 100%, 50%)",
                    fillColor: "hsl(" + hue + ", 100%, 50%)",
                    fillOpacity: 1,
                    // className: 'pulse',
                }).bindPopup(data.properties.name + '<br>剩余百分比：' + Math.round(data.properties.percentage*100) + '% <br>剩余数量：' + data.properties.available);
            }
        });
        pointTimeline.addTo(map);
        slider.addTimelines(pointTimeline);
    }
});
</script>
{% endhighlight %}

## 最终显示效果

从下图可以看出从早上6点一直到晚上10点的自行车规律，但是貌似晚上9点以后，大量车桩都没车了，小伙伴猜测可能是被永安公司调度走了...

![](/img/in_post/2017/05/1.gif)

![](/img/in_post/2017/05/2.gif)


另外推荐一个GIF截图工具 [ScreenToGif](http://www.screentogif.com/), 整个软件只有一个文件，打开即用，解决了我一大难题。

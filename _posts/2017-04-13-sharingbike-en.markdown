---
layout: post
title: "The application of sharing bike navigation"
date: "2017-04-08 16:05:05 +0800"
author: "resuly"
header-img: "img/post-bg-bike.jpg"
catalog: true
tags:
  - Deep Learning
  - Tensorflow
  - Sharing Bike
---

## Background

Sharing bikes are hot topic in China now. There are many different kind of sharing bikes. In Nanjing (A city in China), more then 5 companies compete together in this area. Most of these bikes are dockless, which means you can return it at any place you want. I need to install several Apps to find a suitable bike nearby. It not convinient for me.

![Different color stand for different operator](/img/in_post/2017/04/bikes.jpg)

We already have the map navigation for public trasportation with bus, metro, and walking. However, the sharing bike system is not participated in. I list two main challenges below for integrating sharing bikes into traditional navigation system.
- Hard to make a positional prediction for dockless bikes (people may return it anywhere)
- Too many different bike operators. It hard to make all information together.

I want to make a application to achieve a complete transit navigation. The core step is using deep learning to predit bike postion in the future based on amounts of data. This can be separated by 3 steps:
- Collect majority of sharing bikes positions in time
- Build a properly neural network and train it
- Predict the bike postion in sepcific area and time

An example for this application: The origin and destination are marked as 'start' and 'end' on the picture below. In a traditional navigation, I need to take the metro first (the green line) and walk through a long way. In this application, it will show you the available bikes when you leave the metro station.
![](/img/in_post/2017/04/20170416154448.jpg)

Remark: This project is only a conception now

## Data Collection

After finding the position APIs of Yongan, ofo, and Mobike, I made a webpage to put all real-time data together in GeoJSON format. I used [Leaflet.js](http://leafletjs.com/) to show these bike information on map. When you open the webpage, it will request your position and return all available bikes nearby. This can be a bike finder or data collector now.

[![](/img/in_post/2017/04/3bikes.jpg)](/img/in_post/2017/04/3bikes.jpg)

The bikes from Yongan are not dockless, you have to borrow or return it from fixed parking stations on the street. So the postion of these static bikes are fixed, and you can check the number of available bikes from these stations. Mobike and ofo have no fixed postion for parking, so what you get are GPS coodrdinates from their bikes.

Example of the data：

{% highlight javascript %}
# Yongan
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

{% highlight javascript %}
# Mobike
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

Final result on the map：

![](/img/in_post/2017/04/2.jpg)

![](/img/in_post/2017/04/3.png)

![](/img/in_post/2017/04/4.png)


Test URL:

Position from the user:
[https://afc.v2tm.com/bike/](https://afc.v2tm.com/bike/)

Position simulation in Nanjing
[https://afc.v2tm.com/bike/test](https://afc.v2tm.com/bike/test)

## Tips for data collection

- Because of the network condition, you can select [ChineseTmsProviders](https://github.com/htoooth/Leaflet.ChineseTmsProviders) to show the map layer with Leaflet. They are all based on pictures, so the map may be not very clear on some high resolution screens. I'm going to try the library from Amap or Google Maps to show it again.
- If you want to require the position or camera from the user through HTML5, you have to use the https connection. Of course, http protocol works fine with localhost for a test site. This problem takes me another 3 hours for applying a ssl certification and its deployment on the server.
- You have to take a token to access the data from ofo, and the token is generated after you login the system.
- There are a lot of Chinese characters in Yongan's data. If you use PHP to clean the data, the function below may helps.
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


## Next Step

The next step is making the data collection better and using deep learning to predict bike postions.

It kinda of stochastic behavior for a person to return a sharing bike. I think it needs a deep neural network to reveal the relation of bike postion in the future and the historical user behaviors.

Tensorflow is great tool for deep learning project. I am looking forward to build a suitable neural network with Tensorflow and  predict the postions with high accuracy.

To be continued...

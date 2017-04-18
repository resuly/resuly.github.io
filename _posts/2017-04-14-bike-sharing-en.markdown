---
layout: post
title: "The application of bike-sharing navigation"
date: "2017-04-14 16:05:05 +0800"
author: "resuly"
header-img: "img/post-bg-bike.jpg"
catalog: true
tags:
  - Deep Learning
  - Tensorflow
  - Bike-sharing
---

## Background

Shared bike is a hot potato in China now. The number of shared bike users has been rapidly growing since Wei Dai (the founders and CEO of the Ofo) launched the first dockless shared bike program in Beijing. The Ofo's market value is more than $2 billion now ([CNBC](http://www.cnbc.com/2017/04/17/ofo-chinese-bike-sharing-start-up-says-its-now-worth-more-than-2-billion.html)). With its popularity, many different kinds (in shape, price, and operation) of shared bikes have been introduced into the China market. In Nanjing (A city in China), more than 5 companies operate together to accommodate bike users. Since recently introduced shared bikes are dockless, users can rent and return them at any place and any time they want. This new concept of transportation has brought a great degree of accessibility in particularly public transportation. Although this new system has changed travel behavior in good ways there is one thing I want to improve left. Since many companies release bikes and their own apps , users need to install several Apps if they want to have the nearest bike to them. It is not simply convenient.

![Different color stand for different operator](/img/in_post/2017/04/bikes.jpg)

Once all bikes are integrated in one platform, I ultimately want to develop a so called “Complete active transport system”. The idea is that I estimate the number of subway passengers going in and out the station by using smart card data. Based on the number, the adequate number of bikes is induced to be parked by operators or users. So that the subway passengers can use them without spending too much time to find them. In addition, not too many bikes would be blocking the pedestrian space which causes a lot of problem in some particular time and space.

There are 2 stages to achieve this project.

Firstly, we already have a navigation map which  helps people to use public transportation with bus, metro, and walking. However, the bike-sharing system is not participated in. There are two main challenges in integrating shared bikes into a traditional navigation system as follows;
- Too many different bike operators. It is hard to integrate all information together.
- Making the positional prediction for dockless bikes (people may return it anywhere)

Secondly, I want to make an application to achieve complete transit navigation. The core step is to use a deep learning technique to predict a short-term bike position. This can be separated by 3 steps:
- Collecting a majority of shared bikes positions in time
- Building a proper neural network and train it with subway card data
- Predicting the position in specific area and time

An example for this application: The origin and destination are marked as 'start' and 'end' on the picture below. In a traditional navigation, for example, I need to take the metro first (the green line) and walk through a long way. In this application, it will show you the available bikes before you leave the metro station.
![](/img/in_post/2017/04/20170416154448.jpg)

Remark: This project is only a conception now

## Data Collection

Utilizing the position APIs of Yongan, Ofo, and Mobike, I made a webpage to put all real-time data together in GeoJSON format. Then I used [Leaflet.js](http://leafletjs.com/) to show bike information on map. Opening the webpage, it will request your position and return information of all available bikes nearby. This can be a bike finder or a data collector now.

[![](/img/in_post/2017/04/3bikes.jpg)](/img/in_post/2017/04/3bikes.jpg)

The bikes from Yongan are not dockless, so you have to borrow or return it from fixed parking stations on the street. The position of these static bikes are fixed and you can check the number of available bikes from these stations. Mobike and Ofo have no fixed position for parking so what you get is GPS coordinates from their bikes.

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
# Ofo
"geometry": {
  "coordinates": [
    120.748678,
    31.262896
  ],
  "type": "Point"
},
"type": "Feature",
"properties": {
  "type": "Ofo",
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

Final results on the map：

![](/img/in_post/2017/04/2.jpg)

![](/img/in_post/2017/04/3.png)

![](/img/in_post/2017/04/4.png)


Test URL:

Position from the user:
[https://afc.v2tm.com/bike/](https://afc.v2tm.com/bike/)

Position simulation in Nanjing
[https://afc.v2tm.com/bike/test](https://afc.v2tm.com/bike/test)

## Tips for data collection

- For a better network connection in China, you can select [ChineseTmsProviders](https://github.com/htoooth/Leaflet.ChineseTmsProviders) to show the basic map layer with Leaflet. They are all top on pictures, so the map may not be very clear on some high resolution screens. I'm going to use the library developed by Amap or Google Maps to show it better.
- If you want to require the position from the user through HTML5, you need a https connection. Of course, http protocol works fine with localhost for a test site. This problem takes me another 3 hours for applying a SSL certification and its deployment on the server.
- You have to take a token to access the data from Ofo and the token is generated after you login the system.
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

The next step is to make the data collection better and to use deep learning to predict the bike positions. With the prediction, we can solve problems as follows.
- Make a better management when some area tends to be an unbalanced number of bikes.
- Generate a custom bike recommendation in advance for users (with navigation).

A bike return is stochastic. Therefore, I think it needs a deep neural network to reveal the correlation between bike position in the future and the historical user behaviors.

Tensorflow is a great tool for this project. I am looking forward to building a suitable neural network with Tensorflow and predicting the positions with a high accuracy.

To be continued...

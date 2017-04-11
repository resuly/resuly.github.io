---
layout: post
title: How to handle the original coordinate?
subtitle: Data clean for visualizaiton
date: 2016-11-10T16:49:00.000Z
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

![1.png]({{site.baseurl}}/img/in-post/2016-11-10/1.png)

# Essential Knowledge
Universal Transverse Mercator System:

![traverse_mercator.jpg]({{site.baseurl}}/img/in-post/2016-11-10/traverse_mercator.jpg)

The idea of UTM is making a projection for the earth and then get the x,y coordinate. (Kinds of (0,0) all located in African.)
More information, please visit this reference: 
[http://www.ibm.com/developerworks/cn/java/j-coordconvert/](http://www.ibm.com/developerworks/cn/java/j-coordconvert/)

The following reference shows the difference among GCJ-02, WGS-84, and UTM. In this article, you can also find these coordinates system information that main map companies use.
[http://www.cnblogs.com/milkmap/p/3627940.html](http://www.cnblogs.com/milkmap/p/3627940.html)

Baidu Maps issue: UTM to Baidu Coordinate
[http://my.oschina.net/webscraping/blog/511029?fromerr=k3LHV5MM](http://my.oschina.net/webscraping/blog/511029?fromerr=k3LHV5MM)

# Processing Steps
The original data is close to Universal Transverse Mercator system. So I decided to convert the dataset into UTM first.

Firstly, we have to get the UTM coordinate of the zone 1. The following tool provides an online point choosing system:
[http://www.geoplaner.com/](http://www.geoplaner.com/)

![zT9cszlS4RoSPqKw.png]({{site.baseurl}}/img/in-post/2016-11-10/zT9cszlS4RoSPqKw.png)

![MIn6fxRPXiYxe8Hk.png]({{site.baseurl}}/img/in-post/2016-11-10/MIn6fxRPXiYxe8Hk.png)

We can find the zone 1 is (278369,3468927) in UTM format. So let's handle the rest of data based on the initial point in Excel.

![LdKnImSsMeYK9ypI.png]({{site.baseurl}}/img/in-post/2016-11-10/LdKnImSsMeYK9ypI.png)

The problem is how to convert all UTMs to the WGS-84. I tried a converted library in PHP but failed, because the final result was not correct. JScoord is a powerful convert library which wrote in Javascript.

Download: [http://www.jstott.me.uk/jscoord/](http://www.jstott.me.uk/jscoord/)

The function we want:

![Rduy18Px6I0DkDgw.png]({{site.baseurl}}/img/in-post/2016-11-10/Rduy18Px6I0DkDgw.png)


Simplify the code to just one line(it's helpful for generating codes in Ecxel):

`new UTMRef(x, y, "R", 51).toLatLng().toString();`

Change the output format in the JScoord (line 37):

![w1goAIkSALAcuiAd.png]({{site.baseurl}}/img/in-post/2016-11-10/w1goAIkSALAcuiAd.png)

```
function LatLngToString() {
  return '<tr><td>'+this.lat.toFixed(6)+'</td><td>'+this.lng.toFixed(6)+'</td></tr>';
}
```

Generate all x&y for codes in Excel:

![FGpDzo56cacRuN61.png]({{site.baseurl}}/img/in-post/2016-11-10/FGpDzo56cacRuN61.png)





---
layout: post
title: "3D Convolutional Networks for Traffic Forecasting"
date: "2018-05-18 17:05:13 +0800"
header-img: "img/post-bg-fantasy.jpg"
tags:
  - 3D CNN
  - Traffic Forecasting
  - Spatiotemporal Data
  - Deep Learning
---

## Intro
It's not easy to pick up this background image for the post. It shows the Manhattan Peninsula, New York, and the sky reflects the buildings on the ground. This fantasy scene reminds me the complex relationship between space and time, which closely related to the topic of this article: Spatiotemporal forecasting of traffic by using 3d convolutional neural networks.

<!-- ![Shanghai Stampede 2014](/img/in_post/2018/05/shanghai-stampede-2014.jpg) -->

On December 31, 2014, a deadly stampede occurred in Shanghai, near Chen Yi Square on the Bund, where around 300,000 people had gathered for the new year celebration. 36 people were killed and there were 49 injured, 13 seriously ([Wikipedia](https://en.wikipedia.org/wiki/2014_Shanghai_stampede)). From the follow-up reports, it can be known that Tencent’s user online information has roughly detected that the traffic in the area was too dense. So data from social media and cell phone signal can infer the regional crowd density. If the corresponding predictions and analysis can be made, such tragedies will not happen.

Traffic forecasting has been studied for decades. There are many outcomes of models and theories. For the regional prediction, it's a prevalent way to split the research area into grids and analysis them by computer vision models. Each square in the girds just like the pixel in an image.

![](/img/in_post/2018/05/zhang2016.jpg)

[Zhang (2016)](https://dl.acm.org/citation.cfm?id=2997016) presented the classic Deep-ST model. It treats the research area as image and the predicted result combined with the convolutional models from different periods. However, the convert not only limited to traffic volume. The vehicle speed can also be transformed into images. The images below shows the traffic speed representation in a small-scale transportation network ([Yu, et al 2017](http://www.mdpi.com/1424-8220/17/7/1501/htm)).

![](/img/in_post/2018/05/sensors-17-01501.jpg)

With the development of computer vision, deeper neural networks like ResNet has been presented recently. [Zhang (2017)](http://www.aaai.org/ocs/index.php/AAAI/AAAI17/paper/download/14501/13964) also upgraded the DeepST to ST-ResNet with ResNet models. However, the convolutional kernel in these models only focuses on spatial relations, not for a spatiotemporal space. It's been proved that 3D Convolutional Networks can learn the spatiotemporal features ([Tran 2015](https://ieeexplore.ieee.org/abstract/document/7410867/)). But these improvements only appears in video related studies like behavior detection, human action detection, etc. So in this post, we will see the application of 3D ConvNets on traffic problems.

## Convolutional operations

There are some different operations with the convolutional kernel in hidden layers. The following diagrams show the 2D convolutional operation with padding and dilation ([Dumoulin and Visin, 2016 ](https://arxiv.org/abs/1603.07285)). It's different in 3D, but the ideas are same.

<img src="/img/in_post/2018/05/padding_strides.gif" style="width: 50%;float: left">
<img src="/img/in_post/2018/05/dilation.gif" style="width: 50%;float: right">

With the 3D convolutional operation, the kernel shape is 3 dimensional and it moves in 3 directions. Just like the animation below. For the transportation problems, the directions are latitude, longitude and time. In the model part, we also used padding and dilation with 3D kernels.

<img src="/img/in_post/2018/05/3dconv.gif" style="width: 500px">

## Data and Model
We take the bike sharing data in New York (BikeNYC) from the DeepST paper as an example here. Every circle stands for a station and the color means the number of bikes in dock. The research area is split into 16×8 grids, each square has in and out flow at a particular moment. The in and out flow are numbers of return and borrow bikes in the corresponding region.

<img src="/img/in_post/2018/05/areaNYbike.png" style="width: 700px">

The input is a time sequence from the time level of closeness, period and trend. They stand for the different extract frequency from raw data. If stack them together, the input shape would be X×16×8. The X is the number of timesteps.

<img src="/img/in_post/2018/05/model.png" style="width: 400px">

The model has three 3D convolutional layers and the flatten layer combines the external data like weather and holidays.

## Experiments
I used Pytorch this time. The windows version just came out last month. It provides a lot of API and very easy to build a custom model structure. The author of ST-ResNet has opened his code, so we can reuse the dataset from Github.

<img src="/img/in_post/2018/05/20180518204416.png" style="width:550px">

Although the model is much simpler than Deep-ST or ST-ResNet, it still achieved the best performance on BikeNYC and TaxiBJ datasets.

To get the best kernel size, we take different combinations for training test. It turns out that 3×3×3 is also the optimal option for transportation data just like other papers have pointed out in some behavior detection tasks.

![](/img/in_post/2018/05/kernel_size_TestRMSE.svg)

The loss and RMSE change with BikeNYC:
![](/img/in_post/2018/05/meta_comparison_loss.svg)
![](/img/in_post/2018/05/meta_comparison_RMSE.svg)

The loss and RMSE change with TaxiBJ:
![](/img/in_post/2018/05/444meta_comparison_loss.svg)
![](/img/in_post/2018/05/444meta_comparison_RMSE.svg)


## Visualization
![](/img/in_post/2018/05/1.svg)

Firstly, I have tried the Matplotlib in Python. The outcomes are good but they are static and not appropriate for the webpage. So I chose d3.js to draw the diagram from scratch. (The style with CSS and SVG tags drive me crazy, it is incompatible with this blog responsive CSS sheet. So I just give up displaying it on this page. Here is the gif version, simple and straightforward.)

<img src="http://7xml0w.com1.z0.glb.clouddn.com/3dvis.gif">

Play around with this diagram:
<a href="http://resuly.me/projects/3dconvs/index.html" target="_blank">http://resuly.me/projects/3dconvs/</a>

## References
Zhang, J., Zheng, Y., Qi, D., Li, R., & Yi, X. (2016, October). DNN-based prediction model for spatio-temporal data. In Proceedings of the 24th ACM SIGSPATIAL International Conference on Advances in Geographic Information Systems (p. 92). ACM.

Zhang, J., Zheng, Y., & Qi, D. (2017, February). Deep Spatio-Temporal Residual Networks for Citywide Crowd Flows Prediction. In AAAI (pp. 1655-1661).

Yu, H., Wu, Z., Wang, S., Wang, Y., & Ma, X. (2017). Spatiotemporal recurrent convolutional networks for traffic prediction in transportation networks. Sensors, 17(7), 1501.

Tran, D., Bourdev, L., Fergus, R., Torresani, L., & Paluri, M. (2015, December). Learning spatiotemporal features with 3d convolutional networks. In Computer Vision (ICCV), 2015 IEEE International Conference on (pp. 4489-4497). IEEE.

Vincent Dumoulin, Francesco Visin - A guide to convolution arithmetic for deep learning

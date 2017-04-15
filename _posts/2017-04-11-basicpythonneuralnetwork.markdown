---
layout: post
title: "10几行代码构建神经网络模型"
date: "2017-04-11 20:35:43 +0800"
author: "resuly"
header-img: "img/post-bg-network.jpg"
catalog: true
tags:
  - 神经网络
  - Python
---
## 前言

如何深入理解基本神经网络模型，对于使用机器学习框架的理解十分重要。本文主要参照 [Milo Spencer](https://medium.com/technology-invention-and-more/how-to-build-a-simple-neural-network-in-9-lines-of-python-code-cc8f23647ca1) 与 [Trask](http://iamtrask.github.io/2015/07/12/basic-python-network/) 的论文进行阐述，感谢两位作者的辛勤付出。

以下内容，将带你一步步的从一个简单问题，从头构建一个神经网络。一旦你理解了，你可以喜欢的编程语言去实现它，本文使用Python作为示例。

## 最终代码

{% highlight python %}
import numpy as np
# input dataset
x = np.array([[0,0,1],[0,1,1],[1,0,1],[1,1,1] ])
# output dataset            
y = np.array([[0,0,1,1]]).T
# start
np.random.seed(1)
w0 = 2 * np.random.random((3,4)) - 1
w1 = 2 * np.random.random((4,1)) - 1
# l0 > w0 > l1 > w1 > l2 (y)
for i in range(60000):
	l0 = x
	l1 = 1/(1+np.exp(-(np.dot(l0,w0))))
	l2 = 1/(1+np.exp(-(np.dot(l1,w1))))
	delta1 = (y - l2)*(l2*(1-l2)) #(4,1)
	delta0 = delta1.dot(w1.T)*(l1*(1-l1))
	w1 += np.dot(l1.T, delta1)
	w0 += np.dot(l0.T, delta0)
print(l2)
{% endhighlight %}

你可能发现这有点难以理解，好吧我们从头开始。继续下一章节。

## 我们在做什么？
理解基本问题至关重要，如果不理解最终目的，也就没法理解整个模型在干什么。

我们主要从数据输入、数据输出、优化，都在干什么来入手，一步步的构建一个神经网络。

### 数据输入输出

想象有一只狗，懒洋洋的躺在地上，你用手挠它身上三个部位（比如后背、头、肚子），它有可能会很高兴。

输入1代表挠这个位置，0代表不挠这个位置；输出1代表狗狗高兴，0代表没反应。下面的这个表就是我们实验4次的结果：

<table class="tg">
  <tbody>
  <tr>
    <th colspan="3" style="text-align: center;">输入（后背、头、肚子）</th>
    <th>输出（高兴、没反应）</th>
  </tr>
  <tr>
    <td>0</td>
    <td>0</td>
    <td>1</td>
    <td>0</td>
  </tr>
  <tr>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
  </tr>
  <tr>
    <td>1</td>
    <td>0</td>
    <td>1</td>
    <td>1</td>
  </tr>
  <tr>
    <td>0</td>
    <td>1</td>
    <td>1</td>
    <td>0</td>
  </tr>
</tbody></table>

以上表格中的输入区域，每一行的三个值就是我们的一次尝试。四次分别用了不同的组合，比如第一次至挠肚子，狗狗没反应。以此类推。

那么，我们怎么确定一种刺激方法，能让狗狗高兴呢？（逗狗狂魔）

![](/img/in_post/2017/04/timg.jpg)

## 基本神经网络

未完待续...

## 多层神经网络

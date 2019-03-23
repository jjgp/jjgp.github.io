---
title: Building a PC
date: "2019-03-21T14:40:45Z"
description: For machine and continued learning
---

![pc](./pc.png)

Having read a few posts about building a computer for machine and deep learning
I had become inspired to build one of my own.

> - [Build and Setup Your Own Deep Learning Server From Scratch](https:// towardsdatascience.com/build-and-setup-your-own-deep-learning-server-from-scratch-e771dacaa252)
> - [Build your own top-spec remote-access Machine Learning rig: ...](https://medium.com/@aragalie/build-your-own-top-spec-remote-access-machine-learning-rig-a-very-detailed-assembly-and-dae0f4011a8f)
> - [How to build the perfect Deep Learning Computer and save thousands of dollars](https://medium.com/the-mission/how-to-build-the-perfect-deep-learning-computer-and-save-thousands-of-dollars-9ec3b2eb4ce2)

Of course there are resources in the wild to utilize GPUs that are either free
or cheap ([Azure](https://notebooks.azure.com/),
[Paperspace](https://www.paperspace.com/), 
[Kaggle, and Colab](https://towardsdatascience.com/kaggle-vs-colab-faceoff-which-free-gpu-provider-is-tops-d4f0cd625029)),
however, I wanted to experience more than that. I wanted to understand in
greater detail what parts there were and how they went together. I wanted to 
know what is involved in setting up remote resources and even enable
development from my Macbook or my iPad Pro with 
[Blink](https://github.com/blinksh/blink) and [Juno](https://juno.sh/).

## The Parts

**CPU:** AMD Threadripper 2950X  
**CPU Cooler:** Corsair H100i v2  
**Motherboard:** ASRock X399 Taichi  
**Memory:** Corsair Vengeance LPX 2 x 16 GB  
**Storage:** Samsung 960 EVO 500 GB M.2-2280 SSD, Seagate Barracuda 2 TB 3.5" HDD, WD 2 TB 3.5" HDD (repurposed from an external drive)  
**Video Card:** NVIDIA GeForce RTX 2070  
**Case:** Corsair Air 540  
**Power Supply:** Corsair 1000 W 80+ Platinum

Apart from perusing the aforementioned posts on building machine learning rigs,
[PCPartpicker](https://pcpartpicker.com/user/jjgp/saved/33ZV6h) (links to my
part list) and its compatibility check was perhaps the most informative 
resource. My process wasn't very scientific and I even splurged on the CPU. I
did make sure to pick a motherboard, CPU, and PSU could support more GPUs or
other PCIe devices in the future. In researching which GPU to use I defaulted
to the judgment outlined in the following: [Which GPU(s) to Get for Deep Learning: ...](http://timdettmers.com/2018/11/05/which-gpu-for-deep-learning/).

Extra Things:  
grounding cable  
thermal paste  
rubbing alcohol  
magnetic screw set  

## Putting it Together

BIOS

On Building:  
[Fractal Design Define C TG / MSI X399 Gaming Pro Carbon](https://www.youtube.com/watch?v=83mA2TGNRCU)  

hard drive bays doa

Dr. Debug:  
[Dr. Debug display AA](http://forum.asrock.com/forum_posts.asp?TID=3110&title=dr-debug-display-aa)

Taichi CPU temp confusion:  
[X399 Taichi CPU Temperature](http://forum.asrock.com/forum_posts.asp?TID=6912&title=x399-taichi-cpu-temperature)

## The OSes

Rufus

Windows First:  
Ryzen CPU stuff  
ASRock app store  
Corsair link  

Ubuntu Setup:  
lmsensors  
Swap  

## Cuda install

Cuda Install:  
[NVIDIA CUDA Installation Guide for Linux](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html)

## Remote Access

Wake On Lan  
Remote SSH  
No-IP  
Real VNC  
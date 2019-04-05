---
title: Building a PC
date: "2019-03-21T14:40:45Z"
description: For machine and continued learning
---

![pc](./pc.png)

Having read a few posts about building a computer for machine and deep learning
I had become inspired to build one of my own.

> - [Build and Setup Your Own Deep Learning Server From Scratch](https://towardsdatascience.com/build-and-setup-your-own-deep-learning-server-from-scratch-e771dacaa252)
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
[Termius](https://www.termius.com/), [Blink](https://github.com/blinksh/blink), and [Juno](https://juno.sh/).

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
[PCPartPicker](https://pcpartpicker.com/user/jjgp/saved/33ZV6h) (links to my
part list) and its compatibility check was perhaps the most informative 
resource. My process wasn't very scientific and I even splurged on the CPU. I
did make sure to pick a motherboard, CPU, and PSU could support more GPUs or
other PCIe devices in the future. In researching which GPU to use I defaulted
to the judgment outlined in the following: [Which GPU(s) to Get for Deep Learning: ...](http://timdettmers.com/2018/11/05/which-gpu-for-deep-learning/)

A few things need for setup include: a grounding cable, thermal paste,
Isopropyl alcohol, and a magnetic screw set. The grounding cable is worn at all
times during assembly. The thermal paste is to ensure the heat transfer between
the CPU and the cooler. The Corsair H100i v2 came with some thermal paste on 
it. I opted to clean that off with alcohol and apply the thermal paste I had
bought.

## Putting it Together

The most time consuming part of putting the computer together (from the 
perspective of a noob) is gathering the information on assembly. I watched
a lot of YouTube, read blog posts, and reread the manuals. The most
informative video I found (and mentioned in one of the blogs above) is
[Fractal Design Define C TG / MSI X399 Gaming Pro Carbon](https://www.youtube.com/watch?v=83mA2TGNRCU).
After gaining a little familiarity with the whole process I began assembly. It
is typically recommended to assembly the motherboard, CPU, CPU cooler, SSD, and
RAM outside of the case to power it on and inspect for parts that may be DOA.
I just followed the steps in the aformentioned Fractal Design video and forewent
powering it on outside as the parts were swimming in space in the Corsair Air
540 and easy to assemble / disassemble.

A few tidbits that caused some confusion and specific to the parts mentioned
follow: The hard drive bays in the Corsair Air 540 took more force than I had
realized to properly attach. The post codes on the Dr. Debug output were at
first esoteric and I had to research the forums ([Dr. Debug display AA](http://forum.asrock.com/forum_posts.asp?TID=3110&title=dr-debug-display-aa))
and consult the manual. The Taichi BIOS will show the CPU temperature as higher
than it actually is ([X399 Taichi CPU Temperature](http://forum.asrock.com/forum_posts.asp?TID=6912&title=x399-taichi-cpu-temperature)).
The motherboard cables from the case to the power, reset, and LED had triangles
to mark the positive leads.

## The OSes

As is recommended by the sources I have read and personally, Windows is best 
installed first. The Taichi BIOS update software only supports Windows and 
having a partition for it serves as a failsafe. To install Windows I created
a UEFI GPT bootable USB with a Windows installer and using Rufus. As I have a
Mac I had to install Windows through Bootcamp to accomplish this. After
creating the bootable USB I chose it as the boot media through the Taichi
BIOS and followed the steps to install.

Once Windows was installed on the Samsung 960 EVO I installed the following
apps for maintenance: [ASRock APP Shop](http://www.asrock.com/feature/appshop/),
[AMD RYZEN Master](https://www.amd.com/en/technologies/ryzen-master), and 
[CORSAIR LINK](https://www.corsair.com/us/en/corsairlink). With Windows I
created a partition and a UEFI GPT bootable USB with the Ubuntu installer. To
install I simply chose to boot from the USB from the BIOS and followed the
install steps.

## Cuda Install

The CUDA install was perhaps the most frustrating part. Mostly because there is
a lot of information to digest at the [NVIDIA CUDA Installation Guide for Linux](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html)
and steps can be unclear such as which option to choose to download the
[CUDA Toolkit](https://developer.nvidia.com/cuda-downloads). 
The most straightforward way to go about it is outlined at the following:
[How To Install CUDA 10...](https://www.pugetsystems.com/labs/hpc/How-To-Install-CUDA-10-together-with-9-2-on-Ubuntu-18-04-with-support-for-NVIDIA-20XX-Turing-GPUs-1236/).
In short, it's to download the deb (network) CUDA Toolkit and follow the steps
there. I had tried deb (local) and it just lead to unmet dependency issues.

## Remote Access

![pi](./pi.png)

Most of my use of the PC will be remotely. To facilitate that I set up the
following: [WakeOnLan](https://help.ubuntu.com/community/WakeOnLan), 
[OpenSSH](https://help.ubuntu.com/lts/serverguide/openssh-server.html.en), 
[Real VNC](https://www.realvnc.com/), and [No-IP](https://www.noip.com/). 
As my router does not support the broadcasting of magic packets to wake the
computer from a nonlocal network, I set up a Raspberry Pi on the local network
to do so. Essentially I can SSH into the Raspberry Pi (even with [Termius](https://www.termius.com/)
on my iPhone) and use [etherwake](https://www.mkssoftware.com/docs/man1/etherwake.1.asp)
to turn on my PC.

The next things I've planned for my PC are to setup a development environment
for machine learning!
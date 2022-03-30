---
title: A ML Dev Setup with ngrok and Colab
date: "2022-03-30T00:00:00Z"
---

As a user of a mac with a M1 chip, I often have to run into the obstacle of
dependencies without support for the arm64 architecture. It leads to
building the dependency locally, using a container or virtual machine, a
remote instance, or finding an another dependency with similar features. For
this reason, I was drawn to the many examples of connecting through SSH to
a Colab instance: [ColabCode](https://github.com/abhishekkrthakur/colabcode), 
[colab-ssh](https://github.com/WassimBenzarti/colab-ssh), [colab-tricks](https://github.com/shawwn/colab-tricks).
As an exercise in understanding the previous approaches I decided to implement
a solution myself. The full process has been accumated into [ngrok.ipynb]().

## A brief explanation of the process


## In search of environment variables


## Inspecting the web client


## SSH'ing into the Colab instance


## Debugging the datalab proxy server


## Deciding on the approach


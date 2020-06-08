---
title: Setting up a development environment for LLVM
date: "2020-05-24T15:38:44Z"
description: Lessons learned from writing an LLVM pass 
---

For my course in [software analysis](http://omscs.gatech.edu/cs-6340-software-analysis) I found the need to assemble a
development environment to streamline my work with LLVM. The setup can be found on GitHub at
[jjgp/llvm-development](https://github.com/jjgp/llvm-development).

Briefly, it contains a Dockerfile, VS Code Remote-Containers `devcontainer.json`, and the structure for a very simple 
LLVM pass.

The Dockerfile builds and Ubuntu 18.04 image with Clang, LLDB, and LLVM built with debug assertions enabled. This is
necessary to enable the use of the [LLVM_DEBUG](https://llvm.org/docs/ProgrammersManual.html#the-llvm-debug-macro-and-debug-option) macro. Having been my first time building the LLVM toolchain in a Docker
image, I did use [Pytorch's](https://github.com/pytorch/pytorch/blob/master/.circleci/docker/common/install_llvm.sh
) CircleCI Dockerfile as a starting point. The image took over a half an hour to build on my 2015 MacBook Pro and 
required more memory allotted in the Docker resource settings. Without bumping up the memory, the LLVM build process
would run out of it and emit a failure. The actual built image may be found on dockerhub at 
[jjgp/llvm-development](https://hub.docker.com/repository/docker/jjgp/llvm-development).

The VS Code [Remote Development extension](https://code.visualstudio.com/docs/remote/remote-overview) pack allows for
development in a container. The jjgp/llvm-development Git repository has a `devcontainer.json` that points to the
aforementioned dockerhub image, adds a couple useful VS Code extensions, as well as an additional `runArgs`. The
`runArgs` allows for the use of LLDB. Without it, there will be an error thrown when attempting to use LLDB to
debug a process such as LLVM's `opt` command.

To run the sample pass in the Git repository simple do the following:

```
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Debug ..
make
```

Note that passing the `-DCMAKE_BUILD_TYPE=Debug` option retains the build symbols for debugging with GDB or LLDB.
The above builds the SamplePass shared object that can be loaded as an LLVM pass with the `opt` command. See the
Makefile in the root of the Git repository for an example of how to run the SamplePass.

To debug the pass do the following from the root of the Git repository:

```
clang -emit-llvm -S -fno-discard-value-names -c -o samples/hello_world.ll samples/hello_world.c
gdb opt
b SamplePass::runOnModule
# Make breakpoint pending on future shared library load? (y or [n]) y
run -load build/SamplePass.so -samplepass -S samples/hello_world.ll -disable-output
```

Then it should stop at the breakpoint!

```
Breakpoint 1, (anonymous namespace)::SamplePass::runOnModule (this=0x555557d68940, M=...) at /workspaces/llvm-development/src/SamplePass.cpp:13
13          bool modified = false;
(gdb) n
14          LLVM_DEBUG(dbgs() << "I'm here!\n");
(gdb) n
15          return modified;
(gdb)
```
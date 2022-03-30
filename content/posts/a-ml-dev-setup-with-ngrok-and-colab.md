---
title: A ML dev setup with ngrok and Colab
date: "2022-03-30T00:00:00Z"
---

As a user of a mac with a M1 chip, I often run into the obstacle of
dependencies without support for the arm64 architecture. It leads to
building the dependency locally, using a container or virtual machine, a
remote instance, or finding another dependency with similar features. For
this reason, I was drawn to the many examples of connecting through SSH to
a Colab instance: [ColabCode](https://github.com/abhishekkrthakur/colabcode), 
[colab-ssh](https://github.com/WassimBenzarti/colab-ssh), [colab-tricks](https://github.com/shawwn/colab-tricks).
As an exercise in understanding the previous approaches I decided to implement
a solution myself. The full process has been accumated into [ngrok.ipynb](https://github.com/jjgp/colab/blob/main/notebooks/ngrok.ipynb).

## A brief explanation of the process

Essentially to connect to a Colab instance the browser interface must be used 
to configure SSH and a tunneling tool such as [ngrok](https://ngrok.com/)
(or Cloudflare Tunnel). I implemented the SSH server with an authorized key and
used `ngrok` to create the TCP tunnel. Afterwards I was able to SSH into the 
instance. There was one caveat: when I ran `nvidia-smi` I was greeted by the 
following error:

> Failed to initialize NVML: Driver/library version mismatch

## In search of environment variables

It turns out that in my SSH session was missing environment variables that were
present in Colab's IPython shell that allows `nvidia-smi` to function properly. 
For example, opening up the terminal in the browser interface or using a cell
to run `env` would clarify the missing variables. In fact, when cross-referencing
with how [colab-ssh](https://github.com/WassimBenzarti/colab-ssh) is implemented 
it's noticable that some environment file writing is happening behind the scenes 
([colab_ssh/launch_ssh.py#L55](https://github.com/WassimBenzarti/colab-ssh/blob/0e495da074a9ded37e09e50b26a15b39eb8a4fb0/colab_ssh/launch_ssh.py#L55)). Even so, I wanted to know why the environment variables
were missing in SSH or populated in the Colab processes. Even more, I didn't want to rely
on a hardcoded list that may change in the future versions of Colab, CUDA, TensorFlow,
or NVIDIA (although I still sort of arrived at a hardcoded list).

At first I SSH'ed into the Colab instance and thought to check all the profile/rc files:
/etc/profile, /etc/bash.bashrc, ~/.bashrc, ~/.bash_profile. I vaguely knew some of these
files were sourced or not sourced in SSH sessions, interactive, non-interactive, login,
yada yada, and XYZ shells. That being said I'm not exactly privy to all the details and 
it turns out all the files on the instance were pretty vanilla. Therefore, there was
some other reason my SSH shell missed what Colab shells had.

## Inspecting the web client

I thought I could get a hint by inspecting the browser interface to figure out how it
interacted with the Colab instance. Perhaps opening the Colab terminal would
communicate with the instance in someway that would narrow my search. The source code
is of coursed minified and obfuscated and the HTML wasn't giving me much. I caught
that the terminal is actually a `tmux` session and fun to close out with *Ctrl+b*, *Ctrl+x*,
and *y*.

Inspecting the network when I open and closed the Colab terminal there was a polling request
to a URL like:

> https://colab.research.google.com/tun/m/gpu-t4-s-1xvtxpiyecc2j/tty/?authuser=XXXXXXX&transport=polling&t=XXXXXXX&sid=XXXXXXXXXXXXXXXXXXXX

...and it returns a response that represents the state of the terminal:

```
117:42["data",{"data":"\u001b[m\u001b[?1003l\u001b[?1006l\u001b[?2004l\u001b[1;1H\u001b[1;13r\u001b[1;11H","pause":true}]320:42["data",{"data":"\u001b[H\u001b[34m\u001b[1m/content\u001b[m#\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[37m\u001b[40m[0] 0:bash*              \"d325abb1682b\" 21:17 30-Mar-22\u001b[m\u001b[1;11H","pause":true}]88:42["data",{"data":"\u001b[H\u001b[K\u001b[34m\u001b[1m/content\u001b[m# ","pause":true}]
```

A lot of that unicode simply paints the following:

![Colab terminal](https://user-images.githubusercontent.com/3421544/160933923-58ab1cf2-ef91-4d16-84ad-2b120a6dbdd1.png)

I did notice that the request contained a `/tty/` in the path which stands for terminal. It also has
`gpu-t4-s-1xvtxpiyecc2j` which could somehow represent that I was using a specific GPU instance. Otherwise, 
there wasn't much more to go on.

## What exactly is running on the Colab instance

Returning to the actual Colab instance I was SSH'ed into, I would often run `top` or `ps -aux` to see
what was running.

```
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.0    992     4 ?        Ss   20:44   0:00 /sbin/docker-init -- /datalab/run.sh
root           8  0.0  0.4 367988 54120 ?        Sl   20:44   0:01 /tools/node/bin/node /datalab/web/app.js
root          24  0.0  0.0  35892  4904 ?        Ss   20:44   0:00 tail -n +0 -F /root/.config/Google/DriveFS/Logs/dpb.txt /root/.config/Google/DriveFS/Logs/drive_fs.txt
root          36  0.1  0.0      0     0 ?        Z    20:44   0:05 [python3] <defunct>
root          37  0.0  0.3 160404 40916 ?        S    20:44   0:00 python3 /usr/local/bin/colab-fileshim.py
root          62  0.0  0.4 203824 60388 ?        Sl   20:44   0:02 /usr/bin/python3 /usr/local/bin/jupyter-notebook --ip="172.28.0.2" --port=9000 --FileContentsManager.root_dir="/" --MappingKernelManager.
root          63  0.0  0.0 708228 10612 ?        Sl   20:44   0:02 /usr/local/bin/dap_multiplexer --domain_socket_path=/tmp/debugger_14ltpm10wj
root          80  0.3  0.7 470736 93636 ?        Ssl  20:52   0:07 /usr/bin/python3 -m ipykernel_launcher -f /root/.local/share/jupyter/runtime/kernel-cc5cc01e-40d9-48b5-8f7a-10571608b891.json
root         100  0.2  0.1 128408 16144 ?        Sl   20:52   0:05 /usr/bin/python3 /usr/local/lib/python3.7/dist-packages/debugpy/adapter --for-server 46787 --host 127.0.0.1 --port 23387 --server-access-
root         117  0.1  0.7 524628 103172 ?       Sl   20:52   0:04 node /datalab/web/pyright/pyright-langserver.js --stdio --cancellationReceive=file:cc9b716bb043ca4f062688d92cefdb3df8feac12f9
root         704  0.0  0.0  72304  4076 ?        Ss   20:52   0:00 /usr/sbin/sshd
root         753  0.0  0.0  39200  6376 ?        S    20:53   0:00 bash
root         755  0.2  0.1 726652 24192 ?        Sl   20:53   0:04 ngrok tcp 22 --log ngrok.log --log-format logfmt
root         831  0.0  0.0  55756  5856 ?        Ss   20:56   0:00 tmux new-session -A -D -s 0
root         832  0.0  0.0  47656  7200 pts/2    Ss+  20:56   0:00 -bash
root        1088  0.1  0.0 101560  7068 ?        Rs   21:29   0:00 sshd: root@pts/0
root        1099  0.0  0.0  20184  3828 pts/0    Ss   21:29   0:00 -bash
root        1112  0.0  0.0  36080  3268 pts/0    R+   21:29   0:00 ps -aux
```

So the instance is certainly a container and the initial process is kicked off by some `/datalab/run.sh` that
starts a node `/datalab/web/app.js` process. There is a Jupyter/IPython notebook process, dap_multiplexer (which
stands for "Debug Adapter Protocol" as found in the `/datalab/web` files), a `colab-fileshim.py` Python process (I think is used for the Colab file browser?), a [pyright](https://github.com/microsoft/pyright) language server, a [debugpy](https://github.com/microsoft/debugpy) process, a `tmux` session (hello again), and among others... I saw all these processes
and thought about what I could debug. The `/datalab/web/app.js` seemed like a good place to start.

## Debugging the datalab proxy server

In perusing the `/datalab/` folder on the Colab instance it became clear that it was a server that proxied the
Jupyter notebook server and setup a few sockets and the other processes. One of those sockets was found in the source
`/datalab/web/socketio_to_pty.js` file. The file implemented a [socketio](https://socket.io/) websocket and a [node-pty](https://github.com/microsoft/node-pty) pseudoterminal. Also in the source was the setup of a `tmux` session.

```javascript
// /datalab/web/socketio_to_pty.js:53
var spawnProcess = 'tmux';
var processArgs = ['new-session', '-A', '-D', '-s', '0'];
if (kernelContainerName !== '') {
    processArgs = ['exec', '-it', '-w', '/content', kernelContainerName, spawnProcess].concat(processArgs);
    spawnProcess = 'docker';
}
this.pty = nodePty.spawn(spawnProcess, processArgs, {
    name: "xterm-color",
    cwd: './content',
    // Pass environment variables
    env: process.env,
});
```

Whenever the Colab terminal is opened in the browser, this code spawns the `tmux` session. The spawning of the
psuedoterminal also highlights the passing of environment variables! I decided to debug the running server to
look closer. To do so I sent the user signal to the process (refer to the PID from aboves `ps -aux`):

```sh
kill -USR1 8
```

...and attached to it with:

```sh
/tools/node/bin/node inspect -p 8
```

In the debugger I set a breakpoint around `socketio_to_pty.js:53`.

```sh
debug> setBreakpoint("socketio_to_pty.js", 53)
```

Then in the browser I opened the Colab terminal which triggered the breakpoint.

![debug breakpoint](https://user-images.githubusercontent.com/3421544/160939415-bb533170-8a15-4f72-8bc6-1ad5d42e6117.png)

Printing out the `process.env` in the `repl` shows the extra environment variables.

![debug repl](https://user-images.githubusercontent.com/3421544/160938928-06d1f559-29c9-4f7b-a8ce-91d62ab140a2.png)

With the knowledge about the SSH session, `docker-init`, and debugged server I came to the thought that the
environment variables were most likely present from the actual `docker run` invocation of the container. This
could be why a new shell would not have the variables whereas a psuedoterminal spawned from
the initial process might.

## Deciding on the approach

After witnessing how the `tmux` session was started for the Colab terminal I decided to mimic it as closely as
possibly in my [ngrok.ipynb](https://github.com/jjgp/colab/blob/main/notebooks/ngrok.ipynb). To do so I read the
source for how [node-pty](https://github.com/microsoft/node-pty) passed the `env` property: [src/unixTerminal.ts#L282](https://github.com/microsoft/node-pty/blob/1674722e1caf3ff4dd52438b70ed68d46af83a6d/src/unixTerminal.ts#L282) 
and [src/terminal.ts#L197](https://github.com/microsoft/node-pty/blob/1674722e1caf3ff4dd52438b70ed68d46af83a6d/src/terminal.ts#L197). 
Long story short, I took a rather circuitous path to simply hardcode and pass some environment variables. Anyways, I can now
confidently SSH into a Colab instance and even use my favorite VS Code setup.

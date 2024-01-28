<br/>
<p align="center">
<a href=" " target="_blank">
<img src="https://avatars.githubusercontent.com/u/118692557?s=200&v=4" width="180" alt="Meteor logo">
</a >
</p >
<br/>

# dapp-examples

## Overview

### 1.base

This is a basic example of a Meteor dapp, which includes two models: `post`
and `profile` with locate in `./base/models`. It demonstrates the process of
creating, loading, monetizing, and unlocking a post by using Meteor hooks.

### 2.with-fs

This example adds some commonly used file-system calls on top of the base. 
It demonstrates more process of handling file/folder and data-token/data-union by using Meteor hooks.

### 3.social-network

This example shows how to build a basic Meteor dapp of social-network. 
It demonstrates actions like posting, commenting, liking, etc.

## Run

### 1.Prepare

Before running example, you need to install `create-meteor-app`.

```
pnpm install -g create-meteor-app
```

Here we use `base` as an example.

```
cd base
```

### 2.Install

```
pnpm install
```

### 3.Deploy

```
meteor deploy
```

This step will need your private key to generate personal signature. Rest
assured, Meteor will not store or disclose your private key..

After successful deployment, you can find the generated `./output/app.json`,
which contains various information about this new dapp.

### 4.Start

```
pnpm dev
```

The demo has been successfully launched. Try it!

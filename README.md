# denaur
AUR Helper made with Deno

super simple, currently lacking features, end goal is to have a user friendly and simple AUR helper.

run ``denaur help`` to get started

# Installation
download the [release](https://github.com/raxracks/denaur/releases) for your architecture then run the following command:
```
sudo chmod +x denaur-* && sudo mv denaur-* /usr/bin/denaur
```

# Compiling
you can either run the VSCode task or run the following command:
```
deno compile --allow-run denaur.ts && sudo cp denaur /usr/bin/
```

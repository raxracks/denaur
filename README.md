# denaur
AUR and pacman helper made with Deno

simple and minimalistic, currently has some issues

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
  
  
btw im aware its basically just javascript, ill give everything static types later

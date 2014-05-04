To start your project from base.git

    git clone git@github.com:Famous/base.git path/to/folder
    cd path/to/folder
    git submodule update --init --recursive

Then to push to your own repository, create the repository (on GitHub or wherever) at git://your.url.here

    git remote set-url origin git://your.url.here
    

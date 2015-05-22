#!/bin/bash

# used for copying build assests from git pull to web server path
# always call this script from within local git repo

# path to web server
out=$1

# directory of this file (your local git repo)
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# general
# cp "$dir"/README.md "$out"/
# cp "$dir"/setup.md "$out"/
# cp "$dir"/pack.sh "$out"/
# cp "$dir"/build.sh "$out"/
# cp "$dir"/.gitignore "$out"/

# usr
# mkdir -p "$out"/tmp
# cp -r "$dir"/usr/tmp "$out"/
# cp "$dir"/usr/toolbox.json "$out"/
# cp "$dir"/usr/nav.php "$out"/
# cp "$dir"/usr/report.php "$out"/

# build
mkdir -p "$out"/libs
cp -r "$dir"/dist/libs "$out"/
cp "$dir"/dist/edit.php "$out"/
cp "$dir"/dist/edit.css "$out"/
cp "$dir"/dist/edit.js "$out"/
cp "$dir"/dist/index.php "$out"/
cp "$dir"/dist/maps-style.css "$out"/
cp "$dir"/dist/map_layers.js "$out"/
cp "$dir"/dist/process.php "$out"/
cp "$dir"/dist/schema.json "$out"/

#!/bin/sh

mkdir build && cd build/

git clone https://github.com/petkofff/glitchy-cubes.git .

git checkout gh-pages

rm -rf *

cp -R ../../src/* .

echo coffee > .gitignore

git add --all

git commit -m "website updated"

git push

cd ..

rm -rf build

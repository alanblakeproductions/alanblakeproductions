#!/bin/sh

for file in src/assets/colorblind/*/*.png; do
  echo "$(du -h $file)"
  test $(identify -format "%[fx:(w>1600)?1:0]" $file) -eq 1 && \
    magick $file -resize "80%" $file
  echo "\t$(du -h $file)"
done

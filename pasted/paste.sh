#!/bin/bash
ulimit -c 0
ulimit -f 1024
ulimit -t 10
ulimit -m 1024
path=/home/paste
random=$(base64 /dev/urandom | head -c 32 )
timestamp=$(date +%s)
F=$(echo $random$timestamp | base64 | sed -s 's/\//P/g' | sed -s 's/=/F/g')
file=$path"/out/"$F".html"

cat $path"/pasted/"header > $file
echo http://graph.sanxiago.com/out/$(basename $file)
  if read -t 0; 
    then
        cat | sed -s 's/</./g' >> $file 
    else
        echo "$*" | sed -s 's/</./g'  > $file
    fi
cat $path"/pasted/"footer >> $file

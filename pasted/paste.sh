#!/bin/bash
ulimit -c 0
ulimit -f 1024
ulimit -t 10
ulimit -m 1024
path=/home/paste
file=$path"/out/out_"$REMOTE_HOST"_"$(date +%s )".html"
cat $path"/pasted/"header > $file
echo http://graph.sanxiago.com/$(basename $file)
  if read -t 0; 
    then
        cat >> $file 
    else
        echo "$*" > $file
    fi
cat $path"/pasted/"footer >> $file

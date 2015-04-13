#!/bin/bash
ulimit -c 0
ulimit -f 1024
ulimit -t 10
ulimit -m 1024
path=/home/paste
file=$path"/out/out_"$REMOTE_HOST"_"$(date +%s )".html"
cat $path"/pasted/"header > $file
echo http://graph.sanxiago.com/out/$(basename $file)
  if read -t 0; 
    then
        cat | sed -s '/\</./g' >> $file 
    else
        echo "$*" | sed -s '/\</./g'  > $file
    fi
cat $path"/pasted/"footer >> $file

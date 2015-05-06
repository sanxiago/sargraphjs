#!/bin/bash
ulimit -c 0
ulimit -f 1024
ulimit -t 10
ulimit -m 1024
localpath=/home/paste
outhash=$(sha256sum <<< "${REMOTE_HOST}_$(date +%s )" | cut -d' ' -f1)
file="/tmp/${outhash}"
if read -t 0;
then
    cat >> $file
else
    echo "$*" > $file
fi
sadf -d $file -- -A -p | /home/paste/pasted/paste.sh

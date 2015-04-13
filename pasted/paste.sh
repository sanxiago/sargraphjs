#!/bin/bash
ulimit -c 0
ulimit -f 1024
ulimit -t 10
ulimit -m 1024
localpath=/home/paste
outhash=$(sha256sum <<< "${REMOTE_HOST}_$(date +%s )" | cut -d' ' -f1)
file="${localpath}/out/out_${outhash}.html"
cat ${localpath}/pasted/header > $file
echo http://graph.sanxiago.com/out/$(basename $file)
if read -t 0;
then
    cat | sed -s 's/</./g' >> $file
else
    echo "$*" | sed -s 's/</./g' > $file
fi
cat ${localpath}/pasted/footer >> $file

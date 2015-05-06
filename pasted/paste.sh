#!/bin/bash
ulimit -c 0
ulimit -f 4000
ulimit -t 60
ulimit -m 4000
localpath=/home/paste
outhash=$(sha256sum <<< "${REMOTE_HOST}_$(date +%s )" | cut -d' ' -f1)
file="${localpath}/out/${outhash}.html"
cat ${localpath}/pasted/header > $file
echo http://graph.sanxiago.com/out/${outhash}.html
if read -t 0;
then
    cat | sed -s 's/</./g' >> $file
else
    echo "$*" | sed -s 's/</./g' > $file
fi
cat ${localpath}/pasted/footer >> $file

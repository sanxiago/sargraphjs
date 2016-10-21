#!/bin/bash
ulimit -c 0
ulimit -f 8000
ulimit -t 300
ulimit -m 8000
localpath=/home/paste
cd ${localpath}
random=$(base64 /dev/urandom | head -c 6  )
STRING="${REMOTE_HOST} ${random}.html"
# first, strip underscores
CLEAN=${STRING//_/}
# next, replace spaces with underscores
CLEAN=${CLEAN// /_}
# now, clean out anything that's not alphanumeric or an underscore
CLEAN=${CLEAN//[^a-zA-Z0-9\_\.]/}
# finally, lowercase with TR
CLEAN=`echo -n $CLEAN | tr A-Z a-z`
file=out/${CLEAN}
cat ${localpath}/pasted/header > $file
echo http://graph.sanxiago.com/${file}
if read -t 0;
then
    timeout 60s cat | sed -s 's/</./g' >> $file
else
    echo "$*" | sed -s 's/</./g' > $file
fi
cat ${localpath}/pasted/footer >> $file

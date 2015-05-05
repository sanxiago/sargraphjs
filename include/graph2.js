

// human friendly titles based on the first line
var graph_titles = { 
"CPU utilization" : "timestamp;CPU;%usr;%nice;%sys;%iowait;%steal;%irq;%soft;%guest;%idle",
"Task creation" : "timestamp;proc/s;",
"Context switching activity" : "timestamp;cswch/s",
"Swapping statistics " : "timestamp;pswpin/s;pswpout/s",
"Paging statistics" : "timestamp;pgpgin/s;pgpgout/s;fault/s;majflt/s;pgfree/s;pgscank/s;pgscand/s;pgsteal/s;%vmeff",
"I/O and transfer rate statistics" : "timestamp;tps;rtps;wtps;bread/s;bwrtn/s",
"Memory Statistics" : "timestamp;frmpg/s;bufpg/s;campg/s",
"Swap Utilization" : "timestamp;kbswpfree;kbswpused;kbswpcad;",
"Swap Utilization Percentage" : "timestamp;%swpused;%swpcad",
"Memory Utilization" : "timestamp;kbmemfree;kbmemused;kbbuffers;kbcached;kbcommit;",
"Memory Utilization Percentage" : "timestamp;%memused;%commit",
"Status of inode, file and other kernel tables" : "timestamp;dentunusd;file-nr;inode-nr;pty-nr",
"Queue length" : "timestamp;runq-sz;plist-sz;",
"Load average" : "timestamp;ldavg-1;ldavg-5;ldavg-15",
"TTY devices activity" : "timestamp;TTY;rcvin/s;txmtin/s;framerr/s;prtyerr/s;brk/s;ovrun/s",
"Activity for each block device" : "timestamp;DEV;tps;avgrq-sz;avgqu-sz;await;svctm;",
"Usage block device" : "timestamp;DEV;%util",
"R/W per second block device" : "timestamp;DEV;rd_sec/s;wr_sec/s;",
"Network statistics kiloBytes" : "timestamp;IFACE;rxkB/s;txkB/s;",
"Network statistics Packets" : "timestamp;IFACE;rxpck/s;txpck/s;",
"Network statistics" : "timestamp;IFACE;rxcmp/s;txcmp/s;rxmcst/s",
"Network error statistics" : "timestamp;IFACE;rxerr/s;txerr/s;coll/s;rxdrop/s;txdrop/s;txcarr/s;rxfram/s;rxfifo/s;txfifo/s",
"NFS client activity" : "timestamp;call/s;retrans/s;read/s;write/s;access/s;getatt/s",
"NFSD server activity" : "timestamp;scall/s;badcall/s;packet/s;udp/s;tcp/s;hit/s;miss/s;sread/s;swrite/s;saccess/s;sgetatt/s",
"Network Sockets" : "timestamp;totsck;tcpsck;udpsck;rawsck;ip-frag;tcp-tw"
}

var datetimes = []
var statistics = []
    
// nice to have a hash with the description of each element for reference
function readInput(){
    datetimes = {}
    statistics = {}
    document.getElementById('output').innerHTML=''
    text = document.getElementById('textinput').value
    var lines = text.split("\n")
   for(var x in lines){
        line = lines[x]
        var values = line.match(/(\w+)\s+(\d+)\s+([A-z0-9:-\s]+)\s+([^\s]+)\s+([^\s]+)\s+([0-9\.\,-]+)/)
        if(values !=null){
           // console.log(values)
            var interval = values[2]
            var time = values[3]
            var stat = values[5]
            var label = values[4]
            var value = values[6]  

            var mm = time.match(/^[0-9]+\s*$/)
            if(mm != null){
                time = new Date(time * 1000).toISOString()
            }
            var m = time.match(/([0-9]{4})-([0-1][0-9])-([0-3][0-9])[^0-9]+([0-2][0-9])(:|-)([0-9][0-9])(:|-)([0-9][0-9])\.*/)
            if(m != null){ // Check if you find formated date and replace it with posix timestamp
                    var formated = ''
                    time =  m[1] + "-" + m[2] + "-" + m[3] + ":" + m[4] + ":" + m[6] + ":" + m[8] 
            }
 
            datetimes[time]=interval
            if( statistics[stat] == undefined){
                statistics[stat] = []
            }
            if( statistics[stat][label] == undefined ){
                statistics[stat][label] = []
            }
            statistics[stat][label].push(value)
        }
        else{
            if(line != ''){
                console.log("ERROR: Cant Parse line "+line)
            } 
        }
     } // foreach line
print()
}

function print(){
    var col_x = []
    col_x.push('date')
    for (d in datetimes){
        col_x.push(d)
    }
    console.log(statistics)
    var chart_args = {
        bindto: '#chart_div',
        data: {
          x : 'date',
          xFormat : '%Y-%m-%d:%H:%M:%S',
          columns: [col_x, statistics['%idle']['all']  ]
        },
        axis : {
          x : {
            type : 'timeseries',
            tick : {
                format : "%H:%M" // https://github.com/mbostock/d3/wiki/Time-Formatting#wiki-format
            }
          }
        }
      }
    console.log(chart_args)
    var chart = c3.generate(chart_args)
}

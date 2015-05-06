

// human friendly titles based on the first line
var graph_titles = { 
"CPU utilization" : [ '%usr', '%nice', '%sys', '%iowait' , '%steal' , '%irq' , '%soft', '%guest' , '%idle' ],
"Task creation" : ['proc/s' ],
"Context switching activity" : [ "cswch/s" ],
"Swapping statistics " : ['pswpin/s' , 'pswpout/s' ],
"Paging statistics" : [ 'pgpgin/s' , 'pgpgout/s' , 'fault/s' , 'majflt/s' , 'pgfree/s' , 'pgscank/s' , 'pgscand/s' , 'pgsteal/s' , '%vmeff'],
"I/O and transfer rate statistics" : [ 'tps' , 'rtps' , 'wtps' , 'bread/s' , 'bwrtn/s'],
"Memory Statistics" : ['frmpg/s' , 'bufpg/s' , 'campg/s'],
"Swap Utilization" : ['kbswpfree' , 'kbswpused' , 'kbswpcad' ],
"Swap Utilization Percentage" : ['%swpused' , '%swpcad'],
"Memory Utilization" : ['kbmemfree' , 'kbmemused' , 'kbbuffers' , 'kbcached' , 'kbcommit' ],
"Memory Utilization Percentage" : ['%memused' , '%commit'],
"Status of inode, file and other kernel tables" : ['dentunusd' , 'file-nr' , 'inode-nr' , 'pty-nr'],
"Queue length" : ['runq-sz' , 'plist-sz' ],
"Load average" : ['ldavg-1' , 'ldavg-5' , 'ldavg-15'],
"TTY devices activity" : ['rcvin/s' , 'txmtin/s' , 'framerr/s' , 'prtyerr/s' , 'brk/s' , 'ovrun/s' ],
"Activity for each block device" : ['tps' , 'avgrq-sz' , 'avgqu-sz' , 'await' , 'svctm'],
"Usage block device" : ['%util'],
"R/W per second block device" : ['rd_sec/s' , 'wr_sec/s'],
"Network statistics kiloBytes" : ['rxkB/s' , 'txkB/s'],
"Network statistics Packets" : ['rxpck/s' , 'txpck/s'],
"Network statistics" : ['rxcmp/s' , 'txcmp/s' , 'rxmcst/s'],
"Network error statistics" : ['rxerr/s' , 'txerr/s' , 'coll/s' , 'rxdrop/s' , 'txdrop/s' , 'txcarr/s' , 'rxfram/s' , 'rxfifo/s' , 'txfifo/s'],
"NFS client activity" : ['call/s' , 'retrans/s' , 'read/s' , 'write/s' , 'access/s' , 'getatt/s'],
"NFSD server activity" : ['scall/s' , 'badcall/s' , 'packet/s' , 'udp/s' , 'tcp/s' , 'hit/s' , 'miss/s' , 'sread/s' , 'swrite/s' , 'saccess/s' , 'sgetatt/s'],
"Network Sockets" : ['totsck' , 'tcpsck' , 'udpsck' , 'rawsck' , 'ip-frag' , 'tcp-tw']
}

var datetimes = []
var statistics = []

// nice to have a hash with the description of each element for reference
function readInput(){
    datetimes = [] 
    statistics = []
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
    console.log("OK: Parsing complete")
    create_graphs()
}

function create_graphs(){
    function createDiv(id,target,title) {
        parentElement = document.getElementById(target)
        var d = document.createElement("div")
        d.setAttribute("id", "output_"+id)
        parentElement.appendChild(d)
        parentElement = document.getElementById("output_"+id)
        var d = document.createElement("p")
        d.innerHTML = title
        d.setAttribute("id", "title_"+id)
        parentElement.appendChild(d)
        var d = document.createElement("div")
        d.setAttribute("id" , "graph_"+id)
        parentElement.appendChild(d)
    }

    
    document.getElementById("output").innerHTML = '' // reset ouput
    for (title in graph_titles){
    //    console.log(graph_titles)
        var stats = graph_titles[title]
        var cols = []
        var ids = []
        var t = []
        for (var i in stats){
            var stat = stats[i]
            var sar_data = statistics[stat]
            for ( label in sar_data ){                
            var stat = stats[i]
            var id = title.toLowerCase().replace(/[^A-z0-9]/ig,'_')              
                t[id] = title
                if (label != '-' ){ // default label is '-' if not found we have subgraphs
                    stat = stat + "_" + label
                    id = id + "_" + label.replace(/[^A-z0-9]/ig,'_')
                    t[id] = title + " " + label
                }
                ids[id]=1
                var column = sar_data[label]
                column.push(stat)
                if ( cols[id] == undefined){
                    cols[id] = []
                }
                cols[id].push(column.reverse())
            }
        }
        for( var id in ids){
            createDiv( id, "output" , t[id] )
            print(t[id],cols[id],id)
        }

    }

}

function print(title,cols,id){
    var col_x = []
    col_x.push('date')
    for (d in datetimes){
        col_x.push(d)
    }
    columnas = []
    columnas.push(col_x)
    for (var i in cols){
        columnas.push(cols[i])
    }
//    console.log(columnas)

//    console.log(statistics)
    var chart_args = {
        bindto: '#graph_'+id,
        data: {
          x : 'date',
          xFormat : '%Y-%m-%d:%H:%M:%S',
          columns: columnas
        },
        axis : {
          x : {
            type : 'timeseries',
            tick : {
                format : "%Y-%m-%d %H:%M" // https://github.com/mbostock/d3/wiki/Time-Formatting#wiki-format
            }
          }
        }
      }
 //   console.log(chart_args)
    var chart = c3.generate(chart_args)
}



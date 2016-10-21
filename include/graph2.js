

// human friendly titles based on the first line
var graph_titles = { 
"CPU utilization" : [ '%usr', '%nice', '%sys', '%iowait' , '%steal' , '%irq' , '%soft', '%guest' , '%user' , '%system' ],
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

var graph_types = {}

var datetimes = []
var statistics = []



//    document.getElementByID('output').innerHTML='';



function readInput(){
    text = document.getElementById('textinput').value
    d = ParseSadf(text)
    datetimes = d[0]
    statistics = d[1]
    create_buttons(graph_titles)
}


function ParseSadf(text){
    datetimes = [] 
    statistics = []
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
//    console.log(statistics);
    return [ datetimes , statistics ]
}


function togglediv(id) {
        var id = "graph_"+id
        console.log("toggle "+id)
        var div = document.getElementById(id);
            div.style.display = div.style.display == "none" ? "block" : "none";
}

function createDiv(id,target,title) {
        if(document.getElementById("output_"+id)==null){
        parentElement = document.getElementById(target)
        var b = document.createElement("input")
        b.setAttribute("type", "button")
        b.setAttribute("onClick", "create_graph('"+title+"')")
        b.setAttribute("value", title)
        parentElement.appendChild(b)
       var d = document.createElement("div")
        d.setAttribute("id", "output_"+id)
        parentElement.appendChild(d)
        parentElement = document.getElementById("output_"+id)
        var d = document.createElement("div")
        d.setAttribute("id" , "graph_"+id)
        parentElement.appendChild(d)
        }
}

function create_graphs(graph_titles){
    for (title in graph_titles){
        console.log(title)
        create_graph(title)
    }
}

function create_buttons(graph_titles){
    for (title in graph_titles){
        var id = generate_id(title)
        createDiv( id, "output" , title )
    }
}

function generate_id(string){
        var id = string.toLowerCase().replace(/[^A-z0-9]/ig,'_')
        return id
}
    

function create_graph(title){
        var id = generate_id(title)
        var div = document.getElementById("graph_"+id)
        console.log(div.childElementCount)
        if(div.childElementCount > 1 ){
            togglediv(id)
        }
        var stats = graph_titles[title]
        console.log("Graphing:" + title)
        var cols = []
        var ids = []
        var t = []
        for (var i in stats){
            var stat = stats[i]
            var sar_data = statistics[stat]
            for ( label in sar_data ){                
            var stat = stats[i]
            var id = generate_id(title)
                t[id] = title
                if (label != '-' ){ // default label is '-' if not found we have subgraphs need to do this  better, should not create stuff here
                    stat = stat + "_" + label
                    var parent_id = id
                    id = id + "_" + generate_id(label)
                    t[id] = title + " " + label
                    createDiv( id, "graph_"+parent_id , title+" "+label )
                }
                ids[id]=1
                var column = sar_data[label]
                if ( column[0] != stat){
                column.push(stat)
                if ( cols[id] == undefined){
                    cols[id] = []
                }
                column.reverse()
                column.push(column.shift())
                column.reverse()
                cols[id].push(column)
                }else {
                    return
                }
            }
        }
        for( var id in ids){
            console.log(id)
            print(t[id],cols[id],id)
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

    var chart_args = {
        bindto: '#graph_'+id,
        size: { 
            height: '170'
        },
        data: {
          x : 'date',
          xFormat : '%Y-%m-%d:%H:%M:%S',
          type: 'area-spline' ,
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
   console.log(chart_args)
   var chart = c3.generate(chart_args)
}



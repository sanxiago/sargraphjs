
google.load('visualization', '1', {packages: ['corechart', 'line']});
//google.setOnLoadCallback(drawBasic);

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
};
	
// nice to have a hash with the description of each element for reference
function readLines(){
     document.getElementById('output').innerHTML='';
     text = document.getElementById('textinput').value;
     var lines = text.split("\n");
     for(var x in lines){
        line = lines[x];
        var m = line.match(/([0-9]{4})-([0-1][0-9])-([0-3][0-9])\s+([0-2][0-9])(:|-)([0-9][0-9])(:|-)([0-9][0-9])\s+([A-z]+)/);
        if(m != null){ // Check if you find formated date and replace it with posix timestamp
	   var unix = Math.round(+new Date(m[1],m[2]-1,m[3],m[4],m[6],m[8])/1000);
           line=line.replace(m[0], unix);
        }
        var values = line.match(/(\w+)\s+(\d+)\s+(\d+)\s+(\w+)\s+([A-z%]+)\s+([0-9\.\,]+)/);
        if(values !=null){
            values.shift(); // remove main match
            console.log(values);
            
        }
     } // foreach line
}
function readInput() {
     readLines()
     document.getElementById('output').innerHTML='';
     text = document.getElementById('textinput').value;
     sar_sections = text.split("# ");
     sar_sections.splice(0,1);
    var sar_headers = {} ;
    for(var n in sar_sections){
	createDiv(n,"output"); 
        var patt = new RegExp("^[A-Z]+$"); // UPPER CASE means CPU IFACE DEV multichart
        var is_multichart = false;
	var headers = {};
	var data = {};
	var title = '';
	var subcharts = {};
       // var data = new google.visualization.DataTable();
        var lines = sar_sections[n].split("\n");
        lines.pop(); // trailing empty line
        for(var x in lines){
            var fields = lines[x].split(";");
            if( x==0 ){
		for(var t in graph_titles){
			var is_title = new RegExp(graph_titles[t]);
			if ( is_title.exec(lines[x]) != null ){
				var title = t;
			}
		}
		document.getElementById("title_"+n).innerHTML= '<h3>' + title + '</h3>';
            	for(var y in fields){
		   headers[y]=fields[y];
			if( patt.exec(fields[y]) != null ){
			        var chart_title = y;
				is_multichart = true;
			} // if header is upper case it is multi chart
            } //foreach fields
            } // if first line is header
	    else{
		if(is_multichart){
			title=headers[chart_title]+"_"+fields[chart_title];
			subcharts[title]=1;
			if(data[title]==undefined){ data[title]=[]; }
			data[title].push(fields);
		}else{
			title=lines[0];
			if(data[title]==undefined){ data[title]=[]; }
			data[title].push(fields);
		}
		}
        } // foreach lines
	if(is_multichart){
	for(var title in subcharts){
		createDiv(title,"output_"+n);
		document.getElementById("title_"+title).innerHTML= '<h3>' + title + '</h3>';
		graphData( headers , data[title],"graph_"+title);
	}
	}
	else{	
		console.log(title);
		graphData(headers , data[title],"graph_"+n);
	}
    } // foreach sar_sections
}// graph_data

function createDiv(id,target) {
	parentElement = document.getElementById(target);
     	var d = document.createElement("div");
	d.setAttribute("id", "output_"+id);
     	parentElement.appendChild(d);
     	parentElement = document.getElementById("output_"+id);
       	var d = document.createElement("p");
        d.setAttribute("id", "title_"+id);
      	parentElement.appendChild(d);
    	var d = document.createElement("div");
      	d.setAttribute("id" , "graph_"+id);
      	parentElement.appendChild(d);
}

function graphData(headers,datas,div){
	var data = new google.visualization.DataTable();
	var check_is_number = new RegExp("^[0-9\.]+$");
	var check_is_timestamp = new RegExp("timestamp");
	var check_is_excluded = new RegExp("^[A-Z]+$|hostname|interval");
	var excluded= {};
	var is_timestamp = {} ;
	var rows = [];
	for ( var header in headers){
		if( check_is_timestamp.test(headers[header])){
			excluded[header]=true;
      			data.addColumn('datetime', "X");
			is_timestamp[header]=true;
		}
		else{
			if( check_is_excluded.test(headers[header])){
				excluded[header]=true;
			}else{
				excluded[header]=false;
      				data.addColumn('number', headers[header]);
			}
		}
	}
//	console.log(excluded);
//	console.log(datas);
	for( var i in datas){
		var row = [];
		for( var j in datas[i]){
			if(excluded[j]==false){
			//	console.log(i + "," + j + "->" + datas[i][j]);
				row.push(Number(datas[i][j]));
			}else { if(is_timestamp[j]){
				var m = datas[i][j].match(/([0-9]{4})-([0-1][0-9])-([0-3][0-9])\s+([0-2][0-9])(:|-)([0-9][0-9])(:|-)([0-9][0-9])\s+([A-z]+)/);
				if(m != null){
					row.push(new Date(m[1],m[2]-1,m[3],m[4],m[6],m[8]));
				}
			}}
		}
		if(m != null){
			rows.push(row);
		}
	}
//	console.log(rows);
//	console.log(data);
	data.addRows(rows);

      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: ''
        },
	legend: {
		position: 'top',
		maxLines: 12
	}
      };


      var chart = new google.visualization.LineChart(document.getElementById(div));
      chart.draw(data, options);
}

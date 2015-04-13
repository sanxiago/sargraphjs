
google.load('visualization', '1', {packages: ['corechart', 'line']});
//google.setOnLoadCallback(drawBasic);

// human friendly titles based on the first line
var graph_titles = { 
"CPU utilization" : "hostname;interval;timestamp;CPU;%usr;%nice;%sys;%iowait;%steal;%irq;%soft;%guest;%idle",
"Task creation and system switching activity" : "hostname;interval;timestamp;proc/s;cswch/s",
"Swapping statistics " : "hostname;interval;timestamp;pswpin/s;pswpout/s",
"Paging statistics" : "hostname;interval;timestamp;pgpgin/s;pgpgout/s;fault/s;majflt/s;pgfree/s;pgscank/s;pgscand/s;pgsteal/s;%vmeff",
"I/O and transfer rate statistics" : "hostname;interval;timestamp;tps;rtps;wtps;bread/s;bwrtn/s",
"Memory Statistics" : "hostname;interval;timestamp;frmpg/s;bufpg/s;campg/s",
"Memory Utilization" : "hostname;interval;timestamp;kbmemfree;kbmemused;%memused;kbbuffers;kbcached;kbcommit;%commit",
"Swap Utilization" : "hostname;interval;timestamp;kbswpfree;kbswpused;%swpused;kbswpcad;%swpcad",
"Status of inode, file and other kernel tables" : "hostname;interval;timestamp;dentunusd;file-nr;inode-nr;pty-nr",
"Queue length and load averages" : "hostname;interval;timestamp;runq-sz;plist-sz;ldavg-1;ldavg-5;ldavg-15",
"TTY devices activity" : "hostname;interval;timestamp;TTY;rcvin/s;txmtin/s;framerr/s;prtyerr/s;brk/s;ovrun/s",
"Activity for each block device" : "hostname;interval;timestamp;DEV;tps;rd_sec/s;wr_sec/s;avgrq-sz;avgqu-sz;await;svctm;%util",
"Network statistics" : "hostname;interval;timestamp;IFACE;rxpck/s;txpck/s;rxkB/s;txkB/s;rxcmp/s;txcmp/s;rxmcst/s",
"Network error statistics" : "hostname;interval;timestamp;IFACE;rxerr/s;txerr/s;coll/s;rxdrop/s;txdrop/s;txcarr/s;rxfram/s;rxfifo/s;txfifo/s",
"NFS client activity" : "hostname;interval;timestamp;call/s;retrans/s;read/s;write/s;access/s;getatt/s",
"NFSD server activity" : "hostname;interval;timestamp;scall/s;badcall/s;packet/s;udp/s;tcp/s;hit/s;miss/s;sread/s;swrite/s;saccess/s;sgetatt/s",
"Network Sockets" : "hostname;interval;timestamp;totsck;tcpsck;udpsck;rawsck;ip-frag;tcp-tw",
};
	
// nice to have a hash with the description of each element for reference

function readInput() {
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
	console.log(excluded);
	console.log(datas);
	for( var i in datas){
		var row = [];
		for( var j in datas[i]){
			if(excluded[j]==false){
			//	console.log(i + "," + j + "->" + datas[i][j]);
				row.push(Number(datas[i][j]));
			}else { if(is_timestamp[j]){
				row.push(new Date(datas[i][j]));
			}}
		}
		rows.push(row);
	}
	console.log(rows);
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

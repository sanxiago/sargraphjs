# sargraphjs
sargraphjs: Create graphs from systat sadf output using javascript
<br>-----</br>
Santiago Velasco( sargraphjs"A-MAIL-SIGN"sanxiago.com )

Create graphs from the output of <a href="http://sebastien.godard.pagesperso-orange.fr/"> sysstat </a>
command <a href="http://sebastien.godard.pagesperso-orange.fr/man_sadf.html"> sadf </a>

Using c3 Chart library http://c3js.org/ 
Which uses d3 http://d3js.org/

Eventually this can be used to graph other type of outputs, but will be content if it works with sar for now.

The working javascript can be seen here, you can paste your sadf output there.
http://graph.sanxiago.com

You can also pipe the output of sadf using netcat to the server and it will create a page with the data, no need to copy paste. It will give you the url with your data in response.

sadf -- -A -p | nc graph.sanxiago.com 443

You can use a simple loop to generate a graph for the last 30 days:

for i in $(ls -1rt /var/log/sa/sa??); do sadf $i -- -A -p 21600;  done | nc graph.sanxiago.com 443


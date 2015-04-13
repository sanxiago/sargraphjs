# sargraphjs
sargraphjs: Create graphs from systat sadf output using google charts
<br>-----</br>
Santiago Velasco( sargraphjs"A-MAIL-SIGN"sanxiago.com )

Create graphs from the output of <a href="http://sebastien.godard.pagesperso-orange.fr/"> sysstat </a>
command <a href="http://sebastien.godard.pagesperso-orange.fr/man_sadf.html"> sadf </a>
using google charts https://developers.google.com/chart/

Eventually this can be used to graph other type of outputs, but will be content if it works with sar for now.

The working javascript can be seen here, you can paste your sadf -d output there.
http://graph.sanxiago.com

You can also pipe the output of sadf -d using netcat to the server and it will create a page with the data, no need to copy paste. It will give you the url with your data in response.

sadf -d -- -A -p | nc graph.sanxiago.com 443

Moving forward google may abandon the js chart project
https://developers.google.com/chart/terms

I will switch the graphing engine, so far I have tested chartjs and it seems like a great replacement.

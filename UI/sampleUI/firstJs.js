var http = require('http');


http.createServer(function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.writeHead(200, {'Content-Type': 'text/html'});

    var SparqlClient = require('sparql-client');
    var util = require('util');
    var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/art_works';
    var query = 'prefix ex: <http://ex.usc.isi.edu/ontology/>\n' +
        'SELECT ?artist_name ?painting_title ?painting_image\n' +
        'WHERE {\n' +
        '    ?Artist ex:artistName  ?artist_name .\n' +
        '    ?Artist ex:artistPaintings ?painting .\n' +
        '    ?painting ex:paintingTitle ?painting_title .\n' +
        '    ?painting ex:paintingImage ?painting_image .\n' +
        '}\nLIMIT 30';
    var client = new SparqlClient(endpoint);
    console.log("Query to " + endpoint);
    console.log("Query: " + query);
    client.query(query)
      .execute(function(error, results) {
        // process.stdout.write(JSON.stringify(results.results.bindings));
        res.end(JSON.stringify(results.results.bindings));
    });


}).listen(8585);

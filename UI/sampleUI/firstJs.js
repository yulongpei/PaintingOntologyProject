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
    var client = new SparqlClient(endpoint);

    var qData = {};
    var body = "";
    if(req.method === 'OPTIONS'){
        console.log("in OPTIONS");
        res.end();
    }
    if(req.method === 'GET'){
        console.log("in GET");
        res.end();
    }
    if(req.method === 'POST' ){
        req.on('data', function(data){
            body += data;
            console.log("body:" + body);
        });
        req.on('end', function(){
            console.log("body: "+ body);
            var tempEq = body.split("&");
            for(var i=0;i<tempEq.length;i++)
            {
                var pair = tempEq[i].split("=");
                qData[pair[0]] = [pair[1]];
                console.log("pair:" +pair[0]);
                console.log("pair: " +pair[1]);
            }
            if(qData['type'] == 'general') {
                var query = 'prefix ex: <http://ex.usc.isi.edu/ontology/>\n' +
                    'SELECT ?Artist ?painting ?museum ?artist_name ?painting_title ?painting_image ?museum_name\n' +
                    'WHERE {\n' +
                    '    ?Artist ex:artistName  ?artist_name .\n' +
                    '    ?Artist ex:artistMuseum  ?museum .\n' +
                    '    ?Artist ex:artistPaintings ?painting .\n' +
                    '    ?Artist ex:artistBirthDate ?artist_birth .\n' +
                    '    ?Artist ex:artistDeathDate ?artist_death .\n' +
                    '    ?Artist ex:artistCountry ?artist_country .\n' +
                    '    ?painting ex:paintingTitle ?painting_title .\n' +
                    '    ?painting ex:paintingDate ?painting_year .\n' +
                    '    ?painting ex:paintingMedium ?painting_medium .\n' +
                    '    ?painting ex:paintingImage ?painting_image .\n' +
                    '    ?museum ex:museumName ?museum_name .\n';
                if (qData['artistName'] != undefined) {
                    query += '    filter(regex(lcase(str(?artist_name)),"' + qData['artistName'] + '")) .\n';
                }
                if (qData['artistBirth'] != undefined) {
                    query += '    filter(regex(str(?artist_birth),"' + qData['artistBirth'] + '")) .\n';
                }
                if (qData['artistDeath'] != undefined) {
                    query += '    filter(regex(str(?artist_death),"' + qData['artistDeath'] + '")) .\n';
                }
                if (qData['artistCountry'] != undefined) {
                    query += '    filter(regex(lcase(str(?artist_country)),"' + qData['artistCountry'] + '")) .\n';
                }
                if (qData['paintingYear'] != undefined) {
                    query += '    filter(regex(str(?painting_year),"' + qData['paintingYear'] + '")) .\n';
                }
                if (qData['paintingName'] != undefined) {
                    query += '    filter(regex(lcase(str(?painting_title)),"' + qData['paintingName'] + '")) .\n';
                }
                if (qData['paintingMedium'] != undefined) {
                    query += '    filter(regex(lcase(str(?painting_medium)),"' + qData['paintingMedium'] + '")) .\n';
                }
                query += '}';
            }else if(qData['type'] == 'artist'){
                if (qData['artistURI'] != undefined) {
                    console.log("before: " + qData['artistURI']);
                    var uri = decodeURIComponent(qData['artistURI']);
                    console.log("after: " + uri);
                    var query = 'prefix ex: <http://ex.usc.isi.edu/ontology/>\n' +
                                'SELECT ?property ?object\n' +
                                'WHERE {\n' +
                                '    <'+uri+'> ?property  ?object .\n' +
                                '}';
                }
            }else if(qData['type'] == 'painting'){
                var uri = decodeURIComponent(qData['paintingURI']);
                var query = 'prefix ex: <http://ex.usc.isi.edu/ontology/>\n' +
                            'SELECT ?property ?object\n' +
                            'WHERE {\n' +
                            '    <'+uri+'> ?property  ?object .\n' +
                            '}';
            }else if(qData['type'] == 'museum'){
                var uri = decodeURIComponent(qData['museumURI']);
                var query = 'prefix ex: <http://ex.usc.isi.edu/ontology/>\n' +
                            'SELECT ?property ?object\n' +
                            'WHERE {\n' +
                            '    <'+uri+'> ?property  ?object .\n' +
                            '}';
            }

            console.log("Query to " + endpoint);
            console.log("Query: " + query);
            client.query(query)
              .execute(function(error, results) {
                // process.stdout.write(JSON.stringify(results.results.bindings));
                res.end(JSON.stringify(results.results.bindings));
            });
        });
        
    }
}).listen(8585);




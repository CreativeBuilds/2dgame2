//The goal of this is to take a CSV file and convert it to a javascript array

fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var name = "testMap_Z2-T"

var inputFile=`convert/${name}.csv`;

var map=[];
fs.createReadStream(inputFile)
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        console.log(csvrow);
        //do something with csvrow
        map.push(csvrow);    
    })
    .on('end',function() {
      //do something wiht csvData
      fs.writeFile(`html/maps/${name}.json`, JSON.stringify(map), (err) => {
        if(err) throw err;
      })
      console.log(map.length, map[0].length);
    });

//Load in the CSV
//The goal of this is to take a CSV file and convert it to a javascript array

fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var name = "testMap_Z1"
var folderName = "island_01"

/* TYPES
 *  tree
 *  background
 *  buildings
 *  nowalk
 */
var outputName = "background"

var inputFile=`convert/${name}.csv`;

var map=[];
fs.createReadStream(inputFile)
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        //do something with csvrow
        map.push(csvrow);    
    })
    .on('end',function() {
      //do something wiht csvData
      fs.writeFile(`levels/${folderName}/${outputName}.json`, JSON.stringify(map), (err) => {
        if(err) throw err;
      })
    });

//Load in the CSV
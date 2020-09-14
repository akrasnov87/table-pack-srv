var fs = require('fs');
var join = require('path').join;


exports.getTables = async function(dir) {
    return await new Promise((resolve, reject)=>{
        fs.readdir(dir, async function(err, tables) {
            var versions = {};
            if(tables) {
                for(var i = 0; i < tables.length; i++) {
                    var table = tables[i];
                    versions[table] = await getVersionsByTable(join(dir, table));
                }
            }
    
            resolve(versions);
        });
    });
}

exports.getVersionsByTable = getVersionsByTable;

async function getVersionsByTable(dir) {
    return await new Promise((resolve, reject)=>{
        var records = []
        fs.readdir(dir, async function(err, versions) {
            versions.sort((a, b)=> {
                if(versionToNumber(a) < versionToNumber(b)) {
                    return -1;
                }

                if(versionToNumber(a) > versionToNumber(b)) {
                    return 1;
                }

                return 0;
            });
            var array = versions.reverse();
            for(var i in array) {
                records.push(await readReadme(join(dir, array[i])));
            }

            resolve(records);
        });
    });
}

exports.versionToNumber = versionToNumber;

function versionToNumber(version) {
    var data = version.split('.');
    return (parseInt(data[1]) * 24 * 60) + parseInt(data[2]);
}

async function readReadme(dir) {
    return await new Promise((resolve, reject) => {
        var file = join(dir, 'readme.txt');
        if(fs.existsSync(file)) {
            fs.readFile(file, function(err, txt) {
                if(err) {
                    reject(err);
                } else {
                    resolve(readmeToObject(txt.toString()));
                }
            });
        } else {
            resolve({});
        }
    });
}

function readmeToObject(txt) {
    var lines = txt.split('\n');
    var obj = {};
    var fields = lines[0].split('|');
    var values = lines[1].split('|');
    for(var i = 0; i < fields.length; i++ ) {
        obj[fields[i]] = values[i];
    }
    
    return obj;
}
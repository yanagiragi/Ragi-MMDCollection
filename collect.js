var path = require('path')
var fs=require('fs')
var crypto = require('crypto')
 
var container = []

function fromDir(startPath, filter, callback){
    return new Promise((resolve, reject) => {
        
        if (!fs.existsSync(startPath)){
            console.log("no dir ",startPath);
            resolve(container);
        }

        var files=fs.readdirSync(startPath);
        for(var i=0;i<files.length;i++){
            var filename=path.join(startPath,files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()){
                fromDir(filename,filter); //recurse
            }
            else if (filename.indexOf(filter)>=0) {
                var previewPath = filename.substring(0, filename.length - ".pmx".length) + "_preview.jpg"
                if(fs.existsSync(previewPath)){
                    name = (filename.lastIndexOf("\\") != -1) ? filename.substring(filename.lastIndexOf("\\") + 1, filename.length - ".pmx".length) : filename
                    var newPath = crypto.createHash('md5').update(previewPath).digest("hex");

                    container.push({
                        "name" : name,
                        "path" : filename,
                        "img" : newPath
                        })
                    
                    fs.createReadStream(previewPath).pipe(fs.createWriteStream(`Storage/${newPath}_preview.jpg`));
                }
            };
        };

        resolve(container);
    })
}

function CheckfromDir(startPath, filter, callback){
    return new Promise((resolve, reject) => {
        
        if (!fs.existsSync(startPath)){
            console.log("no dir ",startPath);
            resolve(container);
        }

        var files=fs.readdirSync(startPath);
        for(var i=0;i<files.length;i++){
            var filename=path.join(startPath,files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()){
                CheckfromDir(filename,filter); //recurse
            }
            else if (filename.indexOf(filter)>=0) {
                var previewPath = filename.substring(0, filename.length - ".pmx".length) + "_preview.jpg"
                if(filename.indexOf(".pm") == (filename.length - ".pmx".length)){
                    // console.log(filename)
                }
                if(!fs.existsSync(previewPath) && filename.indexOf(".pm") == (filename.length - ".pmx".length)){
                    name = (filename.lastIndexOf("\\") != -1) ? filename.substring(filename.lastIndexOf("\\") + 1, filename.length - ".pmx".length) : filename
                    container.push({
                        "name" : name,
                        "path" : filename
                    })
                }
            };
        };

        resolve(container);
    })
}

var MMDpath = 'E:\\_Source\\_Models\\Pmx\\_pmx'

if(process.argv[2] && process.argv[2] == "--check"){
    CheckfromDir(MMDpath,'.pmd')
        .then(CheckfromDir(MMDpath,'.pmx'))
        .then(()=>{
            console.log(JSON.stringify(container, null, 4))
        })
}
else{
    fromDir(MMDpath,'.pmd')
        .then(fromDir(MMDpath,'.pmx'))
        .then(()=>{
            console.log(JSON.stringify(container, null, 4))
        })
}


var path = require('path'), fs=require('fs');

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
                    container.push({
                        "name" : name,
                        "path" : filename
                    })
                    fs.createReadStream(previewPath).pipe(fs.createWriteStream(`Storage/${name}_preview.jpg`));
                }
            };
        };

        resolve(container);
    })
};

fromDir('D:\\_g2GoogleDrive\\_Source\\_Models\\Pmx','.pmd')
    .then(fromDir('D:\\_g2GoogleDrive\\_Source\\_Models\\Pmx','.pmx'))
    .then(()=>{
        console.log(JSON.stringify(container, null, 4))
    });
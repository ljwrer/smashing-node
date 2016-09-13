/**
 * Created by Ray on 2016/9/13.
 */
const fs=require('fs');
const path=require('path');
const colors = require('colors/safe');
const theme=require('colors/themes/generic-logging');
colors.setTheme(theme);
const stdin=process.stdin;
const stdout=process.stdout;
var base=process.cwd();
var gStats=[];
var gFiles=[];
function open(dir) {
    console.log(dir);
    fs.readdir(dir,function (err,files) {
        gFiles=files;
        if(!files.length){
            return console.log(colors.error('No files to show!'));
        }
        showFiles(dir,files,read);
    })
}
function showFiles(dir,files,cb) {
    console.log(colors.info("select file or directory"));
    var message=[];
    var show=function (filename,index) {
        var p=new Promise(function (suc) {
            fs.stat(dir+'/'+filename,function (err,stat) {
                if(stat.isDirectory()){
                    message[index]='    '+index+colors.info(' '+filename+'/');
                }else {
                    message[index]='    '+index+colors.info(' '+filename);
                }
                suc(stat);
            })
        });
        return p;
    };
    Promise.all(files.map(show)).then(function (stats) {
        message.forEach(function (msg) {
            console.log(msg);
        });
        cb(stats)
    });
}

function read(stats) {
    stdout.write(colors.input('enter your choice:'));
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data',function (data) {
        option(data,stats)
    })
}
function option(data,stats) {
    console.log(data)
    var no=Number(data);
    var fileName=gFiles[no];
    if(!fileName){
        stdout.write(colors.warn('enter your choice:'));
    }else {
        stdin.pause();
        if(stats[no].isDirectory()){
            base=path.resolve(base,fileName);
            stdin.removeAllListeners('data');
            open(base);
        } else {
            showFileData(fileName);
        }
    }
}
function showFileData(fileName) {
    fs.readFile(base+'/'+fileName,'utf8',function (err,data) {
        console.log('');
        console.log(data);
    })
}
open(base);
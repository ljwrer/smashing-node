/**
 * Created by Ray on 2016/9/13.
 */
const fs = require('fs');
const colors = require('colors/safe');
const theme = require('colors/themes/generic-logging');
colors.setTheme(theme);
const stdin = process.stdin;
const stdout = process.stdout;
var e = require('events').EventEmitter;
fs.readdir(process.cwd(), function (err, files) {
    console.log('');
    if (!files.length) {
        return console.log(colors.error('No files to show!'));
    }
    console.log(colors.info("select file or directory"));
    var stats = [];

    function file(i) {
        var filename = files[i];
        fs.stat(process.cwd() + '/' + filename, function (err, stat) {
            stats[i] = stat;
            if (stat.isDirectory()) {
                console.log('    ' + i + colors.info(' ' + filename + '/'));
            } else {
                console.log('    ' + i + colors.info(' ' + filename));
            }
            if (++i == files.length) {
                console.log('');
                read();
            } else {
                file(i);
            }
        })
    }

    function read() {
        stdout.write(colors.input('enter your choice:'));
        stdin.resume();
        stdin.setEncoding('utf8');
        stdin.on('data', option)
    }

    function option(data) {
        var fileName = files[Number(data)];
        if (!fileName) {
            stdout.write(colors.warn('enter your choice:'));
        } else {
            stdin.pause();
            if (stats[Number(data)].isDirectory()) {
                fs.readdir(__dirname + '/' + fileName, function (err, files) {
                    console.log('(' + files.length + ' files)');
                    files.forEach(function (file) {
                        console.log('    -    ' + file);
                    })
                });
            } else {
                fs.readFile(__dirname + '/' + fileName, 'utf8', function (err, data) {
                    console.log('');
                    console.log(data);
                })
            }
        }
    }

    file(0);
});

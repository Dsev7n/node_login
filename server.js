const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url');

var users = {};

var server = http.createServer(function(req, res){
    //解析数据
    var str = '';
    req.on('data', function(data){
        str += data;
    });
    req.on('end', function(){
        const obj = urlLib.parse(req.url, true);
        const url = obj.pathname;
        const GET = obj.query;
            const POST = querystring.parse(str);
        if (url =='/user') {  //接口
            switch(GET.act) {
                case 'reg':
                    if (users[GET.user]) {   //1.检查用户名是否已经有了
                        res.write('{"ok":false, "msg": "此用户已存在"}');
                    } else {     //2.插入users
                        users[GET.user] = GET.pass;
                        res.write('{"ok",true, "msg":"注册成功"}');
                    }
                    break;
                case 'login':
                    //1.检查用户是否存在 
                    if (users[GET.user]==null){
                        res.write('{"ok":false, "msg": "此用户不存在"}');                        
                    //2.检查用户密码
                    } else if (users[GET.user] !== GET.pass){
                        res.write('{"ok":false, "msg": "用户名或密码有误"}');

                    } else {
                        res.write('{"ok":true, "msg": "登录成功"}');
                    }
                    break;
                default:
                    res.write('{"ok":false, "msg":"未知的act"}');
                    
            }
            res.end();

        } else {
        
            //读取文件
            var file_name = './www' + url;
            fs.readFile(file_name, function(err, data){
                if (err) {
                    res.write('404');
                } else {
                    res.write(data);
                }
                res.end();
            })
        }
    });



});
server.listen(8080);
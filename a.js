const fs= require("fs");
const formidable = require("formidable");
const express=require('express');
const app=express();
var PATH="C:\\Users\\19633\\Desktop\\课设\\src\\"

function show(response) {
    response.setHeader('Content-type','text/html;charset=utf-8')
    var html = ''
    fs.readdir('./src', 'utf8', (err, msgArr) => {
        for (let i = 0, len = msgArr.length; i < len; i++) {
            html+=(`<div class="list-group-item"><div class="pull-left">${msgArr[i]}
            </div><div class="pull-right"><div class="aclick" onclick="aclick('dele?name=${msgArr[i]}',3) ">
            删除</div><div class="aclick" onclick="aclick('down?name=${msgArr[i]}',2) ">
            下载</div><div class="aclick" onclick="aclick('detail?name=${msgArr[i]}',1) ">
            详情</div></div></div>`)
        }
        setTimeout(function () {
            response.send(html);
        }, 100)
    })
}
    app.get('/',(request,response)=>{
        response.setHeader('Access-Control-Allow-Origin','*')
        response.setHeader('Content-type','text/html;charset=utf-8')
            fs.readFile('./a.html','utf-8',(e,d)=>{
                response.end(d)
            })
        })

    app.get('/refresh',(request,response)=>{
        response.setHeader('Access-Control-Allow-Origin','*')
       show(response)
    })

app.post('/up',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*')
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    form.uploadDir = "./src";
    form.encoding = 'utf-8' 
    form.parse(request,function(err,fields,files){
        fs.rename(files.a.path+'','src\\'+files.a.name+'', function(err){console.log('上传了！'+files.a.name);})
        if(files.a.size==0){
            fs.unlink(files.a.path, function(err){
            console.log('空文件删除');
       })}
        })
    response.end()
})

app.get('/dele',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*')
    var url=request.url
    var name=url.replace("/dele?name=","")
    name=decodeURI(name)
    fs.unlink(PATH+name, function(err){
        console.log('删除了'+name);
   })
   response.end()
})

app.get('/down',(request,response,next)=>{
    var name=request.url.replace("/down?name=","")
    name=decodeURI(name)
    console.log('下载了'+PATH+name);
    response.download(PATH+name)
})

app.get('/detail',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*')
    var url=request.url
    var name=url.replace("/detail?name=","")
    name=decodeURI(name)
    var detail=''
    fs.stat(PATH+name, (err, d) => {
        if(err) throw err;
        setTimeout(() => {
        var size = d.size, birth = d.birthtime, modi = d.mtime;
        detail += ('文件名：' + name + '，大小：' + size/1000 + 'kb，上传日期：' + birth + '，修改日期' + modi)
        detail=detail.replace('GMT+0800 (中国标准时间)','')
        detail=detail.replace('GMT+0800 (中国标准时间)','')
       response.send(detail)
        },100)
    })
})

app.use(express.static('mysrc'))
app.listen(8002,()=>{
    console.log('server started:8002 is listenting')
})

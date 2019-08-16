const cheerio = require('cheerio')
const http = require('http')
const iconv = require('iconv-lite')
const fs = require('fs')
let arr = []
let totalPages = 25       //这里的25是我要抓取当当网上的成功励志类的书，总共25页数据，可依据实际情况自定义

function crawler(pages = 0){
    let url =  `http://bang.dangdang.com/books/ebooks/98.01.21.00.00.00-recent7-0-0-1-${pages}`
    http.get(url, function (res) {
        const chunks = []
        res.on('data', function (chunk) {
            chunks.push(chunk)
        })
        res.on('end', function () {
            const html = iconv.decode(Buffer.concat(chunks), 'gb2312')   //查看网页源码编码方式，设置对应的编码格式，避免出现乱码
            getBooks(html)   //组装页面数据
        })
    }).on('error', function (err) {
        console.log("服务出错："+err)
    })
}

/* 定义一个组装页面数据的方法*/
function getBooks(html){
    let $ = cheerio.load(html)     //将获取到的内容解析成dom结构
    let bookList = $(".bang_list_mode li")
    for(let i=0;i<bookList.length;i++){
        let list_index = $(".bang_list_mode li").eq(i)
        let name = list_index.children("div.name").find("a").text()
        let author = list_index.children("div.publisher_info").eq(0).find("a").text()
        let publica_date = list_index.children("div.publisher_info").eq(1).find("span").text()
        let publishing_group = list_index.children("div.publisher_info").eq(1).find("a").text()
        let price_n = list_index.children("div.price").find("p").eq(0).children("span.price_n").text()
        let price_r = list_index.children("div.price").find("p").eq(0).children("span.price_r").text()
        let price_s = list_index.children("div.price").find("p").eq(0).children("span.price_s").text()
        let book_img = list_index.children("div.pic").find("img").attr("src")
        let book_info = {
            "name": name,
            "author": author,
            "publica_date": publica_date,
            "publishing_group": publishing_group,
            "price_n": price_n,
            "price_r": price_r,
            "price_s": price_s,
            "book_img": book_img
        }
        arr.push(book_info)
    }
    writeJson(arr)    //组装完需要的数据之后再存到json文件
}
/* 定义一个存数据的方法 */
function writeJson(params){
    fs.readFile('./data/books.json',function(err,data){
        if(err){
            return console.error(err)
        }
        let book = data.toString()      //将二进制的数据转换为字符串
        book = JSON.parse(book)         //将字符串转换为json对象
        book.data = book.data.concat(params) //将传来的对象拼进数组对象中
        book.total = book.data.length   //定义一下总条数
        console.log(book.data)   
        var str = JSON.stringify(book)  //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFile('./data/books.json',str,function(err){
            if(err){
                console.error(err)   
            }
        })
    })
}

//开始爬取数据
for(let i=0;i<totalPages;i++){
    crawler(i)
}

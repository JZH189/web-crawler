# web-craler
基于node.js编写的网络爬虫实现，将网页上的数据抓取并放入到本地json文件中。
爬虫思路：
   1、利用http/https模块将网页源码请求下来，使用iconv-lite将源码解码，使用cheerio模块将源码解析成dom结构然后利用dom操作获取想要得到的数据。
   2、使用fs操作本地文件，用于储存获取到的数据
   3、实现了分页爬取数据的方式
   
安装与使用：
   1、npm install
   2、node crawler运行就ok了


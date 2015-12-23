##app

###app.use( [route,] handler)          

**设置一个中间件**							

中间件可以分 2 种形式								

* 全局的中间件,每次请求都会经过					
* 根据路由来执行的中间件 ('尽量量避免使用')   		

全局的中间件				
			
```javascript							
app.use(function(next){
	console.log('global middleware');
	next && next();
});
```						

根据路由的中间件,路由规则为一个 **正则表达式** 

```javascript       
app.use('^/go(/.*)$', function(next){
	console.log('route middleware');
	next && next();
});  
```								

**next的问题**        

next 可以控制下一个中间件的执行				

一直在考虑是不是要加这个 next 上去, 最终决定还是加上去, 这样的话可以比较 easy 地控制流程.

在不确定后面有没有中间件的情况下请使用 ``` next && next() ```,来确保不报错,但fibjs 报错也不会退出,这一点不错.

**中间件传参**							

中间件之间传参有两种形式

* 利用 next 传参      
* 利用上下文传参    

利用next          

```javascript					
app.use(function(next){
	console.log('a');
	next && next('b');
});

app.use(function(b, next){
	console.log(b);
	next && next();
});
```          

利用上下文

```javascript
app.use(function(next){
	this.state = {};
	this.state.happy = 'yes';
	next && next();
});

app.use(function(next){
	console.log(this.state.happy)			//yes
	next && next();
});
```

###app.listen( port )						

可以监听 port 启动一个服务器						

###app.key =   

给你的服务器加个特殊的标识						
cookie 加密就有用到这个 key,默认是 fibx

##request

**this.method**								
请求的方式							

**this.query**					
带在 url 上的参数            
 
```
127.0.0.1:12306/post/Rube/?a=1&b=2;												
this.query       // {a : 1 , b : 2}
```

**this.queryString**							
请求的那串参数 ```?a=1&b=2```

**this.path**					
请求的路径 ```/post/Rube```

**this.request.body**						
请求的表单参数

**this.header**						
请求头一个 json 对象				

**this.get( key )**							
获取请求头的一个字段					
```this.get( 'X-Powered-By' )```				

**this.protocol**					
请求使用的协议					

**this.ip**					
请求的来源 ip, 不怎么可靠哦					

**this.port**						
请求过来的端口 					

**this.host**      				
请求的主机

**this.length**        			
请求 body 长度

**this.type**						
请求的类型 = this.get( 'Content-Type' )			
	
**this.is( reg )**					
是否为所对应的请求类型					
reg 是一个正在表达式			
			
```javascript				
this.is(/text\/javascript/);
this.is(/text\/.*/)
```

##response

**this.redirect( url )**						
跳转到相应的 url							

**this.body =**				
设置相应返回的内容						

**this.type =**					
设置相应的 Content-Type
	
**this.status =**						
设置相应的返回状态 					

**this.set( obj )**							
**this.set( filed, value )**					
设置返回头				
						
```javascript
this.set( 'lastModified', new Date() );		
		
this.set({
	'lastModified': new Date(),
	'Content-Type': 'text/javascript'
});		
```

**this.remove( filed )**			
移除返回头字段	
```this.remove( 'Content-Type' )```
	
##cookies						

**this.cookies.set( name, value [, option])**
设置 cookies 的值	,默认是加密且 httpOnly = true 的						

```javascript
  option = {
  		signed: boolean,				//默认为 true
  		httpOnly: boolean, 				//默认为 true
  		path: String,
  		domain: String,
  		expires: Date
  }
```
				
```javascript					
this.cookies.set( 'rube', 'hello',{
	path:'/',
	domain: '.taobao.com',
	expires: new Date(Date.now() + 3600)
});
```


**this.cookies.get( name [, option] )**				
获取 cookies 值,默认获取的是通过加密的 cookie						
要获取非加密的值 ```option.signed = false```




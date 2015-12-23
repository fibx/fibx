##app

####app.use( [route,] handler)          

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

##request



##response




##cookies
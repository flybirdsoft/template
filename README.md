# template
名称：前端模板

作者：邬畏畏

功能：把JSON数据渲染到页面。

#代码示例一：



    template.repeat({
        repeatId:".app-myapp",
        data:data,
        count:3
    });


参数说明：
1.repeatId 是 重复循环出现的元素容器
2.data 是 array
3.count 是 读取的记录个数

#代码示例二：

    template.repeat({
        repeatId:".app-myapp",
        data:data,
	process:function(object){
	
		return  {
		
                    "bgcolor": object.index%2==0?"odd":"even" ,
                    
                    "title"  : "<i style='color:#f00;font-size:14px;'>"+object.item.title+"</i>" ,
                    
                    "numbers.app.count" : parseInt(Math.random()*100)
                    
            };
            
	}
    });

template.repeat({
	repeatId:".app-myapp",
	
	data:data,
	

	
});


参数说明：
process 是 data参数中每个对象的自定义处理函数


# template
## template.repeat
名称：前端模板引擎

作者：邬畏畏

功能：提供前端model和view解决方案。

页面HTML：

    <div class="app-myapp fl ${bgcolor}">
        <div class="app-myapp-shared">${numbers.app.count}</div>
        <div class="app-myapp-photo icons"></div>
        <div class="app-myapp-caption">${title}</div>
        <div class="app-myapp-op">
            <a target="_blank" href="http://${url}">${url}</a>
        </div>
    </div>

#### 代码示例一：


var data = [

        {
        	title:"我的应用1",
            url:"www.cnblogs.com/wsoft",
        	numbers:
        	{
        		app:{count:"100"}
        	}
        },
        {
        	title:"我的应用2",
            url:"www.xx.com",
            numbers:
            {
                app:{count:"500"}
            }
        },
        {
        	title:"我的应用3",
            url:"www.yy.com",
            numbers:
            {
                app:{count:"300"}
            }
        }
];


    template.repeat({
        repeatElement:$(".app-myapp")[0],
        data:data,
        count:3,
        type:"cover"         
        //可选择参数 type="cover" 覆盖; type="insert" 加载到现有数据前面; type="append" 加载到现有数据的后面
    });


参数说明：

	1.repeatElement 是 模板DOM元素
  
	2.data 是 array

	3.count 是 读取的记录个数（参数可选）

	4.type 是 数据载入的方式



#### 代码示例二：

    template.repeat({
        repeatElement:$(".app-myapp")[0],
        data:data,
	process:function(object){ //动态处理每个记录的某个字段
		return  {
                    "bgcolor": object.index%2==0?"odd":"even" ,
                    "title"  : "<i>"+object.item.title+"</i>" ,
                    "numbers.app.count" : parseInt(Math.random()*100)
            };
	}
    });

参数说明：

process 是 data参数中每个对象的自定义处理函数，参数可选。

process	函数的参数参数object：

	object 是 包含index和item
	
	object.index 是 array中的索引
	
	object.item 是 data数组里的每一行
	
        return {...}可以自定义页面的字段值
        
        功能： 
        
        元素 <div class="app-myapp fl ${bgcolor}"> 中的 ${bgcolor}被替换为 odd 或 even
        
        bgcolor,title,numbers.app.count就是页面上的${bgcolor},${title},${numbers.app.count}
        
	
##  
## template modelView对象


    var modelView = template.repeat({
        repeatElement : $(".app-myapp")[0],
        data : data,
        type : "cover",
        onloadBefore : function(){
            console.log("load before");
        },
        onload : function(){
            console.log("loaded");
        }
    });



#### 更新数据

    modelView.update({
        "numbers.app.count":"300",
        "title":"我的应用3"
        },
        {
            title:"xxx",
            url:"WUI",
            numbers:
            {
                app:{count:"00"}
            }
        },
        function(isOK){
            //isOK=true表示更新成功
            alert(isOK);
        }
    );

  参数说明：“参数1”是匹配更新的条件;“参数2”是要更新的记录;“参数3”回调函数isOK为boolean,表示是否更新成功;
  注意：update()不实现ajax操作，只操作DOM元素。
    
#### 删除数据

    modelView.delete({
        "numbers.app.count":"500",
        "title":"我的应用2"
        },
        function(){
            alert('删除成功');
        }
    );


#### 添加数据

    modelView.add({
            title:"newTitle",
            url:"www.new.com",
            numbers:
            {
                app:{count:"90"}
            }
        },
        function(){
            alert('添加成功');
        }
    );


#### 插入数据

    modelView.insert(1,{
            title:"newTitle",
            url:"www.new.com",
            numbers:
            {
                app:{count:"90"}
            }
        },
        function(){
            alert('添加成功');
        }
    );

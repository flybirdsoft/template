/************************************************
编写：邬畏畏
blogs:www.cnblogs.com/wsoft
wui:www.flybirdsoft.com/wui
功能：模板处理
*************************************************/

var template={
	_startSymbol:"\\$\{",
	_endSymbol:"\}"
};

window.T=window.template=template;

template.startSymbol=function(symbol){
	var _symbol="",i;
	var regx="\^$*+?{}[]|.";
	for(i=0;i<symbol.length;i++)
	{
		if(regx.indexOf(symbol.substr(i,1))>=0)
		{
			_symbol = _symbol + '\\' ;
		}
		_symbol = _symbol + symbol.substr(i,1);
	}
	this._startSymbol = _symbol;
};
template.endSymbol=function(symbol){
	var _symbol="",i;
	var regx="\^$*+?{}[]|.";
	for(i=0;i<symbol.length;i++)
	{
		if(regx.indexOf(symbol.substr(i,1))>=0)
		{
			_symbol = _symbol + '\\' ;
		}
		_symbol = _symbol + symbol.substr(i,1);
	}	
	this._endSymbol = symbol;
};
template.repeat = function(options){
	/*
	options={
		data:data,
		id|repeatId:"",
		template:"",可选
		process:function(i,item){return {"field":"xxx"}},
		count:n
	}
	*/

	if(options.data==undefined)
	{
		throw new Error("参数名称不对,参数是{},缺少data");
		return;
	}
	if((options.repeatId==undefined&&options.id==undefined))
	{
		throw new Error("参数名称不对,参数是{},缺少id或repeatId");
		return;
	}

	var tmpl={string:""},all="";       /*tmpl=依据模板替换后的数据,all=全部替换的数据*/
	var data =[];             /*存储传入的数据，list*/
	var i,j,len,item,subItem; /*item=data中的每一行数据 , len=data数组长度*/
	var v,subv,jsonStr="";    /*v,subv存储JOSN中的key; jsonStr存储JSON的表达式形式如：title.sum*/
	var target = $(options.id)[0]||$(options.repeatId)[0];/*存储模板容器的id*/
	var nextNode=null;
	var parent = target.parentNode;
	var fun=function(){},result,v;  /*fun是process回调函数*/
	var bindResult;
	var resultObject={};
	var json={};
	var node=null;/*被重复的元素，即options.repeatId指定的元素*/
	
	var strV/*即页面字段值例如：${title}*/,reg/*strV的正则表达式*/;
	var attrValue="";/*repeatId元素上的遍历属性值*/
	
	if(options.template==undefined)
	{
		options.template = target.innerHTML;
	}
	
	if(options.data.length==undefined)
	{
		len=1;
		data[0]=options.data;
	}
	else
	{
		len=options.data.length;
		data=options.data;
	}
	
	if(options.count!=undefined)
	{
		len = options.count;
	}
	
	if(options.process!=undefined)
	{
		fun=options.process||options.onprocess;
	}

	nextNode = target;
	for(i=len-1;i>=0;i--)
	{
		resultObject={index:i,item:data[i]};
		result = fun.call(this,resultObject);
		node = document.createElement(target.nodeName);
		for(j=0;j<target.attributes.length;j++)
		{
			attrValue = target.attributes.item(j).value;
			for(v in result)
			{
				strV = this._startSymbol+v+this._endSymbol;
				reg = new RegExp(strV,"g");				
				attrValue = attrValue.replace(reg,result[v]);
			}
			node.setAttribute(target.attributes.item(j).name , attrValue);			
		}
		tmpl.string=options.template;
		item = data[i];
		for(v in result)
		{
			strV = this._startSymbol+v+this._endSymbol;
			reg = new RegExp(strV,"g");	
			tmpl.string = tmpl.string.replace(reg,result[v]);
		}
		for(v in item)
		{
			if(typeof(item[v])!="object")
			{
				strV = this._startSymbol+v+this._endSymbol;
				reg = new RegExp(strV,"g");
				tmpl.string = tmpl.string.replace(reg,item[v]);
			}
			else
			{
				template.getScope(item,v,tmpl);
			}
		}
		
		node.innerHTML = tmpl.string;
		parent.insertBefore(node,nextNode.nextSibling);
	}
	parent.removeChild(target);
	if(options.bind!=undefined)
	{
		json.target = $(options.id)[0];
		json.data = options.data;
		json.template = options.template;
		json.id = options.id;
		bindResult = options.bind.call(this,json);
	}
}/*end repeat*/

template.getScope = function(item,v,tmpl,scopeStr){
	var jsonStr="",subv,subItem;
	subItem = item[v];
	if(typeof(subItem)=="object")
	{
		if(scopeStr==undefined)
		{
			jsonStr = v;
		}
		else
		{
			jsonStr = scopeStr;
		}
		for(subv in subItem)
		{
			jsonStr += "."+subv;
			if(typeof(subItem[subv])=="object")
			{
				this.getScope(subItem,subv,tmpl,jsonStr);
				return;
			}
			strV = this._startSymbol+jsonStr+this._endSymbol;
			reg = new RegExp(strV,"g");
			tmpl.string = tmpl.string.replace(reg,subItem[subv]);
		}				
	}
	return ;
}

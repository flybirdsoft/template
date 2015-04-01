/************************************************
编写：邬畏畏
blogs:www.cnblogs.com/wsoft
wui:www.flybirdsoft.com/wui
功能：模板处理
*************************************************/

var template={
	_startSymbol:"\\$\{",
	_endSymbol:"\}",
	templateElement:{},
	contentNode:null
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

/*模板函数入口*/
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
	var _id_ = options.id||options.repeatId;/*存储模板的id*/
	var target;/*存储模板DOM对象*/
	var nextNode=null;
	var parent;/*模板的父节点*/
	var fun=function(){},result,v;  /*fun是process回调函数*/
	var bindResult;
	var resultObject={};
	var json={};
	var node=null;/*被重复的元素，即options.repeatId指定的元素*/
	
	var strV/*即页面字段值例如：${title}*/,reg/*strV的正则表达式*/;
	var attrValue="";/*repeatId元素上的遍历属性值*/
	
	target = $(options.id)[0]||$(options.repeatId)[0];
	parent = target.parentNode;
	template.deleteNode(target);
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
			if(typeof(result[v])!="object")
			{
				strV = this._startSymbol+v+this._endSymbol;
				reg = new RegExp(strV,"g");
				tmpl.string = tmpl.string.replace(reg,result[v]);
			}
			else
			{
				template.getScope(result,v,tmpl);
			}
			/*
			strV = this._startSymbol+v+this._endSymbol;
			reg = new RegExp(strV,"g");	
			tmpl.string = tmpl.string.replace(reg,result[v]);
			*/
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
		node.style.display="block";
		node.setAttribute("templateItem","templateItem");
	}
	/*parent.removeChild(target); 删除模板元素*/
	target.style.display="none";

	if(options.bind!=undefined)
	{
		json.target = $(options.id)[0];
		json.data = options.data;
		json.template = options.template;
		json.id = options.id;
		bindResult = options.bind.call(this,json);
	}
}/*end repeat*/

/*获取JSON的对象形式*/
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

/*删除数据*/
template.deleteNode=function(target){
	var node = target.nextSibling;
	var nextNode;
	var ife = (node.nodeType==1&&node.getAttribute("templateItem")=="templateItem")||node.nodeType!=1;
	while(node!=null&&ife)
	{
		nextNode = node.nextSibling;
		node.parentNode.removeChild(node);
		node = nextNode;
	}
	return;
	for(i=0;i<len;i++)
	{
		if(childNodes[i].nodeType==1&&childNodes[i].getAttribute("templateItem")=="templateItem")
		{
			parentNode.removeChild(childNodes[i]);
		}
	}
}
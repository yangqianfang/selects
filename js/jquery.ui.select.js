// JavaScript Document
// by yangqinafang 2011/12/09
///add 2011-12-14 增加了top调节top默认28在样式表中select_value  为了防止下列表li被新样式覆盖，给li 曾加了class="list" 同时样式表也要改变
(function($) {
    $.fn.selects = function(o) {
        var op = $.extend({},
        $.fn.selects.defaults, o),
        obj = $(this),
        get,
        g,
        tagname = $(this).get(0).tagName;
		op._w=obj.outerWidth();
		op._top=obj.outerHeight(),op.bakdata = op.data,
        get = {
            getClass: function() {
                return op.className;
            },
            getDefaultName: function() {
                return op.defaultName;
            }
        }, h_ = 28 * op.defaultLine,border = "";
		obj.attr("txt","");obj.attr("val","");
        if (op.data.length == 0) {
            if (op.firstnum == '') {
                h_ = 0;
                border = "border:0px;"
            } else {
                h_ = 26
            }
        } else if (op.data.length > 0) {
            if (op.data.length <= op.defaultLine) {
                h_ = "";
            }
        }
        g = {
            createBoth: function() {
                if (obj.next('.select_div').length != 0) {
                    obj.next('.select_div').remove();
                    obj.parent().after(obj).remove();
                }
                obj.wrap('<div style="position:relative;font-weight:normal;z-index:' + op.zindex + '; padding:0;marign:0;display:' + op.display + ';"></div>');
                    var menu = '';
					//diy
                    if (op.createDiy.diy) {
                        menu = '<div class="select_div" style="top:' + op._top + 'px;height:' + h_ + 'px;left:0;' + border + '"><ul class="' + get.getClass() + '" style="height:' + h_ + 'px;width:' + op._w + 'px;' + border + '"></ul><div class="selectcreateli" href="javascript:void(0)" style=" width:' + op._w + 'px;"><a href='+op.createDiy.links+' id="'+op.createDiy.id+'" target='+op.createDiy.target+'><b>+'+op.createDiy.text+'</b></a></div></div>';
                    }  else {
                        menu = '<div class="select_div" style="top:' + op._top + 'px;left:0;height:' + h_ + 'px;' + border + ';"><ul class="' + get.getClass() + '" style="height:' + h_ + 'px;width:' + op._w + 'px;' + border + '"></ul></div>';
                    }
                    obj.after(menu);
                obj.unbind('click');
                obj.click(function(event) {
                    $(".option").hide();
                    event.stopPropagation();
                    if (obj.next().is(":hidden")) {
                        $('.select_div').hide();
                        obj.next().slideDown(1);
                    } else {
                        obj.next().slideUp(1);
                    }
                    $(document).bind('click',
                    function(e) {
                        if ($('.select_div').length > $('.select_div:hidden').length) {
                            $('.select_div').hide();
                        }
                    });
                });

                obj.next().append('<input type="hidden" id="' + op.valueId + '" value="' + op.defaultValue + '"/>');
            },

            createList: function() {
                var data = op.data,
                h = '';
                obj.next().find("ul").html("");
                if (op.firstnum != '') {
                    obj.next().find("ul").append('<li class="list" style=" width:' + op._w + 'px;"><a key="" text="' + op.firstnum + '" href="javascript:void(0)">' + op.firstnum + '</a></li>');
                }
                for (var i = 0; i < data.length; i++) {
                    var txt=  data[i][op.textField],
					val = data[i][op.valueField],
                    subtxt = '';
                    if (op.viewSubstr != "") {
                        subtxt = g.substr(data[i][op.textField],op.viewSubstr);
                    } else {
                        subtxt = data[i][op.textField];
                    }
					if(data[i].disable){//置灰
					 obj.next().find("ul").append('<li class="list" style=" width:' + op._w + 'px;"><span class="disable" key="' + val + '" text="' + txt + '" title="'+txt+'"  href="javascript:void(0)">' + subtxt + '</span></li>');
					}else{
                    if (i == data.length - 1) {
                        obj.next().find("ul").append('<li class="list" style=" width:' + op._w + 'px;border-bottom:none;"><a key="' + val + '" text="' + txt + '" title="'+txt+'" href="javascript:void(0)">' + subtxt + '</a></li>');
                    } else {
						var current='';
						if(val==op.defaultValue){current="current"}
                        obj.next().find("ul").append('<li class="list '+current+'" style=" width:' + op._w + 'px;"><a key="' + val + '" text="' + txt + '" title="'+txt+'" href="javascript:void(0)">' + subtxt + '</a></li>');
                    }
				}
                }
            },
            addClik: function() {
                var _target = obj.find('span');
                obj.next().find("li a").each(function() {
                    $(this).bind("click",
                    function() {
                        if (op.clickV != 1) {
                            var txt = $(this).attr("text");
							var val = $(this).attr("key");
                            if (tagname == "INPUT") {
                                obj.attr("value", $(this).attr("text"));
								 $("#" + op.valueId).attr("value", $(this).attr("key"));
                            } else {
                                if (op.clickSubstr != "") {
                                    _target.html(g.substr($(this).attr("text"),op.clickSubstr));
                                } else {
                                    _target.html($(this).attr("text"));
                                }

                            }
							obj.attr("txt",txt);obj.attr("val",val);
							obj.next().find("ul li.current").removeClass("current");
							$(this).parent().addClass("current");
							
                            $("#" + op.valueId).attr("value", $(this).attr("key"));
                            obj.next().slideUp(1);
                        }
                        op.callback(txt, val);
                        return false;
                    })
                });
            },
            initval: function() {
                var searchcss = 'width:' + (op._w - 10) + 'px;';
                obj.next().find("ul").before("<div class='select_top_left' style='width:" + (op._w - 2) + "px;'><div class='select_top_right'><div class='select_top_center'></div></div></div>");
                if (op.isSearch) {
                    obj.next().find("ul").before('<div style="width:' + op._w + 'px"><input onfocus=if(this.value=="搜索"){this.value="";this.style.color="#000"} onblur=if(this.value==""){this.value="搜索";this.style.color="#ccc"} value="搜索" class="sel_search" type="text"  style="' + searchcss + '" /></div>');
                }
                if (obj.next().find("div").hasClass("selectcreateli")) {
                    obj.next().find(".selectcreateli").after("<div class='select_bottom_left' style='width:" + (op._w - 2) + "px;'><div class='select_bottom_right'><div class='select_bottom_center'></div></div></div>")
                } else {
                    obj.next().find("ul").after("<div class='select_bottom_left' style='width:" + (op._w - 2) + "px;'><div class='select_bottom_right'><div class='select_bottom_center'></div></div></div>")
                }
                var _target = obj.find('span');
                if (tagname == "INPUT") {
                    obj.attr("value", get.getDefaultName());
                } else {
                    if (op.clickSubstr != "") {
                        _target.html(g.substr(get.getDefaultName(),op.clickSubstr));
                    } else {
                        _target.html(get.getDefaultName());
                    }

                }
            },
            //搜索方法
            searchArr: function(word) {
                var newarr = [];
                $(op.bakdata).each(function(i, items) {
                    if (items[op.textField].indexOf(word) > -1) {
                        newarr.push(items);
                    }
                });
                return newarr;
            },substr:function (str, len){
					if(!str || !len) { return ''; }
					var a = 0;
					var i = 0;
					var temp = '';
					for (i=0;i<str.length;i++)
					{
						if (str.charCodeAt(i)>255)
						{
						  
							 a+=2;
						}
						else
						{
							 a++;
						}
						
						if(a > len) { return temp+"..."; }

					   
						 temp += str.charAt(i);
					}
				   
					return str;
				}
        };
        g.createBoth();
        g.initval();
        g.createList();
        g.addClik();
		//根据ID对应显示name
        if (op.defaultValue) {
            for (var i = 0; i < op.bakdata.length; i++) {
                if (op.bakdata[i][op.valueField] == op.defaultValue) {
                    if (op.clickSubstr != "") {
                        obj.find("span").html(g.substr(op.bakdata[i][op.textField],op.clickSubstr));
						
                    } else {
                        obj.find("span").html(op.bakdata[i][op.textField]);
                    }
					obj.attr("txt",op.bakdata[i][op.textField]);obj.attr("val",op.defaultValue);
                }
            }
        }
        //搜索
        if (op.isSearch) {
            obj.next().find(".sel_search").bind("click",
            function(event) {
                event.stopPropagation();
            }).bind("keyup",
            function(e) {
                //if (e.which == 13){
                var svl = $(this).val();
                if (svl == "" || svl == "搜索") {
                    op.data = op.bakdata;
                } else {
                    op.data = g.searchArr(svl);
                }
                g.createList();
                g.addClik();
                //	}
            });
        }

  }
    //defaults config
    $.fn.selects.defaults = {
        data: [],//数据       
        valueField: 'id',//数据字段id
        textField: 'name',//数据字段名称
        defaultName: "请选择",//默认显示名称
		defaultValue: "",//默认value
		valueId: "idval",//隐藏input的id下拉时记录下拉的当前id
        className: "select_value",//样式
        clickV: 0,
        createDiy: {diy:false,text:"",links:"",target:"_blank",id:""},//创建diy
        defaultLine: 5,//默认下拉显示条数
        zindex: '1',
        clickSubstr: "",//显示的截取个数
        viewSubstr: "",//下拉里面的显示个数
        firstnum: "",//第一条数据name
        display: 'inline-block',
        isSearch: false,//是否启用搜索功能
        callback: function() {}//点击下拉时回调函数返回参数(name,id)
    }
})(jQuery);
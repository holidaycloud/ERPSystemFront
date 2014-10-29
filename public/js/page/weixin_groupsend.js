//生成缩略图
function generateReview(url){
 var obj = "<div class='list01'><div class='imgdiv'><img src='"+url+"'/></div>";
    obj +="<p></p>";
    obj +="<div class='btdiv'><label class='radio' style='margin-top:5px;margin-left:70px;'><input type='radio' name='gsPic' value='"+url+"'><i></i></label></div></div>";
    $("#images").append(obj);
}

//生成图文列表
function generatePicMsgList(title,date,intr,url,media,id){
    var obj = "<div class='list02'><h2>"+title+"</h2><h4>"+date+"</h4><div class='info'><img src='"+url+"'/><p style='overflow: hidden; text-overflow:ellipsis;white-space: nowrap'>"+intr+"</p></div>";
    obj +="<div class='btdiv'><label class='checkbox' style='margin-top:10px;margin-left:120px;'><input id='gs_"+id+"' type='checkbox' name='gsPicMsg' value='"+id+"' title='"+title+"' intr='"+intr+"' media='"+media+"'><i></i></label></div></div>";
    $("#picMsgs").append(obj);
    $("#gs_"+id).bind("click",function(e){
        if($(this).is(":checked")){
            if(count<8){
                count++;
                var product = {};
                product.title = $(this).attr("title");
                product.intr = $(this).attr("intr");
                product.media = $(this).attr("media");
                product.id = $(this).val();
                selectPdts.push(product);
            }else{
                $(this)[0].checked = false;
                alert("群发的图文消息最多只能勾选8个产品！");
            }
        }else{
            var tmp = [];
            for(var i in selectPdts){
                if($(this).val()!==selectPdts[i].id){
                    tmp.push(selectPdts[i]);
                }
            }
            count--;
            selectPdts = tmp;
        }
    });
}

//初始图文消息产品选择列表
function initPicMsgPdts(){
    $("#picMsgs").html("");
    $("#ldModal").modal({
        backdrop:false,
        keyboard:false
    });
    //get weixin config
    $.ajax({
        type: "GET",
        url: "wx/getPicMsgPdts",
        cache:false
    }).done(function(data, textStatus){
        if(data.error==0){
            if(data.data){
                for(var i=0;i<data.data.length;i++){
                    var p = data.data[i];
                    generatePicMsgList(p.name,"创建日期："+ new Date(p.createTime).format("yyyy-MM-dd"), p.introduction, p.images.length>0? p.images[0].url:"img/logo-o.png",  p.images.length>0? p.images[0].media_id:"", p._id);
                }
            }
        }else{
            alert(data.errorMsg);
        }
        $("#ldModal").modal("hide");
    }).fail(function(){
        $("#ldModal").modal("hide");
        alert("网络异常，请重试！");
    });
}
//生成缩略图
function generateReview(url){
 var obj = "<div class='list01'><div class='imgdiv'><img src='"+url+"'/></div>";
    obj +="<p></p>";
    obj +="<div class='btdiv'><label class='radio' style='margin-top:5px;margin-left:70px;'><input type='radio' name='gsPic' value='"+url+"'><i></i></label></div></div>";
    $("#images").append(obj);
}

//生成图文列表
function generatePicMsgList(title,date,intr,url,id){
    var obj = "<div class='list02'><h2>"+title+"</h2><h4>"+date+"</h4><div class='info'><img src='"+url+"'/><p>"+intr+"</p></div>";
    obj +="<div class='btdiv'><label class='radio' style='margin-top:10px;margin-left:120px;'><input type='radio' name='gsPicMsg' value='"+id+"'><i></i></label></div></div>";
    $("#picMsgs").append(obj);
}
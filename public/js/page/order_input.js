//下拉框格式化方法
function formatSelect2(e){
    $("#ldModal").modal({
        backdrop:false,
        keyboard:false
    });
    var d = $(e.element);
    selectedPdt = e.id;
    selectPdtEnt = d.data('pid');
    selectPdtType = d.data('type');
    if(0==selectPdtType){
        $("#oi0").show();
        $("#oi3").hide();
        var st = new Date(d.data('std')).format("yyyy-MM-dd");
        var ed = new Date(d.data('edd')).format("yyyy-MM-dd");
        selectSD = st;
        selectED = ed;
        $("#showDate").html(st+"至"+ed);
        $("#ldModal").modal('hide');
        initCal();
    }else if(3==selectPdtType){
        initType3Pdt();
    }
    return e.text;
}

//init type 3 product data
function initType3Pdt(){
    $("#ldModal").modal({
        backdrop:false,
        keyboard:false
    });
    $("#oi0").hide();
    $("#oi3").show();
    if(selectedPdt&&selectedPdt.trim()!==""){
        var params = {};
        params.product = selectedPdt;
        $.ajax({
            type: "POST",
            url: "/pi/list",
            cache:false,
            data:params
        }).done(function(data, textStatus){
            if(data.error!=0){
                showMessage("error","获取数据失败！"+data.errorMsg);
            }else{
                $("#oi3PriceId").val(data.data._id);
                $("#oi3SP").val(data.data.price);
                $("#oi3Price").html(data.data.price);
                $("#oi3Total").html(data.data.price);
                $("#oi3Qty").spinner("option","min",1);
                $("#oi3Qty").spinner("option","max",data.data.inventory);
                htmlCustomers(1,"oi3Cus");
            }
        }).fail(function(){
            alert("网络异常，请重试！");
        });

        //get product detail
        if(selectedPdt&&selectedPdt.trim()!==""){
            var params = {};
            params.product = selectedPdt;
            $.ajax({
                type: "POST",
                url: "/order/getPdtDetail",
                cache:false,
                data:params
            }).done(function(data, textStatus){
                if(data.error!=0){
                    showMessage("error","获取数据失败！"+data.errorMsg);
                }else{
                    $("#pIntr").html(data.pdt.introduction);
                    $("#pCont").html(data.pdt.content);
                    $("#pMap").html(data.pdt.gps);
                    $("#pdtDetail").show();
                }
            }).fail(function(){
                alert("网络异常，请重试！");
            });
        }
        $("#ldModal").modal('hide');
    }
}
//init calendar
function initCal(){
    $('#priceCal').fullCalendar('destroy');
    $("#priceCal").fullCalendar({
        aspectRatio:3,
        header: {
            left: 'prev,next today',
            center: 'title',
            right:''
        },
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        today: ["今天"],
        firstDay: 1,
        buttonText: {
            today: '本月',
            month: '月',
            week: '周',
            day: '日',
            prev: '上一月',
            next: '下一月'
        },
        editable: false,
        droppable: false,
        allDay:true,
//        dayClick: function (date, allDay, jsEvent, view) {
//        },
        eventRender: function(event, element) {
            element.find('.fc-event-title').append("<br/><span class='ultra-light'>" + event.description +
                "</span>").css("cursor","pointer");
        },
        eventClick: function(calEvent, jsEvent, view) {
            var qty = 0;
            var singlePrice = 0;
            var titles = calEvent.title.split("/");
            var descs = calEvent.description.split("/");
            for(var i  in titles){
                if(titles[i]==="价格"){
                    singlePrice = descs[i];
                }else if(titles[i]==="库存"){
                    qty = descs[i];
                }
            }
            if(qty == 0){
                alert("这一天没有库存无法预订！");
            }else{
                clearOrderModal();
                $("#oiPriceId").val(calEvent.id);
                $("#oiSP").val(singlePrice);
                var  pName = $("#oiPName").select2("data");
                $("#oiName").html(pName.text);
                $("#oiDate").html(calEvent.start.format("yyyy-MM-dd"));
                $("#oiPrice").html(singlePrice);
                $("#oiQty").spinner("option","min",1);
                $("#oiQty").spinner("option","max",qty);
                $("#oiTotal").html(singlePrice);
                htmlCustomers(1,"oiCus");
                $("#oiModal").modal();
            }
        },
        events: function(start, end, callback) {
            if(selectedPdt&&selectedPdt.trim()!==""){
                var params = {};
                params.product = selectedPdt;
                params.startDate = selectSD;
                params.endDate = selectED;
                $.ajax({
                    type: "POST",
                    url: "/order/getPdtDetail",
                    cache:false,
                    data:params
                }).done(function(data, textStatus){
                    if(data.error!=0){
                        showMessage("error","获取数据失败！"+data.errorMsg);
                    }else{
                        $("#pIntr").html(data.pdt.introduction);
                        $("#pCont").html(data.pdt.content);
                        $("#pMap").html(data.pdt.gps);
                        $("#pdtDetail").show();
                        callback(data.data);
                    }
                }).fail(function(){
                    alert("网络异常，请重试！");
                });
            }
        },
        windowResize: function (event, ui) {
            $('#priceCal').fullCalendar('render');
        }
    });
}

//generate customer html
function htmlCustomers(number,id){
    var html = "";
    for(var i=0;i<number;i++){
        html +="<section><div class=\"row\"><label class=\"label col col-2\">使用人</label>";
        html +="<div class=\"col col-4\"><label class=\"input\"><input type=\"text\" name=\"oiCusName\" placeholder='使用人姓名'></label></div>";
        html +="<label class=\"label col col-2\">手机号</label>";
        html +="<div class=\"col col-4\"><label class=\"input\"><input type=\"text\" name=\"oiCusPhone\" placeholder='使用人手机号'></label></div></div></section>";
    }
    $("#"+id).html(html);
}
////////////////////modal/////////////////////////////
//clear order modal
function clearOrderModal(){
    $("#oiPriceId").val("");
    $("#oiSP").val("");
    $("#oiName").html("");
    $("#oiDate").html("");
    $("#oiPrice").html("");
    $("#oiQty").val("1");
    $("#oiCus").html("");
    $("#oiRemark").val("");
    $("#oiTotal").html("");
}

///////////////////page////////////////////////
//clear order form for type 3
function clearOrderForm(){
    $("#oi3PriceId").val("");
    $("#oi3SP").val("");
    $("#oi3Price").html("");
    $("#oi3Qty").val("1");
    $("#oi3Cus").html("");
    $("#oi3Remark").val("");
    $("#oi3Total").html("");
}
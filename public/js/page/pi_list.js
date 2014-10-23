//下拉框格式化和选择事件
function formatSelect2(e){
    selectedPdt = e.id;
    var d = $(e.element);
    $("#pilRow").show();
    selectPdtType = d.data('type');
    if(0==selectPdtType){
        $("#pii0").show();
        $("#exTime").show();
        $("#pii3").hide();
        var st = new Date(d.data('std'));
        var ed = new Date(d.data('edd'));
        $("#piiStDate").datepicker("option", "minDate", st);
        $("#piiStDate").datepicker("option", "maxDate", ed);
        $("#piiStDate").datepicker('setDate',st);
        $("#piiEndDate").datepicker("option", "minDate", st);
        $("#piiEndDate").datepicker("option", "maxDate", ed);
        $("#piiEndDate").datepicker('setDate',ed);
        initCal();
    }else if(3==selectPdtType){
        $("#pii0").hide();
        $("#exTime").hide();
        $("#pii3").show();
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
                    showMessage("danger","获取数据失败！"+data.errorMsg);
                }else{
                    $("#piuId").val(data.data._id);
                   $("#pilPrc").val(data.data.price);
                    $("#pilIvty").val(data.data.inventory);
                }
            }).fail(function(){
                alert("网络异常，请重试！");
            });
        }
    }
    return e.text;
}

//init calendar
function initCal(){
    $('#myCal').fullCalendar('destroy');
    $("#myCal").fullCalendar({
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
            clearPIUModal();
            $("#piuId").val(calEvent.id);
            var  pName = $("#piiPName").select2("data");
            $("#piuName").html(pName.text);
            $("#piuDate").html(calEvent.start.format("yyyy-MM-dd"));
            var titles = calEvent.title.split("/");
            var descs = calEvent.description.split("/");
            for(var i  in titles){
                if(titles[i]==="价格"){
                    $("#piuPrice").val(descs[i]);
                }else if(titles[i]==="库存"){
                    $("#piuInventory").val(descs[i]);
                }
            }
            $("#piModal").modal();
//            event.backgroundColor = "blue";
//            $('#myCal').fullCalendar('updateEvent', event);

        },
        events: function(start, end, callback) {
            if(selectedPdt&&selectedPdt.trim()!==""){
                var params = {};
                params.product = selectedPdt;
                params.startDate = $("#piiStDate").val();
                params.endDate = $("#piiEndDate").val();
                $.ajax({
                    type: "POST",
                    url: "/pi/list",
                    cache:false,
                    data:params
                }).done(function(data, textStatus){
                    if(data.error!=0){
                        showMessage("danger","获取数据失败！"+data.errorMsg);
                    }else{
                        callback(data.data);
                    }
                }).fail(function(){
                    alert("网络异常，请重试！");
                });
            }
        },
        windowResize: function (event, ui) {
            $('#myCal').fullCalendar('render');
        }
    });
}

//clear modal
function clearPIUModal(){
    $("#piuId").val("");
    $("#piuName").val("");
    $("#piuDate").val("");
    $("#piuPrice").val("");
    $("#piuInventory").val("");
    $("#pilPrc").val("");
    $("#pilInvty").val("");
}

//update ajax
function updateData(params){
    $.ajax({
        type: "POST",
        url: "/pi/update/"+$("#piuId").val(),
        cache:false,
        data:params
    }).done(function(data, textStatus){
        if(data.error!=0){
            showMessage("danger","修改价格失败！"+data.errorMsg);
        }else{
            $("#myCal").fullCalendar('refetchEvents');
            showMessage("success","修改价格成功！");
        }
        $("#piModal").modal('hide');
    }).fail(function(){
        alert("网络异常，请重试！");
    });
}
//下拉框格式化和选择事件
function formatSelect2(e) {
    selectedPdt = e.id;
    var d = $(e.element);
    $("#pilRow").show();
    selectPdtType = d.data('type');
    if (0 == selectPdtType) {
        $("#pil0").show();
        $("#exTime").show();
        $("#pil3").hide();
        var st = new Date(d.data('std'));
        var ed = new Date(d.data('edd'));
        $("#piiStDate").datepicker("option", "minDate", st);
        $("#piiStDate").datepicker("option", "maxDate", ed);
        $("#piiStDate").datepicker('setDate', st);
        $("#piiEndDate").datepicker("option", "minDate", st);
        $("#piiEndDate").datepicker("option", "maxDate", ed);
        $("#piiEndDate").datepicker('setDate', ed);
        initCal();
    } else if (3 == selectPdtType) {
        $("#pil3Specs").html("");
        //get products spec
        $("#ldModal").modal({
            backdrop: false,
            keyboard: false
        });
        $.ajax({
            type: "GET",
            url: "/pi/specList/" + selectedPdt,
            cache: false
        }).done(function (data, textStatus) {
            var h = "";
            if(data.specs.length>0){
                for (var e in data.specs) {
                    var obj = data.specs[e];
                    if(obj.spec){
                        generatePriceList3Chunk("pil3Specs", obj, true);
                    }else{
                        obj.spec = {};
                        obj.spec._id = new Date().getTime();
                        generatePriceList3Chunk("pil3Specs", obj, false);
                    }
                }
            }else{
                var obj = {};
                obj.spec = {};
                obj.spec._id = new Date().getTime();
                generatePriceList3Chunk("pil3Specs", obj, false);
            }
            $("#ldModal").modal("hide");
        }).fail(function () {
            $("#ldModal").modal("hide");
            alert("网络异常，请重试！");
        });
        $("#pil0").hide();
        $("#exTime").hide();
        $("#pil3").show();
    }
    return e.text;
}

//init calendar
function initCal() {
    $('#myCal').fullCalendar('destroy');
    $("#myCal").fullCalendar({
        aspectRatio: 3,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: ''
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
        allDay: true,
//        dayClick: function (date, allDay, jsEvent, view) {
//        },
        eventRender: function (event, element) {
            element.find('.fc-event-title').append("<br/><span class='ultra-light'>" + event.description +
                "</span>").css("cursor", "pointer");
        },
        eventClick: function (calEvent, jsEvent, view) {
            clearPIUModal();
            $("#piuId").val(calEvent.id);
            var pName = $("#piiPName").select2("data");
            $("#piuName").html(pName.text);
            $("#piuDate").html(calEvent.start.format("yyyy-MM-dd"));
            var titles = calEvent.title.split("/");
            var descs = calEvent.description.split("/");
            for (var i  in titles) {
                if (titles[i] === "成本价") {
                    $("#piuBasePrice").val(descs[i]);
                } else if (titles[i] === "结算价") {
                    $("#piuTradePrice").val(descs[i]);
                } else if (titles[i] === "卖价") {
                    $("#piuPrice").val(descs[i]);
                } else if (titles[i] === "库存") {
                    $("#piuInventory").val(descs[i]);
                }
            }
            $("#piModal").modal();
//            event.backgroundColor = "blue";
//            $('#myCal').fullCalendar('updateEvent', event);

        },
        events: function (start, end, callback) {
            if (selectedPdt && selectedPdt.trim() !== "") {
                var params = {};
                params.product = selectedPdt;
                params.startDate = $("#piiStDate").val();
                params.endDate = $("#piiEndDate").val();
                $.ajax({
                    type: "POST",
                    url: "/pi/list",
                    cache: false,
                    data: params
                }).done(function (data, textStatus) {
                    if (data.error != 0) {
                        showMessage("error", "获取数据失败！" + data.errorMsg);
                    } else {
                        callback(data.data);
                    }
                }).fail(function () {
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
function clearPIUModal() {
    $("#piuId").val("");
    $("#piuName").val("");
    $("#piuDate").val("");
    $("#piuBasePrice").val("");
    $("#piuTradePrice").val("");
    $("#piuPrice").val("");
    $("#piuInventory").val("");
}

function generatePriceList3Chunk(cavId, object, isSpec) {
    //规格名和ID
    var html = "";
    if(isSpec){
        html += "<section><div class=\"row\"><label class=\"label col col-2\">规格</label>";
        html += "<label class=\"label col col-10\">"+object.spec.name+"</label></div></section>";
    }

    //成本价输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">成本价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" id=\"pilBasePrc_" + object.spec._id + "\" placeholder=\"请输入成本价\" value=" + (object.basePrice?object.basePrice:"") + ">";
    html += "</label></div></div></section>";
    //结算价输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">结算价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" id=\"pilTradePrc_" + object.spec._id + "\" placeholder=\"请输入结算价\" value=" + (object.tradePrice?object.tradePrice:"") + ">";
    html += "</label></div></div></section>";
    //卖价输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">卖价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" id=\"pilPrc_" + object.spec._id + "\" placeholder=\"请输入卖价\" value=" + (object.price?object.price:"") + ">";
    html += "</label></div></div></section>";
    //库存输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">库存</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" id=\"pilIvty_" + object.spec._id + "\" placeholder=\"请输入库存\" value=" + (object.inventory?object.inventory:"") + ">";
    html += "</label></div></div></section>";
    //保存按钮
    html += "<section><div class=\"row\">";
    html += "<div class=\"col col-3\"><label class=\"input\"><input type=\"button\" class=\"btn btn-primary\" id=\"btnUpdate_" + object.spec._id + "\" value=\"更新"+(isSpec?"规格-"+object.spec.name:"")+"数据\">";
    html += "</label></div></div></section>";
    $("#" + cavId).append(html);
    $("#btnUpdate_" + object.spec._id).bind("click", function (e) {
        e.preventDefault();
        var flag = true;
        var params = {};
        params.product = selectedPdt;
        params.pType = selectPdtType;
        if(isSpec){
            params.specId = object.spec._id;
        }
        var base = $("#pilBasePrc_" + object.spec._id).val();
        var trade = $("#pilTradePrc_" + object.spec._id).val();
        var price = $("#pilPrc_" + object.spec._id).val();
        var inventory = $("#pilIvty_" + object.spec._id).val();
        if (base === "" || isNaN(base)) {
            alert("请输入有效的成本价格！");
            flag = false;
        }
        if (trade === "" || isNaN(trade)) {
            alert("请输入有效的结算价格！");
            flag = false;
        }
        if (price === "" || isNaN(price)) {
            alert("请输入有效的卖格！");
            flag = false;
        }
        if (inventory === "" || isNaN(inventory)) {
            alert("请输入有效的库存！");
            flag = false;
        }
        if (flag) {
            params.basePrice = base;
            params.tradePrice = trade;
            params.price = price;
            params.inventory = inventory;
        } else {
            return false;
        }

        $("#ldModal").modal({
            backdrop: false,
            keyboard: false
        });
        $.ajax({
            type: "POST",
            url: "/pi/add",
            cache: false,
            data: params
        }).done(function (data, textStatus) {
            if (data.error != 0) {
                showMessage("error", "数据修改失败！" + data.errorMsg);
            } else {
                showMessage("success", "数据修改成功！");
            }
            $("#ldModal").modal("hide");
        }).fail(function () {
            $("#ldModal").modal("hide");
            alert("网络异常，请重试！");
        });
    });
}
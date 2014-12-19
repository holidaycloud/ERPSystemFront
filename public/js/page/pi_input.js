//下拉框格式化和选择事件
function formatSelect2(e) {
    selectedPdt = e.id;
    var d = $(e.element);
    selectPdtType = d.data('type');
    if (0 == selectPdtType) {
        $("#pii0").show();
        $("#pii3").hide();
        var st = new Date(d.data('std'));
        var ed = new Date(d.data('edd'));
        $("#piiStDate").datepicker("option", "minDate", st);
        $("#piiStDate").datepicker("option", "maxDate", ed);
        $("#piiStDate").datepicker('setDate', st);
        $("#piiEndDate").datepicker("option", "minDate", st);
        $("#piiEndDate").datepicker("option", "maxDate", ed);
        $("#piiEndDate").datepicker('setDate', ed);
    } else if (3 == selectPdtType) {
        $("#pii3").html("");
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
            for (var e in data.data) {
                var obj = data.data[e];
                generatePriceInput3Chunk("pii3", obj);
            }
            $("#ldModal").modal("hide");
        }).fail(function () {
            $("#ldModal").modal("hide");
            alert("网络异常，请重试！");
        });

        $("#pii0").hide();
        $("#pii3").show();
    }
    return e.text;
}

function generatePriceInput3Chunk(cavId, object) {
    //规格名和ID
    var html = "<section><div class=\"row\"><label class=\"label col col-12\">规格名-" + object.name + "</label>";
    html += "<input type=\"hidden\" name=\"specId\" value=\"" + object._id + "\"/></div></section>";
    //成本价输入块
    html += "<section><div class=\"row\"><label class=\"label col col-2\">成本价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" name=\"piiBasePrc_" + object._id + "\" placeholder=\"请输入成本价\">";
    html += "</label></div></div></section>";
    //结算价输入块
    var html = "<section><div class=\"row\"><label class=\"label col col-2\">结算价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" name=\"piiTradePrc_" + object._id + "\" placeholder=\"请输入结算价\">";
    html += "</label></div></div></section>";
    //卖价输入块
    var html = "<section><div class=\"row\"><label class=\"label col col-2\">卖价</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" name=\"piiPrc_" + object._id + "\" placeholder=\"请输入卖价\">";
    html += "</label></div></div></section>";
    //库存输入块
    var html = "<section><div class=\"row\"><label class=\"label col col-2\">库存</label>";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"text\" name=\"piiIvty_" + object._id + "\" placeholder=\"请输入库存\">";
    html += "</label></div></div></section>";
    //保存按钮
    var html = "<section><div class=\"row\">";
    html += "<div class=\"col col-10\"><label class=\"input\"><input type=\"button\" id=\"btnSave_" + object._id + "\" value=\"保存\">";
    html += "</label></div></div></section>";
    $("#" + cavId).append(html);
    $("#btnSave_" + object._id).bind("click", function (e) {
        e.preventDefault();
        if (!selectedPdt || selectedPdt.trim() === "") {
            alert("请选择需要录入价格库存的产品！");
            return false;
        }
        var params = {};
        params.product = selectedPdt;
        params.pType = selectPdtType;
        //clear params
        var flag = true;
        params.spec = {};
        params.spec.specId = object._id;
            var base = $("#piiBasePrc" + object._id).val();
            var trade = $("#piiTradePrc" + object._id).val();
            var price = $("#piiPrc" + object._id).val();
            var inventory = $("#piiIvty" + object._id).val();
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
                params.spec.basePrice = base;
                params.spec.tradePrice = trade;
                params.spec.price = price;
                params.spec.inventory = inventory;
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
                showMessage("danger", "数据保存失败！" + data.errorMsg);
            } else {
                showMessage("success", "数据保存成功！");
            }
            $("#ldModal").modal("hide");
        }).fail(function () {
            $("#ldModal").modal("hide");
            alert("网络异常，请重试！");
        });
    });
}
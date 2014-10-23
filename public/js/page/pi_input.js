//下拉框格式化和选择事件
function formatSelect2(e){
    selectedPdt = e.id;
    var d = $(e.element);
    selectPdtType = d.data('type');
    if(0==selectPdtType){
        $("#pii0").show();
        $("#pii3").hide();
        var st = new Date(d.data('std'));
        var ed = new Date(d.data('edd'));
        $("#piiStDate").datepicker("option", "minDate", st);
        $("#piiStDate").datepicker("option", "maxDate", ed);
        $("#piiStDate").datepicker('setDate',st);
        $("#piiEndDate").datepicker("option", "minDate", st);
        $("#piiEndDate").datepicker("option", "maxDate", ed);
        $("#piiEndDate").datepicker('setDate',ed);
    }else if(3==selectPdtType){
        $("#pii0").hide();
        $("#pii3").show();
    }
    return e.text;
}
/**
 * Created by bjj on 2015/1/15.
 */
//获取报表的数据
function getReportData(start,end){

    $("#ldModal").modal({
        backdrop:false,
        keyboard:false
    });
    //get products spec
    $.ajax({
        type: "POST",
        url: "/report/entOrders",
        cache:false,
        data:{startDate:start,endDate:end}
    }).done(function(data, textStatus){
        if(data.error == 0){
            charts.setTitle(null, { text: start + "至" + end});

            if (charts.series.length) {
                var length = charts.series.length;
                for(var i=0; i<length; i++){
                    charts.series[0].remove();
                }
            }

            //generate data
            var tmp = {};
            tmp.ents = [];
            tmp.all = [];
            tmp.pay = [];
            tmp.fin = [];
            for(var i=0;i<data.data.ents.length;i++){
                var e = data.data.ent[i];
                tmp.ents.push(e.name);
                tmp.all.push(data.data.e._id.all);
                tmp.pay.push(data.data.e._id.pay);
                tmp.fin.push(data.data.e._id.fin);
            }

            //set data for charts
            charts.xAxis[0].setCategories(tmp.ents);
            charts.addSeries({
                name: '全部',
                data: tmp.all
            });
            charts.addSeries({
                name: '已付款',
                data: tmp.pay
            });
            charts.addSeries({
                name: '已完成',
                data: tmp.fin
            });
        }else{
            showMessage('error',"报表数据获取失败！"+data.errorMsg);
        }
        $("#ldModal").modal("hide");
    }).fail(function(){
        $("#ldModal").modal("hide");
        alert("网络异常，请重试！");
    });
};
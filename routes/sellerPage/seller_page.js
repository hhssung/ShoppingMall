var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var moment = require('moment');

//sellerpage 메인화면ㅇ
router.get('/', function(req, res){
  var id = req.cookies.SID; // 판매자 쿠키 받아오기

  connection.query("SELECT * FROM Item i, Seller s WHERE i.i_status = 1 and i.ISID = s.SID and s.SID = ?",[id], function(err, row){
   //if(err) throw err;
   var item_name = new Array();
   var period = new Array();
   var price = new Array();
   var item_number = new Array();
   var sale1 = new Array();
   var sale2 = new Array();
   var max_sale = new Array();
   var disc_num1 = new Array();
   var disc_num2 = new Array();
   var disc_num3 = new Array();
   var cur_sale = new Array();
   var EndDate = new Array();
   var newDate = moment();
   var is_avail = new Array();
   var sale_flag = new Array();
   //판매하고 있는 물건이 없는 경우 오류 발생했었음.
   /*
   if(row.length>0)
   {
   var seller_name = row[0]['s_name'];
   var seller_company = row[0]['CompanyID'];
   var seller_point = row[0]['Point'];
   }
   */
   if(undefined !== row && row.length) // 아무 자료도 없을 때 읽어오는 것 방지
   {
   for(var i = 0; i < row.length; i++)
   {
     EndDate = moment(row[i]['EndDate'], 'YYYY-MM-DD HH:mm');
     var diffTime = {
       day: moment.duration(EndDate.diff(newDate)).days(),
       hour: moment.duration(EndDate.diff(newDate)).hours(),
       minute: moment.duration(EndDate.diff(newDate)).minutes()
     };
     console.log(row);
     period[i] = diffTime.day + '일 ' + diffTime.hour + '시간 ' + diffTime.minute + '분' //res 5, 남은 날짜 출력
     item_name[i] = row[i]['i_name'];
     price[i] = row[i]['cur_price'];
     item_number[i] = row[i]['cur_total'];
     sale1[i] = row[i]['Discount1'];
     sale2[i] = row[i]['Discount2'];
     max_sale[i] = row[i]['Discount3'];
     disc_num1[i] = row[i]['Disc_num1'];
     disc_num2[i] = row[i]['Disc_num2'];
     disc_num3[i] = row[i]['Disc_num3'];
     is_avail[i] = row[i]['is_Available'];
     sale_flag[i] = item_number[i] - is_avail[i];


     if(sale_flag[i] < disc_num1[i]){

       cur_sale[i] = price[i];
     }
     else if((sale_flag[i] >= disc_num1[i]) && sale_flag[i] < disc_num2[i]){
       cur_sale[i] = sale1[i];
     }
     else if(sale_flag[i] >= disc_num2[i] && sale_flag[i] < disc_num3[i]){
       cur_sale[i] = sale2[i];
     }
     else{
       cur_sale[i] = max_sale[i];
     }
   }
 }
   connection.query("select * from Seller where SID=?",[id],function(err,row){
     var seller_name = row[0]['s_name'];
     var seller_company = row[0]['CompanyID'];
     var seller_point = row[0]['Point'];
     //드디어 쿼리 쏴줌
     return res.render("sellerPageHTML/seller_page",{
       item_name: item_name,
       period: period,
       item_number: item_number,
       price: price,
       sale1: sale1,
       sale2: sale2,
       max_sale: max_sale,
       length: i,
       sale_flag: sale_flag,
       seller_name: seller_name,
       seller_company: seller_company,
       seller_point: seller_point,
       cur_sale: cur_sale
      });
   })
  })

})

module.exports = router;

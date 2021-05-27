
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const request = require("request");
const app=express();

var states;
var selectedstate;
var confirmed;
var recovered;
var deaths;
//var selectedDis;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.get("/select-state",function(req,res)
{
  var url="https://api.covid19india.org/data.json";
  request.get(url,function(error,response,body){
    states =JSON.parse(body);

    res.render("selectstate",{states:states});

  }

)}
)

app.get("/district-details",function(req,res){
  var url="https://api.covid19india.org/state_district_wise.json";
  request.get(url,function(error,response,body){
    district=JSON.parse(body);
    var xurl="https://api.covid19india.org/data.json";
    request.get(xurl,function(error,response,body){
      states =JSON.parse(body);

      res.render("selectstate",{states:states});

    }

  )
    for(var i=0;i<states.statewise.length;i++) {
      if(states.statewise[i].state==selectedstate) {
      //  console.log(states.statewise[i].state);
        confirmed=states.statewise[i].confirmed;
        recovered=states.statewise[i].recovered;
        deaths=states.statewise[i].deaths;
        break;
      }
    }
     res.render("district",{dis:district[selectedstate] , districtNames:( Object.keys(district[selectedstate].districtData) ) , currentstate : selectedstate , confirmed:confirmed , deaths:deaths , recovered:recovered } );
    console.log(confirmed)

  })
})

app.get("/country",function(req,res) {
  var url3="https://api.covid19api.com/summary";
  request.get(url3,function(error,response,body) {
    country=JSON.parse(body);
    // console.log(country.Global.TotalConfirmed);
    res.render("country",{countries:country});
    // res.render("state",{states:states});
  })
})







app.post("/",function(req,res){
  var btn=req.body.btn;
  if(btn==="state")
    res.redirect("/select-state");
  else 
    res.redirect("/country");

})

app.post("/selectstate",function(req,res){
  selectedstate=req.body.statepick;
//  console.log(selectedstate);
  res.redirect("/district-details");
})

// app.post("/districts",function(req,res){
//   selectedDis=req.body.districtpick;
// // res.render("district",{selectedDis:selectedDis , dis:district[selectedstate]});
// //   console.log(selectedDis);
// res.redirect("/district-details");
// })





app.listen(3000, function() {
  console.log("Server running at port 3000");

})

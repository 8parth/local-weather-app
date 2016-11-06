$(document).ready(function() {
  var CLEAR_WEATHER = [800];
  var CLOUD_WEATHER = [801, 802, 803, 804];
  var DRIZZLE = ["3xx"];
  var RAIN = ["5xx"];
  var SNOW = ["6xx"];
  enableErrorBlock();
  var loc = getLocation();
  $("#convert").on("click", function(){
    if ($("#convert").hasClass("convert-f")){
      convertToF();
    } else {
      convertToC();
    }
  });
});

function convertToF(){
  var new_val = convertTo($(".weather-temp").text(), "Fahrenheit");
  $("#convert").removeClass();
  $("#convert").addClass("convert-c btn btn-success");
  $(".weather-unit").text("Fahrenheit");
  $(".weather-temp").text(new_val);
}
function convertToC(){
  var new_val = convertTo($(".weather-temp").text(), "Celcius");
  $("#convert").removeClass();
  $("#convert").addClass("convert-f btn btn-success");
  $(".weather-unit").text("Celcius");
  $(".weather-temp").text(new_val);
}
function getLocation() {
    var x = navigator.geolocation;  
    if (x) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    } else { 
      $(".weather-city").html("Please share location with application.");
    }
}

function showWeather(loc){
  // -0.13, 51.51
  var lattitude=loc.coords.latitude;
  var longitude=loc.coords.longitude;
  var API_KEY="21c4f50af85f2987b324dd1cb61b49cb"; 
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?lat=" +lattitude +"&lon=" + longitude +"&units=metric&APPID=" +API_KEY,
    type: "GET",
    data: {},
    headers: {},
    dataType: 'json',
    stausCode:{
      200: function(){
              console.log("code 200");
            }
    },
    success:function(data, code){
      enableSuccessBlock();
      weather_array = data["weather"];
      $(".weather-text").html(weather_array["0"]["main"]);
      $(".weather-city").html(data.name+", " +data.sys.country);
      
      $(".weather-temp").text(getTemperature(data.main.temp, "none"));
      $(".weather-unit").text("Celcius");
      manageIcon(weather_array["0"]["id"]);
    },
    error:function(){
      console.log("ajax request error. Check Network connection.");
      enableErrorBlock();
    }
  });
}

function showError(error){
  enableErrorBlock();
  switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}

function getTemperature(temp,type){
  return parseInt(temp).toFixed();
}

function convertTo(temp, type){
  var final = "";
  if(type.toLowerCase() === "celcius"){
    // f2c
    var temp_f = parseFloat(temp);
    final = (temp_f - 32) * (5/9);
    final = final.toFixed();
  } else if (type.toLowerCase() == "fahrenheit") {
    // c2f
    var temp_c = parseInt(temp);
    final = (temp_c * 1.8) + 32;
  } else {
    final = temp;
  }
  return final;
}

function manageIcon(weather_code){
  var sun = false;
  var cloud = false;
  var rain = false;
  var ice = false;
  var thunder = false;
  first_char = weather_code.toString().charAt(0);
  // setupIcon(sun, cloud, rain, ice, thunder);
  code = parseInt(weather_code);
  
  code_starts_with = parseInt(first_char);
  
  if(code === 800){
    sun = true;
    console.log("clear weather, code: " +code);
  } else if(code_starts_with === 8){
    cloud = true;
    console.log("cloudy weather, code: " +code);
  } else if(code_starts_with === 3){
    sun  = true;
    cloud = true;
    rain = true;
    console.log("drizzle weather, code: " +code);
  } else if(code_starts_with === 5){
    cloud = true;
    rain = true;
    console.log("rainy weather, code: " +code);
  } else if(code_starts_with === 6){
    cloud = true;
    ice = true;
    console.log("icy weather, code: " +code);
  } else if(code_starts_with === 7){
    sun = true;
    cloud = true;
    console.log("atmosphere, code: " +code);
  }else{
    sun = true;
    cloud = true;
    console.log("something else, code: " +code);
  }
  // clear - only sun
  // cloudy - clouds
  // rainy - clouds + rain - 5
  // icy - clouds + ice - 6
  // foggy - just clouds
  // thunder storm - cloud + thunder
  // drizzle - light rain - sun + cloud + rain-  3
  setupIcon(sun, cloud, rain, ice, thunder);
}

function setupIcon(sun, cloud, rain, ice, thunder){
  if(sun){
    $("#sun_target").removeClass("set_icon");
  }else{
    $("#sun_target").addClass("set_icon");
  }
  
  if(cloud){
    $("#cloud_target").removeClass("set_icon");
  }else{
    $("#cloud_target").addClass("set_icon");
  }
  
  if(rain){
    $("#rain_target").removeClass("set_icon");
  }else{
    $("#rain_target").addClass("set_icon");
  }
  
  if(ice){
    $("#snow_target").removeClass("set_icon");
  }else{
    $("#snow_target").addClass("set_icon");
  }
  
  if(thunder){
    $("#lightning_target").removeClass("set_icon");
  }else{
    $("#lightning_target").addClass("set_icon");
  }
}

function enableErrorBlock(){
  if(!$("#icon_block").hasClass("set_icon")){
    $("#icon_block").addClass("set_icon");
  }
  
  if(!$("#data_block").hasClass("set_icon")){
    $("#data_block").addClass("set_icon");
  }
  
  if($("#error_block").hasClass("set_icon")){
    $("#error_block").removeClass("set_icon");
  }
}

function enableSuccessBlock(){
  if(!$("#error_block").hasClass("set_icon")){
    $("#error_block").addClass("set_icon");
  }
  if($("#icon_block").hasClass("set_icon")){
    $("#icon_block").removeClass("set_icon");
  }
  if($("#data_block").hasClass("set_icon")){
    $("#data_block").removeClass("set_icon");
  }
}
window.onload =  start;
function start() {
    fetch("https://developers.zomato.com/api/v2.1/categories", {
    headers: {
      Accept: "application/json",
      "User-Key": "4701b3ea37bfbfbeb28b342db5b8ff06"
    }
  })
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    let mycards = "";
    mycards += '<div class="category-cards">'
    let categories = json.categories;
    for (let i = 0; i < json.categories.length; i++) {
      let thisCate = json.categories[i].categories;

      mycards += '<a class="mycard card" href="#" onclick="sort('+ "'" + thisCate.id + "'" + ')">';
      mycards += '<img class="card-img-top" src="/images/' + thisCate.id + '.jpg" alt="Card image">';
      mycards += '<div class="card-img-overlay">';
      mycards += '<h4 align="center" class="card-title">' + thisCate.name + '</h4>';
      mycards += '</div></a>';
    }
    mycards += '</div>';

    document.getElementById("main-wrapper").innerHTML = mycards;

  });
};

function sort(category) {
  const state = document.getElementById("state").value;
  const city = document.getElementById("city").value;
  let url = "https://developers.zomato.com/api/v2.1/";
  let place = "";
  if (state !== "") {
    place += state;
    if (city !== "") {
      place += " " + city;
    }
  }
  else {
    if (city !== "") {
    place += city;
  }
  }
  let city_id = "";
  let id = "";
  if (place !== "") {

    place = encodeURIComponent(place);


    fetch("https://developers.zomato.com/api/v2.1/cities?q=" + place, {
         headers: {
           Accept: "application/json", "user-key": "4701b3ea37bfbfbeb28b342db5b8ff06"
         }
       })
       .then(function(response) {
         return response.json();
       }).then(function(json) {


          city_id = "entity_id=" + json.location_suggestions[0].id + "&entity_type=city&";

          id = json.location_suggestions[0].id;
          return id;
       })
       .then(function(c_id) {

         fetch("https://developers.zomato.com/api/v2.1/search?entity_id="+ c_id + "&entity_type=city&q=" + place + "&category=" + category + "&sort=rating&order=desc", {
              headers: {
                Accept: "application/json", "user-key": "4701b3ea37bfbfbeb28b342db5b8ff06"
              }
            })
            .then(function(response) {
              return response.json();
            }).then(function(json) {


              let mybody = "";
              mybody += '<div class="myList">';
              for (let i = 0; i < json.restaurants.length; i++) {
                let rest = json.restaurants[i].restaurant;
                let imgsrc = rest.thumb;
                if (imgsrc === "") {
                  imgsrc = "/images/filler.png";
                }
                mybody += '<div class="container py-3">';
                mybody += '<div class="card">';
                mybody += '<div class="row">';
                mybody += '<div class="col-md-4">';
                mybody += '<img src="' + imgsrc +'" class="w-100">';
                mybody += '</div>';
                mybody += '<div class="col-md-8 px-3">';
                mybody += '<div class="card-block px-3">';
                mybody += '<h4 class="card-title">' + rest.name + '</h4>';
                mybody += '<p class="card-text">Cuisines: ' + rest.cuisines + '</p>';
                mybody += '<p class="card-text">Price: ' + rest.currency + ' Rating: ' + rest.user_rating.aggregate_rating + '</p>';
                mybody += '<p class="card-text">' + rest.location.address + '</p>';
                mybody += '<p class="card-text">' + rest.location.city + '</p>';
                mybody += '<a href="' + rest.menu_url + '" class="btn btn-primary">Menu</a>';
                mybody += '</div></div></div></div></div>';



              }
              mybody += '</div>';
              document.getElementById("main-wrapper").innerHTML = mybody;



            });
       });
  }
  else {
    alert("Please enter a state and/or city");
  }
};

document.getElementById("restart").addEventListener("click", start);

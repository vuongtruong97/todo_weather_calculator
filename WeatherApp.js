const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const APIkey = "cc7f414ecbe69376cb05fe6e08a66842";

const address = $(".address");
const currTemp = $(".temp_current");
const currWeather = $(".weather_current");
const pressure = $(".weather_pressure2");
const forecast = $(".weather_forecast2");
const feature = $(".weather_icon");
const windSp = $(".weather_windSpeed");
const visibility = $(".weather_visibility");
const inputCity = $(".city_search");
const searchSubmit = $(".search_submit");

const WeatherApp = {
  searchValue: "",
  firstRrender() {
    this.getWeatherDataWithGeoLocation().then((data) => {
      currTemp.innerHTML = `${Math.round(data.current.temp)}°C`;
      address.innerHTML = "Right Here";
      currWeather.innerHTML = `Độ ẩm ${data.current.humidity}%`;
      pressure.innerHTML = `${data.current.pressure}hPa`;
      forecast.innerHTML = `${data.current.weather[0].description}`;
      feature.innerHTML = `<img src='http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png' />`;
      windSp.innerHTML = `Tốc độ gió: ${data.current.wind_speed}m/s`;
      visibility.innerHTML = `Tầm nhìn xa: ${data.current.visibility / 1000}km`;
    });
  },
  Searchrender(res) {
    currTemp.innerHTML = `${Math.round(res.main.temp)}°C`;
    address.innerHTML = res.name;
    currWeather.innerHTML = `Độ ẩm ${res.main.humidity}%`;
    pressure.innerHTML = `${res.main.pressure}hPa`;
    forecast.innerHTML = res.weather[0].description;
    feature.innerHTML = `<img src='http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png' />`;
    windSp.innerHTML = `Tốc độ gió: ${res.wind.speed}m/s`;
    visibility.innerHTML = `Tầm nhìn xa: ${res.visibility / 1000}km`;
  },
  handleEvents() {
    //when change input search weather
    inputCity.addEventListener("input", (e) => {
      this.searchValue = e.target.value;
    });
    // when click search city weather
    searchSubmit.onclick = () => {
      this.getWeatherInfoFromSearch();
      // if (this.searchValue.length > 1) {
      //   (async () => {
      //     try {
      //       const searchRes = await this.getWeatherInfoFromSearch();
      //       this.Searchrender(searchRes);
      //     } catch (err) {
      //       console.log(err);
      //     }
      //   })();
      // }
    };
  },
  setCurrentCity(i) {
    this.currentCityIndex = i;
  },
  async getWeatherDataWithGeoLocation() {
    try {
      const location = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      return await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=993b45ee4b3939f7e01752c938c35d0b&units=metric&lang=vi`,
        { mode: "cors" }
      ).then((res) => res.json());
    } catch (err) {
      console.log(err);
    }
  },
  async getWeatherInfoFromSearch() {
    try {
      const resData = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.searchValue}&appid=${APIkey}&units=metric&lang=vi`
      ).then((res) => res.json());
      if (this.searchValue.length > 1) {
        this.Searchrender(resData);
      }
    } catch (err) {
      console.log(err);
    }
  },
  play() {
    this.firstRrender();
    this.handleEvents();
  },
};
export default WeatherApp;

import React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import Weather from './Weather';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';

class CitySearch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      cityName: '',
      lat: 0,
      Lon: 0,
      renderLatLon: false,
      map: '',
      renderMap: false,
      renderError: false,
      errorMessage: '',
      weather: [],
      renderWeather: false,
      movies: [],
      renderMovie: false
    }
  }

  handleChange = (e) => {
    this.setState({
      cityName: e.target.value
    })
  }

  getLocation = async (e) => {
    e.preventDefault();
    try {
      let cityLocation = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${this.state.cityName}&format=json`);

      console.log(cityLocation.data[0]);
      this.setState({
        renderLatLon: true,
        //cityName: cityLocation.data[0].display_name,
        lat: cityLocation.data[0].lat,
        lon: cityLocation.data[0].lon,
        renderError: false
      });

      let cityMap = await axios.get(`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&center=${this.state.lat},${this.state.lon}&zoom=12`);
      console.log(cityMap, 'citymap')
      this.setState({
        renderMap: true,
        map: cityMap.config.url
      })

    } catch (error) {
      console.log(error.response)
      this.setState({
        renderError: true,
        errorMessage: `${error.response.status},${error.response.data.error}`,
      })
    }
    this.getweather();
    this.getMovies();
  };

  getweather = async (e) => {
    let weatherResult = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/weather?lat=${this.state.lat}&lon=${this.state.lon}`);
    this.setState({
      weather: weatherResult.data,
      renderWeather: true
    })
  }

  getMovies = async (e) => {
    //let searchQuery = this.state.cityName

    let movieResult = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movie?searchQuery=${this.state.cityName}`)
    console.log(movieResult.data)
    this.setState({
      movies: movieResult.data,
      renderMovie: true
    })
  }


  render() {


    let weatherToRender = this.state.weather.map((weatherByDate, index) => (
      <Weather
        key={index}
        description={weatherByDate.description}
        date={weatherByDate.date}
      />)

    )

    let moviesToRender = this.state.movies.map((video, index) => (
      < Carousel.Item key={index} >
        <img
          className="d-block w-100"
          src={`https://image.tmdb.org/t/p/w300${video.image_url}`}

          alt={video.overview}
        />
        <Carousel.Caption>
          <h3>Title: {video.title}</h3>
          <p> Average votes:{video.average_votes}</p>
          <p>Total votes:{video.total_votes}</p>
          <p>Popurarity :{video.popurality}</p>
          <p>Video Release date{video.released_on}</p>
        </Carousel.Caption>
      </Carousel.Item>

    )
    )
    console.log(this.state)

    return (
      <main>
        <h1>City Explorer</h1>
        <form onSubmit={this.getLocation}>
          <input onChange={this.handleChange} />
          <button> Explore</button>
        </form>
        {this.state.renderLatLon ? <h4>City Name:{this.state.cityName}, lat: {this.state.lat},lon: {this.state.lon}</h4> : ''}
        <CardColumns>
          {this.state.renderWeather ? weatherToRender : ''}
        </CardColumns>
        <Container>
          <Carousel>
            {this.state.renderMovie ? moviesToRender : ""}
          </Carousel>
        </Container>

        {this.state.renderMap ? <Image src={this.state.map} alt={this.state.cityName} rounded /> : ""}

        <Alert>
          {this.state.renderError ? <Alert.Heading>{this.state.errorMessage}</Alert.Heading> : ''}
        </Alert>

      </main >
    )
  }
}

// let new = class

export default CitySearch;

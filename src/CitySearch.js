import React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';

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
        cityName: cityLocation.data[0].display_name,
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
  }

  render() {

    return (
      <main>
        <h1>City Explorer</h1>
        <form onSubmit={this.getLocation}>
          <input onChange={this.handleChange} />
          <button> Explore</button>
        </form>
        {this.state.renderLatLon ? <h4>City Name:{this.state.cityName}, lat: {this.state.lat},lon: {this.state.lon}</h4> : ''}
        {this.state.renderMap ? <Image src={this.state.map} alt={this.state.cityName} rounded /> : ""}

        <Alert>
          {this.state.renderError ? <Alert.Heading>{this.state.errorMessage}</Alert.Heading> : ''}
        </Alert>

      </main>
    )
  }
}


export default CitySearch;

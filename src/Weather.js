import React from 'react'
import Card from 'react-bootstrap/Card';


class Weather extends React.Component {
  render() {
    return (
      <>
        <Card>
          <Card.Text>{this.props.date}</Card.Text>
          <Card.Body>{this.props.description}</Card.Body>
        </Card>
      </>
    )
  }
}

export default Weather;

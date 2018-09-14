import React, { Component } from 'react';
import './App.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [{
        data: [1, 2, 3]
      }, {
        data: [4, 5, 6]
      }]
    };
    this.getDay = this.getDay.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
  }

  getDay(date) {
    return axios.get('https://api.iextrading.com/1.0/stck/aoapl/chart/date/'+date);
  }

  makeRequest() {
    axios.get('https://api.iextrading.com/1.0/stock/aapl/chart/1m')
      .then(function(response) {
        return axios.all(response.data.map(
          function(item) {
            let date = item.date.split('-').join('');
            return axios('https://api.iextrading.com/1.0/stock/aapl/chart/date/'+date);
          }
        ));
      })
      .then(function(response) {
        return response.map(function(day) {
          return {data: day.data.map(function(tick) {
            return tick.average
          })};
        });
      })
      .then((data) => {
        console.log(data);
        this.setState({data});
      });    
  }

  render() {
    const options = {
      title: {
        text: 'My chart'
      },
      series: this.state.data
    }

    return (
      <div className="App">
        <button onClick={this.makeRequest}>Go</button>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={options}
        />

      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import Header from './components/Head/Head';
import SearchBar from './components/SearchBar/SearchBar';
import DataDisplay from './components/Data/Data';

const API = 'http://20.244.56.144';

class App extends Component {
  constructor(props) {
    super(props);
    
  
  };

  componentDidMount() {
    this.fetchAll();
  }

  handleInputChange = selectedStation => {
    this.setState({ selectedStation });
    this.filterData(selectedStation);
  };

  fetchAll() {
    const dateNow = new Date().toISOString().slice(0, 10);
    Promise.all([
      fetch(`${API}metadata/stations`).then(response => response.json()),
      fetch(`${API}trains/${dateNow}`).then(response => response.json())
    ]).then(
      allResponses => {
        const stations = allResponses[0].map(station => ({
          value: station.stationShortCode,
          label: station.stationName.includes(' asema')
            ? station.stationName.slice(0, -6)
            : station.stationName
        }));
        const passengerStations = allResponses[0]
          .filter(station => station.passengerTraffic === true)
          .map(station => ({
            value: station.stationShortCode,
            label: station.stationName.includes(' asema')
              ? station.stationName.slice(0, -6)
              : station.stationName
          }));
        const todaysTrains = allResponses[1];
        this.setState({ stations, passengerStations, todaysTrains });
      },
      error => {
        this.setState({ error });
      }
    );
  }

  filterData(selectedStation) {
    const { todaysTrains, stations } = this.state;
    const dateTimeNow = new Date().toJSON();
    const filteredData = todaysTrains
      .map(train => {
        const trainNumber = train.commuterLineID
          ? `Commuter train ${train.commuterLineID}`
          : `${train.trainType} ${train.trainNumber}`;
        const originShortCode = train.timeTableRows[0].stationShortCode;
        const origin = stations.find(
          station => station.value === originShortCode
        ).label; // retrieves the full name of station by short code
        const destinationShortCode =
          train.timeTableRows[train.timeTableRows.length - 1][
          'stationShortCode'
          ];
        const destination = stations.find(
          station => station.value === destinationShortCode
        ).label;

        let scheduledArrivalTime; // arrivals
        let actualArrivalTime;
        const arrivalTimeTable = {
          ...train.timeTableRows.filter(
            element =>
              element.stationShortCode === selectedStation.value &&
              element.type === 'ARRIVAL'
          )[0]
        };
        if (arrivalTimeTable) {
          if (arrivalTimeTable.hasOwnProperty('scheduledTime')) {
            scheduledArrivalTime = arrivalTimeTable.scheduledTime;
          }
          if (arrivalTimeTable.hasOwnProperty('actualTime')) {
            actualArrivalTime = arrivalTimeTable.actualTime;
          } else if (arrivalTimeTable.hasOwnProperty('liveEstimateTime')) {
            actualArrivalTime = arrivalTimeTable.liveEstimateTime;
          } else {
            actualArrivalTime = false;
          }
        }
        let scheduledDepartureTime; // departures
        let actualDepartureTime;
        const departureTimeTable = {
          ...train.timeTableRows.filter(
            element =>
              element.stationShortCode === selectedStation.value &&
              element.type === 'DEPARTURE'
          )[0]
        };
        if (departureTimeTable) {
          if (departureTimeTable.hasOwnProperty('scheduledTime')) {
            scheduledDepartureTime = departureTimeTable.scheduledTime;
          }
          if (departureTimeTable.hasOwnProperty('actualTime')) {
            actualDepartureTime = departureTimeTable.actualTime;
          } else if (departureTimeTable.hasOwnProperty('liveEstimateTime')) {
            actualDepartureTime = departureTimeTable.liveEstimateTime;
          } else {
            actualDepartureTime = false;
          }
        }

        return {
          ...train,
          trainNumber,
          origin,
          destination,
          scheduledArrivalTime,
          actualArrivalTime,
          scheduledDepartureTime,
          actualDepartureTime
        };
      })

  }
}
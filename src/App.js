import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import './App.css';
import { sortData, prettyPrintStat, prettyPrintStatTotal } from './util';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  //useEffect() runs a piece of code  based on a given condition
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    //The code inside here will run once when the component loads and not again after
    //async -> send a request, wait for it, do something with the info
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country, //United Kingdom, United States, France
          value: country.countryInfo.iso2 //UK, USA, FR
        }));
        setMapCountries(data); 
        let sortedData = sortData(data);
        setCountries(countries);
        setTableData(sortedData);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    // In case of 'Worldwide' use this-> https://disease.sh/v3/covid-19/all
    // In case of specific countries use this -> https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);

      // All of the data from the country response
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };

  console.log("COUNTRY INFO >>> ", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        {/* Title + Select input dropdown field */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* Loop through all the countries and show a dropdown list of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        {/* Infoboxes Line 1*/}
        <div className="app__stats">
          {/* Infobox 1 - title="Coronavirus cases" */}
          <InfoBox
            active={casesType === "cases"}
            activeBorderColorStyle="infoBox--cases--active"
            onClick={(e) => setCasesType('cases')}
            title="Today New Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStatTotal(countryInfo.cases)}
          />

          {/* Infobox 2 - title="Coronavirus recoveries" */}
          <InfoBox
            active={casesType === "recovered"}
            activeBorderColorStyle="infoBox--recovered--active"
            onClick={(e) => setCasesType('recovered')}
            title="Today Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStatTotal(countryInfo.recovered)}
          />

          {/* Infobox 3 - title="Coronavirus deaths" */}
          <InfoBox
            active={casesType === "deaths"}
            activeBorderColorStyle="infoBox--deaths--active"
            onClick={(e) => setCasesType('deaths')}
            title="Today Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStatTotal(countryInfo.deaths)}
          /> 
        </div>

        {/* Infoboxes Line 2*/}
        <div className="app__stats line2">
          {/* Infobox 1 - title="1 test / people" */}
          <InfoBox
            active={casesType === "testsPerOneMillion"}
            activeBorderColorStyle="infoBox--testsPerOneMillion--active"
            onClick={(e) => setCasesType('testsPerOneMillion')}
            title="Tests / 1M people"
            cases={prettyPrintStat(countryInfo.testsPerOneMillion)}
            total={prettyPrintStatTotal(countryInfo.tests)}
          />

          {/* Infobox 2 - title="Active cases" */}
          <InfoBox
            active={casesType === "active"}
            activeBorderColorStyle="infoBox--active--active"
            onClick={(e) => setCasesType('active')}
            title="Active Cases"
            cases={prettyPrintStat(countryInfo.active)}
          />

          {/* Infobox 3 - title="Critical cases" */}
          <InfoBox
            active={casesType === "critical"}
            activeBorderColorStyle="infoBox--critical--active"
            onClick={(e) => setCasesType('critical')}
            title="Critical Cases"
            cases={prettyPrintStat(countryInfo.critical)}
          /> 
        </div>

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          {/* Graph */}
          <h3>NEW CASES in the last 30 days</h3>
          <LineGraph casesType="cases" bgColor="rgb(0, 247, 255, 0.5)" bColor="rgb(0, 247, 255, 1)"/>

          {/* Graph */}
          <h3>RECOVERED in the last 30 days</h3>
          <LineGraph casesType="recovered" bgColor="rgb(51, 255, 5, 0.5)" bColor="rgb(51, 255, 5, 1)"/>

          {/* Graph */}
          <h3>DEATHS in the last 30 days</h3>
          <LineGraph casesType="deaths" bgColor="rgb(255, 97, 4, 0.5)" bColor="rgb(255, 97, 4, 1)"/>

          {/* Table */}
          <h3>Live Cases by country</h3>
          <Table countries={tableData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
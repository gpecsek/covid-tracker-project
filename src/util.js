import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

// dictionary
const casesTypeColors = {
    cases: {
        hex: "#00f7ff",
        multiplier: 800,
    },
    recovered: {
        hex: "#33ff05",
        multiplier: 1200,
    },
    deaths: {
        hex: "#FF6104",
        multiplier: 2000,
    },
    testsPerOneMillion: {
        hex: "#CC1034",
        multiplier: 400,
      },
      active: {
        hex: "#7dd71d",
        multiplier: 800,
      },
      critical: {
        hex: "#fb4443",
        multiplier: 8000,
      },
  };

export const sortData = (data) => {
    let sortedData = [...data];

    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    });
    return sortedData;

    // This returns with the same result as the above sortedData.sort..... part
    // return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const prettyPrintStat = (stat) =>
    stat ? `+${numeral(stat).format("0,0")}` : "+0";

export const prettyPrintStatTotal = (stat) =>
    stat ? `${numeral(stat).format("0,0")}` : "0";

// DRAW circles on the map with interactive tooltips
export const showDataOnMap = (data, casesType = "cases") => 
    data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillcolor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }} />
                    <div className="info-name">{country.country}</div>
                    <div className="info-population">Population:<strong> {numeral(country.population).format("0,0")}</strong></div>
                    <div className="info-confirmed">Cases:<strong> {numeral(country.cases).format("0,0")}</strong></div>
                    <div className="info-recovered">Recovered:<strong> {numeral(country.recovered).format("0,0")}</strong></div>
                    <div className="info-deaths">Deaths:<strong> {numeral(country.deaths).format("0,0")}</strong></div>
                </div>
            </Popup>
        </Circle>
    )
);
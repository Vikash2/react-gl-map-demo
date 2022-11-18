import React from "react";
import ReactDOM from "react-dom";
import InteractiveMap, { Marker } from "react-map-gl";

import { IoLocationSharp } from 'react-icons/io5'

/**
 * Note you have to pass a child to <Marker />
 * as it just places an element at the correct
 * position.
 */

function App() {
  const MAPBOX_TOKEN = "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg";
  const radConstant = Math.PI / 180;
  const radiusEarth = 6371;
  /**
   * Store marker locations in state
   * On click, grab the lngLat from the event
   * and add it to the state.
   */
  const [markers, setMarkers] = React.useState([]);
  const handleClick = ({ lngLat: [longitude, latitude] }) => {
    // The marker is not available within the markers array at this point.
    //
    // What information do we have?
    // The new marker's lattitude and longitude(mighty useful)
    // A list of previously held markers
    //
    // What will help us?
    // We're using planar maps with linear euclidean distances.
    // This then makes our job easy, as we simply need the scale of the map.
    //
    // I believe the intent is to place points sequentially and calculate the total distance?
    console.log(longitude, latitude, markers);// for debug
    let distance = 0;
    if (markers.length > 0) {
      // any dependency on lastMark goes here
      let lastMark = markers[markers.length - 1];

      // using Haversine's instead of Euclidean
      let xlong = (lastMark.longitude - longitude) * radConstant,
        xlat = (lastMark.latitude - latitude) * radConstant;
      let xDist = Math.sin(xlat / 2) ** 2 + Math.cos(radConstant * lastMark.latitude) * Math.cos(radConstant * latitude) * (Math.sin(xlong / 2) ** 2);
      distance = radiusEarth * 2 * Math.atan2(Math.sqrt(xDist), Math.sqrt(1 - xDist));

      console.log(distance);
      distance += lastMark.distance;

      // Approximate test conducted against Google Maps
      // test was done to check distance between :
      // Kempegowda Tower, XH9Q+4H3, Sampangi Rama Nagar, Ambedkar Veedhi, Bengaluru, Karnataka 560001
      // HOPCOMS Cubbon Park Corporation Circle, Cupboard Park, Corporation Cir, Nunegundlapalli, Sampangi Rama Nagara, Bengaluru, Karnataka 560001
    }
    setMarkers(markers => [...markers, { longitude, latitude, distance }]);
  };


  const [viewport, setViewport] = React.useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 14.5,
    pitch: 40,
    bearing: 0
  });

  return (
    <InteractiveMap
      // onClick, capture the pointer event so we can
      // get the lngLat of the click.
      onClick={handleClick}
      width="100vw"
      height="100vh"
      // mapboxApiAccessToken="pk.eyJ1IjoiZ2lzZmVlZGJhY2siLCJhIjoiY2l2eDJndmtjMDFkeTJvcHM4YTNheXZtNyJ9.-HNJNch_WwLIAifPgzW2Ig"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={viewport => setViewport(viewport)}
      {...viewport}
    >
      {markers.length
        ? markers.map((m, i) => (
          <Marker {...m} key={i}>
            <div>
              <span><IoLocationSharp /> </span>
              {i + ' ' + m.distance}
            </div>
          </Marker>
        ))
        : null}
    </InteractiveMap>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

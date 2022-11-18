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


  const MAPBOX_TOKEN =
    "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg";
  /**
   * Store marker locations in state
   * On click, grab the lngLat from the event
   * and add it to the state.
   */
  const [markers, setMarkers] = React.useState([]);
  const handleClick = ({ lngLat: [longitude, latitude] }) =>
    setMarkers(markers => [...markers, { longitude, latitude }]);


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
      // required for interactivity
      width="100vw"
      height="100vh"
      // mapboxApiAccessToken="pk.eyJ1IjoiZ2lzZmVlZGJhY2siLCJhIjoiY2l2eDJndmtjMDFkeTJvcHM4YTNheXZtNyJ9.-HNJNch_WwLIAifPgzW2Ig"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={viewport => setViewport(viewport)}
      {...viewport}
    >
      {markers.length
        ? markers.map((m, i) => (
          // <Marker /> just places its children at the right lat lng.
          <Marker {...m} key={i}>
            <div><span><IoLocationSharp /></span></div>
          </Marker>
        ))
        : null}
    </InteractiveMap>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

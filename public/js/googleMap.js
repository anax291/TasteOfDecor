/* Google Map */
const mapContainer = document.getElementById('map');
// init map
function initMap() {
  const options = {
    zoom: 12,
    center: { lat: 24.8607, lng: 67.0011 },
  };
  const map = new google.maps.Map(mapContainer, options);

  // add markers function
  const addMarker = (props) => {
    const marker = new google.maps.Marker({
      position: props.coords,
      map: map,
    });
    if (props.iconImg) {
      marker.setIcon(props.iconImg);
    }
    if (props.content) {
      const infoWindow = new google.maps.InfoWindow({
        content: props.content,
      });
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    }
  };

  // markers array
  const markers = [
    {
      coords: { lat: 24.927610864825557, lng: 67.03295043729749 },
      content: `
        <div style="padding: 0.5rem">
          <h2>Aptech</h2>
        </div>
      `,
    },
  ];

  // adding marker on map for each marker in array
  markers.forEach((marker) => addMarker(marker));

  // // adding marker where user clicks
  // google.maps.event.addListener(map, 'click', (e) => {
  //   addMarker({ coords: e.latLng });
  // });
}

/* const svgMarker = {
  path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
  fillColor: 'blue',
  fillOpacity: 0.6,
  strokeWeight: 0,
  rotation: 0,
  scale: 2,
  anchor: new google.maps.Point(15, 30),
}; */

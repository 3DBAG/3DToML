import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapTilesViewer } from '3dtoml';
import { bgLayer } from '@geo-frontend/nlmaps-maplibre';
import './style.css';

const tilesets = {
  lod22: 'https://data.3dbag.nl/v20250903/cesium3dtiles/lod22/tileset.json',
  lod13: 'https://data.3dbag.nl/v20250903/cesium3dtiles/lod13/tileset.json',
  lod12: 'https://data.3dbag.nl/v20250903/cesium3dtiles/lod12/tileset.json'
};
const basemapStyles = {
  standaard: () => bgLayer('standaard'),
  grijs: () => bgLayer('grijs'),
  luchtfoto: () => bgLayer('luchtfoto'),
  openfreemap: 'https://tiles.openfreemap.org/styles/liberty'
};

function App() {
  const container = useRef(null);
  const viewer = useRef(null);
  const [basemap, setBasemap] = useState('standaard');
  const [lod, setLod] = useState('lod22');
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const instance = new MapTilesViewer(container.current, {
      tilesUrl: tilesets.lod22,
      basemapPreset: 'standaard',
      basemapStyles,
      locations: [{ rdx: 155000, rdy: 463000, ox: 400, oy: 400, oz: 400 }]
    });
    viewer.current = instance;
    const offPicked = instance.on('object-picked', setSelected);
    const offError = instance.on('tiles-error', setError);
    return () => {
      offPicked();
      offError();
      viewer.current = null;
      instance.destroy();
    };
  }, []);

  useEffect(() => {
    viewer.current?.setBasemapPreset(basemap);
  }, [basemap]);

  useEffect(() => {
    viewer.current?.setTilesUrl(tilesets[lod]);
  }, [lod]);

  return (
    <main>
      <header>
        <label>Basemap <select value={basemap} onChange={event => setBasemap(event.target.value)}>
          <option value="standaard">BRT</option>
          <option value="grijs">BRT grey</option>
          <option value="luchtfoto">Aerial</option>
          <option value="openfreemap">OpenFreeMap</option>
        </select></label>
        <label>LOD <select value={lod} onChange={event => setLod(event.target.value)}>
          <option value="lod22">LOD 2.2</option>
          <option value="lod13">LOD 1.3</option>
          <option value="lod12">LOD 1.2</option>
        </select></label>
        {error && <span role="alert">3D Tiles could not be loaded.</span>}
        {selected && <span>Building: {selected.attributes?.identificatie || selected.featureId}</span>}
      </header>
      <div ref={container} className="map" />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

# 3DToML — 3D Tiles on MapLibre

`3dtoml` is the framework independent rendering engine used by the 3DBAG-viewer. It creates a MapLibre map, adds a Three.js custom layer sharing the map's WebGL context, and streams Cesium 3D Tiles with `3d-tiles-renderer`.

The package is source ESM. The consuming application must use a bundler that handles CSS, PNG imports, `import.meta.url`, and the MapLibre worker asset. The included [React example](examples/react) demonstrates integration with Vite. Install the package and its declared peer dependencies in the consuming application.


This package can be installed with npm:

```sh
npm install 'github:3dbag/3dtoml#v0.1.0'
```

```js
import { MapTilesViewer } from '3dtoml';

const viewer = new MapTilesViewer(document.getElementById('map'), {
  tilesUrl: 'https://example.org/3dtiles/tileset.json',
  basemapPreset: 'streets',
  basemapStyles: { streets: 'https://tiles.openfreemap.org/styles/liberty' },
  config: {
    mapStyleUrl: 'https://tiles.openfreemap.org/styles/liberty',
    terrainTileJsonUrl: 'https://example.org/terrain/tilejson.json',
    terrainEncoding: 'terrarium'
  }
});

const offPicked = viewer.on('object-picked', building => console.log(building));
viewer.setTilesUrl('https://example.org/another-tileset/tileset.json');
offPicked();
viewer.destroy();
```

The container must have a nonzero width and height. Construct the viewer in the browser after the container exists, and call `destroy()` when removing it. The viewer owns the MapLibre map and its WebGL context.

## Options and controls

| Option | Purpose |
| --- | --- |
| `tilesUrl` | URL of the root 3D Tiles `tileset.json`. |
| `fetchTiles` | Optional `(url, options) => Promise<Response>` request hook for root tilesets and tile content, including nested tilesets. Defaults to the renderer's normal fetch behavior. |
| `constrainToTileset` | Constrain panning and zoom-out to the active tileset bounds. Defaults to `true`; set to `false` for unrestricted navigation. |
| `showTilesetBoundary` | Show the outside-area mask and tileset boundary outline. Defaults to `true`; set to `false` to omit both. |
| `basemapPreset`, `basemapStyles` | Key of the initial map style and an object mapping keys to MapLibre style URLs, style objects, or functions returning styles. Defaults to `openfreemap` and OpenFreeMap Liberty. |
| `config.mapStyleUrl` | Fallback style URL; defaults to OpenFreeMap Liberty. |
| `config.terrainTileJsonUrl`, `config.terrainEncoding` | Optional raster DEM TileJSON URL and encoding. No terrain source or hillshade is added unless a URL is supplied. |
| `initialCamera` | Initial `{ rdx, rdy, ox, oy, oz }` camera, where `rdx/rdy` use EPSG:28992 and offsets are metres. |
| `locations` | Possible startup camera objects used when `initialCamera` is absent. |
| `colormap` | Optional 3DBAG semantic attribute coloring configuration. |
| `showTerrain`, `showHillshade`, `showBuildingTiles` | Initial visibility switches; all default to `true`. |
| `attribution` | Optional custom attribution text or HTML, passed directly to MapLibre. No custom attribution is added by default; map source credits are still shown. |
| `locale` | Basemap language. |
| `debugContainer` | Optional element for the development tuning pane. |

The navigation constraint and boundary display are independent constructor options.
Omitting them preserves the default constrained navigation, outside-area mask, and
boundary outline. To disable both, pass `constrainToTileset: false` and
`showTilesetBoundary: false`. These choices also apply after tileset or basemap
changes.

Use `fetchTiles` to supply request headers or authentication without changing the
map, terrain, or basemap requests. The hook receives the renderer's request options;
forward them, including any `AbortSignal`, and return a `Response`. Scope credentials
to trusted URLs because tile content may reference external resources. The hook is
installed on each new tiles renderer, including after `setTilesUrl`.

The `setTilesUrl`, `setBasemapPreset`, `setBasemapStyle`, `setColormap`, `setLocale`, `setAttribution`, `setLocations`, `setCameraPosition`, `setTerrainVisibility`, `setHillshadeVisibility`, `setBuildingTilesVisibility`, and `pointCameraToNorth` methods update the running viewer. `setBasemapStyle` accepts a MapLibre style URL or object directly. The React example provides Dutch basemap styles through `@geo-frontend/nlmaps-maplibre`; the engine itself has no dependency on that package.

`on(name, listener)` returns an unsubscribe function. Events include `object-picked` (building attributes or `undefined`), `camera-change` (the current RD camera object), `cam-offset`, `cam-rotation-z`, `tiles-error`, and `notice` (`{visible, text?, key?}`). The host application owns its URL, localization, toolbar, search, and building information UI. In particular, it can persist `camera-change` in its own router and pass external camera changes to `setCameraPosition`.

Feature picking and coloring require structural metadata in the tileset. The map style, terrain, and tileset URLs must be accessible to the browser. The engine includes the MapLibre stylesheet; its host should provide the surrounding layout.

The engine currently uses a MapLibre internal camera method to align the map and 3D Tiles depth buffers. Keep the declared MapLibre and Three.js versions aligned across the host and this package, and retest rendering before upgrading them.

## License

3dtoml is licensed under the MIT License. See [LICENSE](LICENSE) and [NOTICE](NOTICE) for the license text and contributor credits.

Use `setAttribution(value)` to change the custom attribution, or `setAttribution()` to clear it. The host application supplies any links and updates localized attribution itself.

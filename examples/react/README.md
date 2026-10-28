# 3DTOML React example

This app imports `3dtoml` through a local package dependency and uses React only for controls and lifecycle. It demonstrates switching basemaps and 3D Tiles LoDs and displaying a picked building.

From the `3dtoml` repository root:

```sh
cd examples/react
npm install
npm run dev
```

The map and 3D Tiles URLs require network access in the browser. `npm run build` verifies the React integration without starting a server.

export type MapStyle = string | Record<string, unknown>;

export interface CameraPosition {
  rdx: number | string;
  rdy: number | string;
  ox: number | string;
  oy: number | string;
  oz: number | string;
  placeMarker?: boolean | string;
}

export interface ViewerNotice {
  visible: boolean;
  text?: string;
  key?: string | null;
}

export interface MapTilesViewerOptions {
  tilesUrl: string;
  fetchTiles?: (url: string | URL, options?: RequestInit) => Promise<Response>;
  constrainToTileset?: boolean;
  showTilesetBoundary?: boolean;
  basemapPreset?: string;
  basemapStyles?: Record<string, MapStyle | (() => MapStyle)>;
  colormap?: Record<string, unknown> | null;
  locations?: Array<CameraPosition & { name?: string }>;
  initialCamera?: CameraPosition | null;
  locale?: string;
  showTerrain?: boolean;
  showHillshade?: boolean;
  showBuildingTiles?: boolean;
  attribution?: string;
  debugContainer?: HTMLElement | null;
  config?: {
    mapStyleUrl?: string;
    terrainTileJsonUrl?: string;
    terrainEncoding?: string;
  };
}

export interface ViewerEvents {
  'object-picked': Record<string, unknown> | undefined;
  'camera-change': CameraPosition;
  'cam-offset': { x: number; y: number; z: number };
  'cam-rotation-z': number;
  'tiles-error': Error | null;
  notice: ViewerNotice;
}

export class MapTilesViewer {
  constructor(container: HTMLElement, options: MapTilesViewerOptions);
  on<K extends keyof ViewerEvents>(name: K, listener: (value: ViewerEvents[K]) => void): () => void;
  setTilesUrl(url: string): void;
  setBasemapPreset(preset: string): void;
  setBasemapStyle(style: MapStyle): void;
  setColormap(colormap: Record<string, unknown> | null): void;
  setLocale(locale: string): void;
  setAttribution(attribution?: string): void;
  setLocations(locations: Array<CameraPosition & { name?: string }>): void;
  setCameraPosition(camera: CameraPosition): void;
  setTerrainVisibility(visible: boolean): void;
  setHillshadeVisibility(visible: boolean): void;
  setBuildingTilesVisibility(visible: boolean): void;
  pointCameraToNorth(): void;
  destroy(): void;
}

export const DEFAULT_OTHER_COLOR: string;
export function normalizeHexColor(value: unknown): string | null;
export function normalizeLocalizedText(value: unknown): string | Record<string, string> | null;
export function resolveLocalizedText(value: unknown, locale?: string, fallback?: string): string;
export function getAttributeStyle(colormap: Record<string, unknown> | null): Record<string, unknown>;
export function getAttributeLegend(colormap: Record<string, unknown> | null, locale?: string): Array<Record<string, unknown>>;
export function resolveColormapTitle(colormap: Record<string, unknown> | null, locale?: string): string;
export function getBuildingNotice(tiles: unknown, enabled: boolean, error: unknown): string | null;
export function rdToCartographic(x: number, y: number): { lat: number; lon: number };
export function cartographicToRd(lat: number, lon: number): [number, number];
export function getWorldFrame(...args: unknown[]): unknown;
export function setEcefToLocalFrame(...args: unknown[]): unknown;
export function getSurfacePoint(...args: unknown[]): unknown;
export function worldToCartographic(...args: unknown[]): unknown;
export function routeToCameraFrame(...args: unknown[]): unknown;
export function cameraFrameToRoute(...args: unknown[]): CameraPosition;
export function getCompassRotation(...args: unknown[]): number;
export function getNorthFacingCameraPosition(...args: unknown[]): unknown;
export function getSemanticFeature(intersection: unknown): Promise<Record<string, unknown> | null>;
export function getPreferredHighlightAttribute(object: unknown): string | null;
export function getHeightAboveFeatureBase(...args: unknown[]): number | null;
export function getFeatureInfoForAttribute(...args: unknown[]): Record<string, unknown> | null;
export class SemanticStylingPlugin {
  constructor(options?: Record<string, unknown>);
}

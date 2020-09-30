import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
// models
import { Message } from '@agro-fielding/api-interfaces';
// material
import { MatDialog } from '@angular/material/dialog';
// esri loader
import { loadModules } from 'esri-loader';
import esri = __esri;
// components
import { DialogOverviewMapPointHomeComponent } from '@agro-fieling/app/shared/components/dialog-overview-map-point-home/dialog-overview-map-point-home.component';

@Component({
  selector: 'agro-fielding-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
  private esriWidgetGround: ElementRef;
  private mapWidgetGround: ElementRef;
  view: esri.SceneView;
  map: esri.Map;
  activeMeasureWidget:
    | esri.DirectLineMeasurement3D
    | esri.AreaMeasurement3D = null;
  sketchLayer: esri.GraphicsLayer;
  staticLayer: esri.GraphicsLayer;
  sketchViewModel: esri.SketchViewModel;
  point: esri.PointSymbol3D;
  hello$ = this.http.get<Message>('/api/hello');

  name: string;
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  openDialog() {
    return this.dialog.open(DialogOverviewMapPointHomeComponent, {
      width: '250px',
      data: { name: this.name },
    });
  }

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [
        Map,
        SceneView,
        Track,
        BasemapGallery,
        Expand,
        Home,
        GraphicsLayer,
        SketchViewModel,
      ] = await loadModules([
        'esri/Map',
        'esri/views/SceneView',
        'esri/widgets/Track',
        'esri/widgets/BasemapGallery',
        'esri/widgets/Expand',
        'esri/widgets/Home',
        'esri/layers/GraphicsLayer',
        'esri/widgets/Sketch/SketchViewModel',
      ]);

      this.sketchLayer = new GraphicsLayer();
      this.staticLayer = new GraphicsLayer();

      // Configure the Map
      const mapProperties: esri.MapProperties = {
        ground: 'world-elevation',
        layers: [this.sketchLayer, this.staticLayer],
      };

      this.map = new Map(mapProperties);

      // Initialize the MapView
      const mapViewProperties: esri.SceneViewProperties = {
        container: this.mapViewEl.nativeElement,
        map: this.map,
        camera: {
          heading: 124.7,
          tilt: 82.9,
          position: {
            latitude: 40.713906,
            longitude: -111.848111,
            z: 1990,
          },
        },
      };

      this.view = new SceneView(mapViewProperties);

      const basemapGallery: esri.BasemapGallery = new BasemapGallery({
        view: this.view,
        activeBasemap: 'hybrid',
      });

      const track: esri.Track = new Track({
        view: this.view,
      });
      const expand: esri.Expand = new Expand({
        expandIconClass: 'esri-icon-collection',
        view: this.view,
        content: basemapGallery,
      });

      const homeBtn: esri.Home = new Home({
        view: this.view,
      });

      await this.createPointSymbol();
      this.sketchViewModel = new SketchViewModel({
        layer: this.sketchLayer,
        view: this.view,
        pointSymbol: this.point,
      });

      this.sketchViewModel.on('create', (event) => {
        if (event.state === 'complete') {
          this.openDialog()
            .afterClosed()
            .subscribe(async (result) => {
              const graphic = event.graphic;
              graphic.attributes = {
                name: result,
              };
              console.log('added graphic', graphic);
              this.staticLayer.add(
                await this.createTextSymbol(
                  result,
                  {
                    x: graphic.geometry.get('x'),
                    y: graphic.geometry.get('y'),
                    z: graphic.geometry.get('z'),
                    long: graphic.geometry.get('longitude'),
                    lat: graphic.geometry.get('latitude'),
                  },
                  graphic.get('uid')
                )
              );
              this.sketchViewModel.update(graphic);
            });
        }
      });

      this.sketchViewModel.on('update', (event) => {
        event.graphics.forEach((graphic) => {
          this.updateTextGraphic(graphic.get('uid'), {
            x: graphic.geometry.get('x'),
            y: graphic.geometry.get('y'),
            z: graphic.geometry.get('z'),
          });
        });
      });

      this.view.ui.add(expand, 'top-left');
      this.view.ui.add(track, 'top-left');
      this.view.ui.add(homeBtn, 'top-left');
      this.view.ui.add('esriWidgetGround', 'top-left');
      this.view.ui.add('drawWidgets', 'top-right');
      this.view.ui.add('measureWidgets', 'top-right');
      this.view.when(() => {});
      return this.view;
    } catch (error) {
      console.error('EsriLoader: ', error);
    }
  }

  updateTextGraphic(uid, coord) {
    const updatedGraphic = this.staticLayer.graphics.find(
      (graphic) => graphic.attributes['uidPoint'] === uid
    );
    if (updatedGraphic) {
      const newGraphic = updatedGraphic.clone();
      coord.z += 10;
      newGraphic.geometry.set('x', coord.x);
      newGraphic.geometry.set('y', coord.y);
      newGraphic.geometry.set('z', coord.z);
      this.staticLayer.remove(updatedGraphic);
      this.staticLayer.add(newGraphic);
    }
  }

  async createPointSymbol() {
    try {
      const [PointSymbol3D] = await loadModules(['esri/symbols/PointSymbol3D']);
      // create sketch
      this.point = new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: '20px',
            resource: { primitive: 'kite' },
            outline: {
              color: [82, 82, 122, 0.9],
              size: '3px',
            },
            material: {
              color: [255, 255, 255, 0.8],
            },
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  }

  async createTextSymbol(text: string, coord, uid: number) {
    try {
      const [Graphic] = await loadModules(['esri/Graphic']);
      coord.z += 10;
      const graphicText: esri.Graphic = new Graphic({
        geometry: {
          type: 'point',
          x: coord.x,
          y: coord.y,
          z: coord.z,
          latitude: coord.lat,
          longitude: coord.long,
          spatialReference: {
            wkid: 102100,
          },
        },
        attributes: {
          name: text,
          uidPoint: uid,
        },
        symbol: {
          type: 'text',
          color: [25, 25, 25],
          haloColor: [255, 255, 255],
          haloSize: '1px',
          text,
          xoffset: 0,
          yoffset: -25,
          font: {
            size: 12,
          },
        },
      });
      return graphicText;
    } catch (e) {
      console.error(e);
    }
  }

  async measure(type) {
    try {
      const [DirectLineMeasurement3D, AreaMeasurement3D] = await loadModules([
        'esri/widgets/DirectLineMeasurement3D',
        'esri/widgets/AreaMeasurement3D',
      ]);
      this.destroyMeasureWidget();
      switch (type) {
        case 'distance': {
          this.activeMeasureWidget = new DirectLineMeasurement3D({
            view: this.view,
          });
          this.activeMeasureWidget.viewModel.newMeasurement();
          this.view.ui.add(this.activeMeasureWidget, 'top-right');
          break;
        }
        case 'area': {
          this.activeMeasureWidget = new AreaMeasurement3D({
            view: this.view,
          });
          this.activeMeasureWidget.viewModel.newMeasurement();
          this.view.ui.add(this.activeMeasureWidget, 'top-right');
          break;
        }
        case null:
          this.destroyMeasureWidget();
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }

  destroyMeasureWidget() {
    if (this.activeMeasureWidget) {
      this.view.ui.remove(this.activeMeasureWidget);
      this.activeMeasureWidget.destroy();
      this.activeMeasureWidget = null;
    }
  }

  async changeMapGround(e) {
    const { checked } = e;
    await this.view.when(() => {
      this.map.ground.layers.forEach((layer) => {
        layer.visible = checked;
      });
    });
  }
  drawSketch(type) {
    this.sketchViewModel.create(type);
  }

  ngOnInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}

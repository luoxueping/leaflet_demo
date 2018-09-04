L.Control.Overview = L.Control.extend({
	options: {
		// @option isOpen: boolean 
		// 控制鹰眼的开合状态，默认为true，打开
		isOpen: true,
		// @option position: String = 'bottomright'
		// The position of the control (one of the map corners). Possible values are `'topleft'`,
		// `'topright'`, `'bottomleft'` or `'bottomright'`
		position: 'bottomright',
		// @option collapseLabel: object
		// 设置开合图标样式，默认打开为“《”，关闭为“》”
		collapseLabel: {
			Open: "<<",
			Close: ">>"
		},
		// @option layers: Array
		// 鹰眼图层数组，鹰眼地图将根据传入图层显示
		layers: [],
		// @option zoomlevel: number
		// 鹰眼地图缩放级数与原始地图缩放级数差值
		zoomlevel: 4,
		// @option overlayStyle: object
		overlayStyle: {
			stroke: '#3476c4',
			weight: 2,
			linecap: 'round',
			linejoin: 'round',
			fillColor: '#3476c4',
			fillOpacity: 0.2,
			renderer: L.svg()
		},
		// @option localtionUrl: string
		// 鹰眼组件存放容器，请传入容器id
		target: null,
	},

	initialize: function(options) {
        L.setOptions(this, options);
        //组件大小控制
		this.maxpanel = 158;
		this.minpanel = 22;
	},
    addTo: function(map) {
		this.remove();
		this._map = map;

		var container = this._container = this.onAdd(map);
		L.DomUtil.addClass(container, 'leaflet-control');
        if(this.options.target) {
			var newCont = L.DomUtil.get(this.options.target);
			newCont.appendChild(container);
		} else {
			var pos = this.getPosition(),
				corner = map._controlCorners[pos];
			if(pos.indexOf('bottom') !== -1) {
				corner.insertBefore(container, corner.firstChild);
			} else {
				corner.appendChild(container);
			}
		}
		this._addMap();
		return this;
	},
	onAdd: function(map) {
		var viewName = 'leaflet-control-Overview';
		this._container = L.DomUtil.create('div', viewName + ' leaflet-bar');

		this._viewMap = document.createElement('div');
		this._viewMap.id = 'viewmap';
		this._container.appendChild(this._viewMap);

		this._addCollapseLabel();
		return this._container;
	},
	onRemove: function(map) {
		if(this._container) {
			L.DomUtil.remove(this._container);
		}
	},
    _addMap: function() {
		var overMap = new L.Map('viewmap', {
			zoomControl: false,
			dragging: false,
			scrollWheelZoom: false
		});
		this.overMap = overMap;

		if(this.options.isOpen == true) {
			this._container.style.height = this.maxpanel + "px";
			this._container.style.width = this.maxpanel + "px";
			this._upOverMap();
		} else {
			this._container.style.height = this.minpanel + "px";
			this._container.style.width = this.minpanel + "px";
		}

		if(this.options.layers.length > 0) {
			for(var i = 0; i < this.options.layers.length; i++) {
				this.overMap.addLayer(this.options.layers[i]);
			}
		};

		this.overMap.on('mouseover', this._overDrag, this);
		this.overMap.on('mouseout', this._mapDrag, this);

		this._map.on('moveend', this._upOverMap, this);
		this.overMap.on('moveend', this._upMap, this);
	},
	_mapDrag: function() {
		this.mapdrag = true;
    },
	_overDrag: function() {
		this.mapdrag = false;
	},
	_upMap: function() {
		if(this.mapdrag == false) {
			var center = this.overMap.getCenter();
			var zoom = this.overMap.getZoom() + this.options.zoomlevel;
			this._map.setView(center, zoom);
		}

	},
	_upOverMap: function() {
        if(this.mapdrag == true) {
			var center = this._map.getCenter();
			var zoom = this._map.getZoom() - this.options.zoomlevel;
			this.overMap.setView(center, zoom);

		}
		if(this.polygondrag == false) {
			this._upPolygon();
		}
	},
	_mapDrag: function() {
		this._map.dragging.enable();
		this._map.scrollWheelZoom.enable();
	},
	_overDrag: function() {
		this._map.dragging.disable();
		this._map.scrollWheelZoom.disable();
	},
	_upOverMap: function() {
		this._upPolygon();
		var center = this._map.getCenter();
		var zoom = this._map.getZoom() - this.options.zoomlevel;
		if(zoom < 0) {
			this.overMap.setView(center, 0);
		} else {
			this.overMap.setView(center, zoom);
		}
    },
	_toPolygon: function(bound) {
		var x1 = bound._northEast.lat,
			y1 = bound._northEast.lng,
			x2 = bound._southWest.lat,
			y2 = bound._southWest.lng;

		var latlngs = [
			[x1, y1],
			[x2, y1],
			[x2, y2],
			[x1, y2]
		];
        return latlngs;
	},
	_upPolygon: function() {
		var bound = this._map.getBounds();
		var center = this._map.getCenter();
		center = this._map.latLngToLayerPoint(center);
		var polypoint = this._toPolygon(bound);
		if(!this.polygon) {
			this.polygon = L.polygon(polypoint, this.options.overlayStyle).addTo(this.overMap);
			this.polygon.on('mouseover', this._movePolygon, this);
		} else {
			this.polygon.remove();
			this.polygon = L.polygon(polypoint, this.options.overlayStyle).addTo(this.overMap);
			this.polygon.on('mouseover', this._movePolygon, this);
		}
	},
    _movePolygon: function() {
		var center = this.overMap.getCenter();
		center = this.overMap.latLngToLayerPoint(center);
        
        var draggable = new L.Draggable(this.polygon.getElement());
		draggable.enable();
		var map = this._map;
		var overmap = this.overMap;
		draggable.on("dragend", function(e) {
			var dis = e.distance;
			var _startPos = e.target._startPos;
			var _endPos = e.target._newPos;

			var vd = [_endPos.x - _startPos.x, _endPos.y - _startPos.y];
			var x = center.x + vd[0],
				y = center.y + vd[1];
			var newCenter = L.point(x, y);
			newCenter = overmap.layerPointToLatLng(newCenter);
			map.setView(newCenter);

		});

	},
	_addCollapseLabel: function() {
        var collapseLabel = L.DomUtil.create('div', 'collapse', this._container);
		var collapseIcon = L.DomUtil.create('span', null, collapseLabel);

		if(this.options.isOpen == true) {
			collapseIcon.innerHTML = this.options.collapseLabel.Close;
		} else {
			collapseIcon.innerHTML = this.options.collapseLabel.Open;
        }

		var that = this;
        collapseLabel.onclick = function() {
			if(that.options.isOpen == true) {
				collapseIcon.innerHTML = that.options.collapseLabel.Open;
				that._container.style.height = that.minpanel + "px";
				that._container.style.width = that.minpanel + "px";
				that.options.isOpen = false;
			} else {
				collapseIcon.innerHTML = that.options.collapseLabel.Close;
				that._container.style.height = that.maxpanel + "px";
				that._container.style.width = that.maxpanel + "px";
				that.options.isOpen = true;
				that._upOverMap();
			}
		}
	},
});

L.Map.mergeOptions({
	OverviewControl: false
});

L.control.overview = function(options) {
	return new L.Control.Overview(options);
};
/*global L, Zepto*/
(function ($) {
    'use strict';

    function Demo(mapId, multiOptionsKey) {
        this.mapId = mapId;
        this.selected = multiOptionsKey || 'altitude';
    }

    Demo.prototype = {
        constructor: Demo,

        trackPointFactory: function (data) {
            return data.map(function (item) {
                var wgs = gcj2wgs(item.lat, item.lng)
                var trkpt = L.latLng(wgs.lat,wgs.lng, item.alt);
                // var trkpt = L.latLng(item.lat, item.lng, item.alt);
                trkpt.meta = item.meta;
                return trkpt;
            });
        },

        loadData: function (name) {
            var me = this;

            $.getJSON('data/' + name + '.json', function (data) {
                me.trackPoints = me.trackPointFactory(data);
                me.showMapAndTrack();
            });

        },

        _multiOptions: {
            triZebra: {
                optionIdxFn: function (latLng, prevLatLng, index) {
                    return Math.floor(index / 3) % 3;
                },
                options: [
                    {color: '#2FFC14'},
                    {color: '#FC14ED'},
                    {color: '#FAE900'}
                ]
            },
            heartRate: {
                optionIdxFn: function (latLng) {
                    var i, hr = latLng.meta.hr,
                        zones = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220, 1240, 1260, 1280, 1300, 1320, 1340, 1360, 1380, 1400, 1420, 1440, 1460, 1480, 1500, 1520, 1540, 1560, 1580, 1600, 1620, 1640, 1660, 1680, 1700, 1720, 1740, 1760, 1780, 1800, 1820, 1840, 1860, 1880, 1900, 1920, 1940, 1960, 1980, 2000, 2020, 2040, 2060, 2080, 2100, 2120, 2140, 2160, 2180, 2200, 2220, 2240, 2260, 2280, 2300, 2320, 2340, 2360, 2380, 2400, 2420, 2440, 2460, 2480, 2500, 2520, 2540, 2560, 2580]; // beats per minute

                    for (i = 0; i < zones.length; ++i) {
                        if (hr <= zones[i]) {
                            return i;
                        }
                    }
                    return zones.length;
                },
                options:[{color:'#4cf73d'}, {color:'#4ff73d'}, {color:'#53f73e'}, {color:'#56f73e'}, {color:'#59f73e'}, {color:'#5df83e'}, {color:'#60f83f'}, {color:'#63f83f'}, {color:'#66f83f'}, {color:'#6af83f'}, {color:'#6df840'}, {color:'#70f840'}, {color:'#74f840'}, {color:'#77f841'}, {color:'#7af841'}, {color:'#7df941'}, {color:'#81f941'}, {color:'#84f942'}, {color:'#87f942'}, {color:'#8af942'}, {color:'#8ef942'}, {color:'#91f943'}, {color:'#94f943'}, {color:'#97f943'}, {color:'#9af944'}, {color:'#9efa44'}, {color:'#a1fa44'}, {color:'#a4fa44'}, {color:'#a7fa45'}, {color:'#aafa45'}, {color:'#adfa45'}, {color:'#b1fa46'}, {color:'#b4fa46'}, {color:'#b7fa46'}, {color:'#bafa46'}, {color:'#bdfa47'}, {color:'#c0fb47'}, {color:'#c3fb47'}, {color:'#c6fb48'}, {color:'#cafb48'}, {color:'#cdfb48'}, {color:'#d0fb48'}, {color:'#d3fb49'}, {color:'#d6fb49'}, {color:'#d9fb49'}, {color:'#dcfb4a'}, {color:'#dffb4a'}, {color:'#e2fc4a'}, {color:'#e5fc4a'}, {color:'#e8fc4b'}, {color:'#ebfc4b'}, {color:'#eefc4b'}, {color:'#f1fc4c'}, {color:'#f4fc4c'}, {color:'#f7fc4c'}, {color:'#fafc4c'}, {color:'#fcfb4d'}, {color:'#fcf84d'}, {color:'#fcf64d'}, {color:'#fdf34e'}, {color:'#fdf04e'}, {color:'#fded4e'}, {color:'#fdeb4e'}, {color:'#fde84f'}, {color:'#fde54f'}, {color:'#fde54f'}, {color:'#fde34e'}, {color:'#fde04e'}, {color:'#fdde4d'}, {color:'#fddb4c'}, {color:'#fdd94c'}, {color:'#fdd64b'}, {color:'#fdd44a'}, {color:'#fdd14a'}, {color:'#fdcf49'}, {color:'#fdcc48'}, {color:'#fdc948'}, {color:'#fdc747'}, {color:'#fdc447'}, {color:'#fdc146'}, {color:'#fdbf45'}, {color:'#fdbc45'}, {color:'#fdb944'}, {color:'#fdb743'}, {color:'#fdb443'}, {color:'#feb142'}, {color:'#feae41'}, {color:'#feac41'}, {color:'#fea940'}, {color:'#fea63f'}, {color:'#fea33f'}, {color:'#fea03e'}, {color:'#fe9d3d'}, {color:'#fe9a3d'}, {color:'#fe973c'}, {color:'#fe943b'}, {color:'#fe913b'}, {color:'#fe8e3a'}, {color:'#fe8b39'}, {color:'#fe8839'}, {color:'#fe8538'}, {color:'#fe8237'}, {color:'#fe7f37'}, {color:'#fe7c36'}, {color:'#fe7936'}, {color:'#fe7635'}, {color:'#fe7334'}, {color:'#fe7034'}, {color:'#fe6c33'}, {color:'#fe6932'}, {color:'#fe6632'}, {color:'#fe6331'}, {color:'#fe5f30'}, {color:'#fe5c30'}, {color:'#fe592f'}, {color:'#fe562e'}, {color:'#ff522e'}, {color:'#ff4f2d'}, {color:'#ff4b2c'}, {color:'#ff482c'}, {color:'#ff452b'}, {color:'#ff412a'}, {color:'#ff3e2a'}, {color:'#ff3a29'}, {color:'#ff3728'}, {color:'#ff3328'}, {color:'#ff3027'}, {color:'#ff2c26'}, {color:'#ff2926'}, {color:'#ff2525'}]
            },
            speed: {
                optionIdxFn: function (latLng, prevLatLng) {
                    var i, speed,
                        speedThresholds = [30, 35, 40, 45, 50, 55, 60, 65];

                    speed = latLng.distanceTo(prevLatLng); // meters
                    speed /= (latLng.meta.time - prevLatLng.meta.time) / 1000; // m/s
                    speed *= 3.6; // km/h

                    for (i = 0; i < speedThresholds.length; ++i) {
                        if (speed <= speedThresholds[i]) {
                            return i;
                        }
                    }
                    return speedThresholds.length;
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            },
            altitude: {
                optionIdxFn: function (latLng) {
                    var i, alt = latLng.meta.hr,
                        altThresholds = [50, 100, 300, 800, 1200, 1500, 2000, 2400]; // meters

                    if (!alt) {
                        return 0;
                    }

                    for (i = 0; i < altThresholds.length; ++i) {
                        if (alt <= altThresholds[i]) {
                            return i;
                        }
                    }
                    return altThresholds.length;
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            },
            inclineLast5: {
                optionIdxFn: function (latLng, prevLatLng, index, points) {
                    var i, minAltitude, deltaAltitude, deltaTime, incline, startIndex,
                        thresholds = [200, 300, 400, 500, 600, 700, 800, 900]; // m/h

                    startIndex = Math.max(index - 5, 0);
                    minAltitude = Infinity;
                    for (i = startIndex; i < index; ++i) {
                        minAltitude = Math.min(minAltitude, points[i].alt);
                    }
                    deltaAltitude = latLng.alt - minAltitude; // meters
                    deltaTime = (latLng.meta.time - points[startIndex].meta.time) / 1000; // sec
                    incline = 3600 * deltaAltitude / deltaTime; // m/h

                    if (isNaN(incline)) {
                        return 4; // neutral
                    }

                    for (i = 0; i < thresholds.length; ++i) {
                        if (incline <= thresholds[i]) {
                            return i;
                        }
                    }
                    return thresholds.length;
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            },
            inclineClustered: {
                fnContext: {
                    lastSlot: -1,
                    lastOptionIdx: 0
                },
                optionIdxFn: function (latLng, prevLatLng, index, points) {
                    var i, deltaAltitude, deltaTime, incline, startIndex, endIndex,
                        gain,
                        slot, slotSize = Math.floor(points.length / 60),
                        thresholds = [200, 300, 400, 500, 600, 700, 800, 900];

                    slot = Math.floor(index / slotSize);
                    if (slot === this.lastSlot) {
                        return this.lastOptionIdx;
                    }

                    this.lastSlot = slot;
                    startIndex = slot * slotSize;
                    endIndex = Math.min(startIndex + slotSize, points.length) - 1;
                    gain = 0;
                    for (i = startIndex + 1; i <= endIndex; ++i) {
                        deltaAltitude = points[i].alt - points[i - 1].alt;
                        if (deltaAltitude > 0) {
                            gain += deltaAltitude;
                        }
                    }
                    deltaTime = (points[endIndex].meta.time - points[startIndex].meta.time) / 1000; // sec
                    incline = 3600 * gain / deltaTime; // m/h

                    if (isNaN(incline)) {
                        return (this.lastOptionIdx = 4); // neutral
                    }

                    for (i = 0; i < thresholds.length; ++i) {
                        if (incline <= thresholds[i]) {
                            break;
                        }
                    }
                    return (this.lastOptionIdx = i);
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            },
            inclineSimple: {
                optionIdxFn: function (latLng, prevLatLng) {
                    var i, deltaAltitude, deltaTime, incline,
                        thresholds = [200, 300, 400, 500, 600, 700, 800, 900];

                    deltaAltitude = latLng.alt - prevLatLng.alt; // meters
                    deltaTime = (latLng.meta.time - prevLatLng.meta.time) / 1000; // sec
                    incline = 3600 * deltaAltitude / deltaTime; // m/h

                    if (isNaN(incline)) {
                        return 4; // neutral
                    }

                    for (i = 0; i < thresholds.length; ++i) {
                        if (incline <= thresholds[i]) {
                            return i;
                        }
                    }
                    return thresholds.length;
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            }
        },

        showMapAndTrack: function () {
            var me = this,
                points = me.trackPoints;

            if (!me.map) {
                me.map = L.map(me.mapId);
                /*L.tileLayer('https://api.mapbox.com/styles/v1/resuly/cj9gqm40h98os2ro38ax2gz4m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzdWx5IiwiYSI6ImNqMmxlbDduODAwYjMycW53ZGYxbzU2aXMifQ.XtrVs7zO5QBoxo0dhNzrTA', {
                }).addTo(me.map);*/
                var token ="pk.eyJ1IjoicmVzdWx5IiwiYSI6ImNqMmxlbDduODAwYjMycW53ZGYxbzU2aXMifQ.XtrVs7zO5QBoxo0dhNzrTA";
                var gl = L.mapboxGL({
                    accessToken: token,
                    // style: 'https://raw.githubusercontent.com/osm2vectortiles/mapbox-gl-styles/master/styles/bright-v9-cdn.json'
                    style: 'mapbox://styles/resuly/cj9gqm40h98os2ro38ax2gz4m'
                }).addTo(me.map);
            }

            if (me.visibleTrack) {
                me.map.removeLayer(me.visibleTrack);
            }

            me.visibleTrack = L.featureGroup();

            // create a polyline from an arrays of LatLng points
            var polyline = L.multiOptionsPolyline(points, {
                multiOptions: me._multiOptions[me.selected],
                weight: 10,
                lineCap: 'round',
                opacity: 0.75,
                smoothFactor: 1}).addTo(me.visibleTrack);

            // zoom the map to the polyline
            me.map.fitBounds(polyline.getBounds());

            me.visibleTrack.addTo(me.map);

            /*var m1Icon = L.icon({
                iconUrl: 'placeholder.png',
                iconSize:     [24, 24]
            });
            var m2Icon = L.icon({
                iconUrl: 'm2.png',
                iconSize:     [24, 24]
            });
            
            var startIcon = L.icon.pulse({iconSize:[10,10],color:'#03A9F4'});
            var endIcon = L.icon.pulse({iconSize:[10,10],color:'#e91e63'});
            */
            // L.marker([gcj2wgs(32.08932200, 118.796509).lat,gcj2wgs(32.08932200, 118.796509).lng],{icon: m1Icon}).addTo(me.map);
            // L.marker([gcj2wgs(31.96874899, 118.797957).lat,gcj2wgs(31.96874899, 118.797957).lng],{icon: m2Icon}).addTo(me.map);

        }
    };

    new Demo('map1', 'heartRate').loadData('rallr');
    // new Demo('map2', 'inclineClustered').loadData('hochries');
    // new Demo('map3', 'heartRate').loadData('hochries');
    // new Demo('map4', 'triZebra').loadData('hallenbad');
    // new Demo('map5', 'speed').loadData('hallenbad');

})(Zepto);

THREE.TGALoader = function (q) {
    this.manager = void 0 !== q ? q : THREE.DefaultLoadingManager
};
THREE.TGALoader.prototype = {
    constructor: THREE.TGALoader,
    load: function (q, g, h, l) {
        var w = this,
            u = new THREE.Texture,
            x = new THREE.FileLoader(this.manager);
        x.setResponseType("arraybuffer");
        x.load(q, function (y) {
            u.image = w.parse(y);
            u.needsUpdate = !0;
            void 0 !== g && g(u)
        }, h, l);
        return u
    },
    parse: function (q) {
        19 > q.length && console.error("THREE.TGALoader: Not enough data to contain header.");
        var g = new Uint8Array(q),
            h = 0,
            l = {
                id_length: g[h++],
                colormap_type: g[h++],
                image_type: g[h++],
                colormap_index: g[h++] | g[h++] << 8,
                colormap_length: g[h++] |
                    g[h++] << 8,
                colormap_size: g[h++],
                origin: [g[h++] | g[h++] << 8, g[h++] | g[h++] << 8],
                width: g[h++] | g[h++] << 8,
                height: g[h++] | g[h++] << 8,
                pixel_size: g[h++],
                flags: g[h++]
            };
        (function (c) {
            switch (c.image_type) {
                case 1:
                case 9:
                    (256 < c.colormap_length || 24 !== c.colormap_size || 1 !== c.colormap_type) && console.error("THREE.TGALoader: Invalid type colormap data for indexed type.");
                    break;
                case 2:
                case 3:
                case 10:
                case 11:
                    c.colormap_type && console.error("THREE.TGALoader: Invalid type colormap data for colormap type.");
                    break;
                case 0:
                    console.error("THREE.TGALoader: No data.");
                default:
                    console.error('THREE.TGALoader: Invalid type "%s".', c.image_type)
            }(0 >= c.width || 0 >= c.height) && console.error("THREE.TGALoader: Invalid image size.");
            8 !== c.pixel_size && 16 !== c.pixel_size && 24 !== c.pixel_size && 32 !== c.pixel_size && console.error('THREE.TGALoader: Invalid pixel size "%s".', c.pixel_size)
        })(l);
        l.id_length + h > q.length && console.error("THREE.TGALoader: No data.");
        h += l.id_length;
        var w = !1,
            u = !1,
            x = !1;
        switch (l.image_type) {
            case 9:
                u = w = !0;
                break;
            case 1:
                u = !0;
                break;
            case 10:
                w = !0;
                break;
            case 11:
                x = w = !0;
                break;
            case 3:
                x = !0
        }
        q = document.createElement("canvas");
        q.width = l.width;
        q.height = l.height;
        var y = q.getContext("2d"),
            z = y.createImageData(l.width, l.height);
        g = function (c, a, f, k, n) {
            var t;
            var p = f.pixel_size >> 3;
            var r = f.width * f.height * p;
            a && (t = n.subarray(k, k += f.colormap_length * (f.colormap_size >> 3)));
            if (c) {
                c = new Uint8Array(r);
                f = 0;
                for (var d = new Uint8Array(p); f < r;) {
                    var b = n[k++];
                    a = (b & 127) + 1;
                    if (b & 128) {
                        for (b = 0; b < p; ++b) d[b] = n[k++];
                        for (b = 0; b < a; ++b) c.set(d, f + b * p);
                        f += p * a
                    } else {
                        a *= p;
                        for (b = 0; b < a; ++b) c[f + b] = n[k++];
                        f += a
                    }
                }
            } else c =
                n.subarray(k, k + (a ? f.width * f.height : r));
            return {
                pixel_data: c,
                palettes: t
            }
        }(w, u, l, h, g);
        (function (c, a, f, k, n) {
            switch ((l.flags & 48) >> 4) {
                default:
                case 2:
                    var t = 0;
                    var p = 1;
                    var r = a;
                    a = 0;
                    var d = 1;
                    var b = f;
                    break;
                case 0:
                    t = 0;
                    p = 1;
                    r = a;
                    a = f - 1;
                    b = d = -1;
                    break;
                case 3:
                    t = a - 1;
                    r = p = -1;
                    a = 0;
                    d = 1;
                    b = f;
                    break;
                case 1:
                    t = a - 1, r = p = -1, a = f - 1, b = d = -1
            }
            if (x) switch (l.pixel_size) {
                case 8:
                    n = d;
                    f = b;
                    b = 0;
                    var e, m;
                    d = l.width;
                    for (m = a; m !== f; m += n)
                        for (e = t; e !== r; e += p, b++) a = k[b], c[4 * (e + d * m)] = a, c[4 * (e + d * m) + 1] = a, c[4 * (e + d * m) + 2] = a, c[4 * (e + d * m) + 3] = 255;
                    break;
                case 16:
                    n = d;
                    f =
                        b;
                    b = 0;
                    d = l.width;
                    for (e = a; e !== f; e += n)
                        for (a = t; a !== r; a += p, b += 2) c[4 * (a + d * e)] = k[b + 0], c[4 * (a + d * e) + 1] = k[b + 0], c[4 * (a + d * e) + 2] = k[b + 0], c[4 * (a + d * e) + 3] = k[b + 1];
                    break;
                default:
                    console.error("THREE.TGALoader: Format not supported.")
            } else switch (l.pixel_size) {
                case 8:
                    f = d;
                    d = 0;
                    var v;
                    e = l.width;
                    for (v = a; v !== b; v += f)
                        for (m = t; m !== r; m += p, d++) a = k[d], c[4 * (m + e * v) + 3] = 255, c[4 * (m + e * v) + 2] = n[3 * a], c[4 * (m + e * v) + 1] = n[3 * a + 1], c[4 * (m + e * v)] = n[3 * a + 2];
                    break;
                case 16:
                    n = d;
                    f = b;
                    b = 0;
                    d = l.width;
                    for (m = a; m !== f; m += n)
                        for (e = t; e !== r; e += p, b += 2) a = k[b + 0] + (k[b +
                            1] << 8), c[4 * (e + d * m)] = (a & 31744) >> 7, c[4 * (e + d * m) + 1] = (a & 992) >> 2, c[4 * (e + d * m) + 2] = (a & 31) >> 3, c[4 * (e + d * m) + 3] = a & 32768 ? 0 : 255;
                    break;
                case 24:
                    n = d;
                    f = b;
                    b = 0;
                    d = l.width;
                    for (e = a; e !== f; e += n)
                        for (a = t; a !== r; a += p, b += 3) c[4 * (a + d * e) + 3] = 255, c[4 * (a + d * e) + 2] = k[b + 0], c[4 * (a + d * e) + 1] = k[b + 1], c[4 * (a + d * e)] = k[b + 2];
                    break;
                case 32:
                    n = d;
                    f = b;
                    b = 0;
                    d = l.width;
                    for (e = a; e !== f; e += n)
                        for (a = t; a !== r; a += p, b += 4) c[4 * (a + d * e) + 2] = k[b + 0], c[4 * (a + d * e) + 1] = k[b + 1], c[4 * (a + d * e)] = k[b + 2], c[4 * (a + d * e) + 3] = k[b + 3];
                    break;
                default:
                    console.error("THREE.TGALoader: Format not supported.")
            }
            return c
        })(z.data,
            l.width, l.height, g.pixel_data, g.palettes);
        y.putImageData(z, 0, 0);
        return q
    }
};
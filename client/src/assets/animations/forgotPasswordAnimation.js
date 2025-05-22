export default {
  v: "5.7.8",
  fr: 30,
  ip: 0,
  op: 120,
  w: 600,
  h: 600,
  nm: "Forgot Password Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Key",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [-30] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [0] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 60, s: [30] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 90, s: [0] },
            { t: 120, s: [-30] }
          ],
          ix: 10
        },
        p: { a: 0, k: [300, 300, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [0, -40], ix: 3 },
              s: { a: 0, k: [70, 70], ix: 2 },
              d: 1,
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "st",
              c: { a: 0, k: [0.4, 0.31, 0.89, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 10, ix: 5 },
              lc: 1,
              lj: 1,
              ml: 4,
              bm: 0,
              nm: "Stroke 1",
              mn: "ADBE Vector Graphic - Stroke",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { 
                a: 1, 
                k: [
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 0, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 30, s: [110, 110] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 60, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 90, s: [110, 110] },
                  { t: 120, s: [100, 100] }
                ], 
                ix: 3 
              },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Key Head",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [15, 120], ix: 2 },
              p: { a: 0, k: [0, 30], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.4, 0.31, 0.89, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Key Shaft",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 2,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [40, 15], ix: 2 },
              p: { a: 0, k: [20, 60], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.4, 0.31, 0.89, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Key Tooth 1",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 3,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [30, 15], ix: 2 },
              p: { a: 0, k: [15, 80], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.4, 0.31, 0.89, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Key Tooth 2",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 4,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Lock",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { 
          a: 1, 
          k: [
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 0, s: [450, 300, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 60, s: [450, 280, 0] },
            { t: 120, s: [450, 300, 0] }
          ], 
          ix: 2, 
          l: 2 
        },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [60, 80], ix: 2 },
              p: { a: 0, k: [0, 10], ix: 3 },
              r: { a: 0, k: 10, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.5, 0.5, 0.5, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Lock Body",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [0, -25], ix: 3 },
              s: { a: 0, k: [40, 40], ix: 2 },
              d: 1,
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "st",
              c: { a: 0, k: [0.5, 0.5, 0.5, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 10, ix: 5 },
              lc: 1,
              lj: 1,
              ml: 4,
              bm: 0,
              nm: "Stroke 1",
              mn: "ADBE Vector Graphic - Stroke",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { 
                a: 1, 
                k: [
                  { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 25, s: [100] },
                  { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [0] },
                  { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 95, s: [0] },
                  { t: 100, s: [100] }
                ], 
                ix: 7 
              },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Lock Arc",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 2,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [0, 10], ix: 3 },
              s: { a: 0, k: [25, 25], ix: 2 },
              d: 1,
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 0, 0, 1], ix: 4 },
              o: { 
                a: 1, 
                k: [
                  { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 25, s: [0] },
                  { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [100] },
                  { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 90, s: [100] },
                  { t: 95, s: [0] }
                ], 
                ix: 5 
              },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { 
                a: 1, 
                k: [
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 30, s: [0, 0] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 45, s: [120, 120] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 60, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 75, s: [110, 110] },
                  { t: 90, s: [100, 100] }
                ], 
                ix: 3 
              },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Warning",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 3,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    }
  ],
  markers: []
}; 
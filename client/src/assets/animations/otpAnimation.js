export default {
  v: "5.7.8",
  fr: 30,
  ip: 0,
  op: 120,
  w: 600,
  h: 600,
  nm: "OTP Verification Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Envelope",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [-5] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [5] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 60, s: [-5] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 90, s: [5] },
            { t: 120, s: [-5] }
          ],
          ix: 10
        },
        p: { 
          a: 1, 
          k: [
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 0, s: [300, 300, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 60, s: [300, 290, 0] },
            { t: 120, s: [300, 300, 0] }
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
              s: { a: 0, k: [160, 100], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 5, ix: 4 },
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
          nm: "Envelope Body",
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
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-80, -50], [0, 0], [80, -50]],
                  c: false
                },
                ix: 2
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false
            },
            {
              ty: "st",
              c: { a: 0, k: [1, 1, 1, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 4, ix: 5 },
              lc: 2,
              lj: 2,
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
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 30, s: [105, 105] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 60, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 90, s: [105, 105] },
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
          nm: "Envelope Flap",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 2,
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
      nm: "OTP Digits",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [300, 400, 0], ix: 2, l: 2 },
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
              s: { a: 0, k: [30, 40], ix: 2 },
              p: { a: 0, k: [-100, 0], ix: 3 },
              r: { a: 0, k: 5, ix: 4 },
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
              s: { 
                a: 1, 
                k: [
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 0, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 20, s: [110, 110] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 40, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 80, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 100, s: [105, 105] },
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
          nm: "Digit 1",
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
              s: { a: 0, k: [30, 40], ix: 2 },
              p: { a: 0, k: [-60, 0], ix: 3 },
              r: { a: 0, k: 5, ix: 4 },
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
              s: { 
                a: 1, 
                k: [
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 10, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 30, s: [110, 110] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 50, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 85, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 105, s: [105, 105] },
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
          nm: "Digit 2",
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
              s: { a: 0, k: [30, 40], ix: 2 },
              p: { a: 0, k: [-20, 0], ix: 3 },
              r: { a: 0, k: 5, ix: 4 },
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
              s: { 
                a: 1, 
                k: [
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 20, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 40, s: [110, 110] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 60, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 90, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 110, s: [105, 105] },
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
          nm: "Digit 3",
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
              s: { a: 0, k: [30, 40], ix: 2 },
              p: { a: 0, k: [20, 0], ix: 3 },
              r: { a: 0, k: 5, ix: 4 },
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
              s: { 
                a: 1, 
                k: [
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 30, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 50, s: [110, 110] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 70, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 95, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 110, s: [105, 105] },
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
          nm: "Digit 4",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 4,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [30, 40], ix: 2 },
              p: { a: 0, k: [60, 0], ix: 3 },
              r: { a: 0, k: 5, ix: 4 },
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
              s: { 
                a: 1, 
                k: [
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 40, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 60, s: [110, 110] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 80, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 100, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 110, s: [105, 105] },
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
          nm: "Digit 5",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 5,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [30, 40], ix: 2 },
              p: { a: 0, k: [100, 0], ix: 3 },
              r: { a: 0, k: 5, ix: 4 },
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
              s: { 
                a: 1, 
                k: [
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 50, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 70, s: [110, 110] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 90, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 100, s: [100, 100] },
                  { i: { x: [0.667, 0.667], y: [1, 1] }, o: { x: [0.333, 0.333], y: [0, 0] }, t: 110, s: [105, 105] },
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
          nm: "Digit 6",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 6,
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
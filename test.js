'use strict'
var fillMissingKeys = require('./index.js')
import test from 'ava'

// ==============================
// 1. Adds missing keys
// ==============================

test('01.01 - filling in missing keys, simple plain object', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a'
      },
      {
        a: false,
        b: false,
        c: false
      }
    ),
    {
      a: 'a',
      b: false,
      c: false
    },
    '01.01')
})

test('01.02 - filling in missing keys, nested, with arrays', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a'
      },
      {
        a: false,
        b: [
          {
            x: 'x'
          }
        ],
        c: {
          y: 'y'
        }
      }
    ),
    {
      a: 'a',
      b: [
        {
          x: 'x'
        }
      ],
      c: {
        y: 'y'
      }
    },
    '01.02.01')
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a'
      },
      {
        a: 'z',
        b: [
          {
            x: 'x'
          }
        ],
        c: {
          y: 'y'
        }
      }
    ),
    {
      a: 'a',
      b: [
        {
          x: 'x'
        }
      ],
      c: {
        y: 'y'
      }
    },
    '01.02.02')
})

test('01.03 - multiple values, sorting as well', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        b: 'b',
        a: 'a'
      },
      {
        a: false,
        b: false,
        c: false
      }
    ),
    {
      a: 'a',
      b: 'b',
      c: false
    },
    '01.03')
})

test('01.04 - nested arrays as values (array in schema overwrites Boolean)', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: false
      },
      {
        a: [
          {
            b: false
          }
        ]
      }
    ),
    {
      a: [
        {
          b: false
        }
      ]
    },
    '01.04')
})

test('01.05 - more complex nested arrays', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        c: 'c'
      },
      {
        a: false,
        b: [
          {
            x: false,
            y: false
          }
        ],
        c: false
      }
    ),
    {
      a: false,
      b: [
        {
          x: false,
          y: false
        }
      ],
      c: 'c'
    },
    '01.05')
})

test('01.06 - ridiculously deep nesting', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: false
      },
      {
        a: [
          {
            b: [
              {
                c: [
                  {
                    d: [
                      {
                        e: [
                          {
                            f: [
                              {
                                g: [
                                  {
                                    h: [
                                      {
                                        i: [
                                          {
                                            j: [
                                              {
                                                k: false
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ),
    {
      a: [
        {
          b: [
            {
              c: [
                {
                  d: [
                    {
                      e: [
                        {
                          f: [
                            {
                              g: [
                                {
                                  h: [
                                    {
                                      i: [
                                        {
                                          j: [
                                            {
                                              k: false
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    '01.06')
})

// ==============================
// 2. Normalises array contents
// ==============================

test('02.01 - one level-deep array', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: [
          {
            b: 'b'
          },
          {
            c: 'c'
          },
          {
            d: 'd'
          },
          {
            e: 'e'
          }
        ]
      },
      {
        a: [
          {
            b: false,
            c: false,
            d: false,
            e: false
          }
        ]
      }
    ),
    {
      a: [
        {
          b: 'b',
          c: false,
          d: false,
          e: false
        },
        {
          b: false,
          c: 'c',
          d: false,
          e: false
        },
        {
          b: false,
          c: false,
          d: 'd',
          e: false
        },
        {
          b: false,
          c: false,
          d: false,
          e: 'e'
        }
      ]
    },
    '02.01')
})

test('02.02 - multiple levels of nested arrays)', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        c: 'c'
      },
      {
        a: false,
        b: [
          {
            'key4': false,
            'key5': false,
            'key6': [
              {
                'key7': false,
                'key8': false
              }
            ]
          }
        ],
        c: false
      }
    ),
    {
      a: false,
      b: [
        {
          'key4': false,
          'key5': false,
          'key6': [
            {
              'key7': false,
              'key8': false
            }
          ]
        }
      ],
      c: 'c'
    },
    '02.02')
})

// ==============================
// 3. String vs array clashes
// ==============================
// two objects with the same key
// one has value array, other string
// nothing happens
// ==============================

test('03.01 - string vs array clash', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a'
      },
      {
        a: [
          {
            b: 'b'
          }
        ]
      }
    ),
    {
      a: 'a'
    },
    '03.01')
})

test('03.02 - object vs array clash', t => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a'
      },
      {
        a: {
          b: false
        }
      }
    ),
    {
      a: 'a'
    },
    '03.02')
})

// ==============================
// 4. Contingencies
// ==============================

test('04.01 - number as input', t => {
  t.deepEqual(
    fillMissingKeys(
      1,
      {
        a: {
          b: false
        }
      }
    ),
    undefined,
    '04.01')
})

test('04.02 - boolean as input', t => {
  t.deepEqual(
    fillMissingKeys(
      true,
      {
        a: {
          b: false
        }
      }
    ),
    undefined,
    '04.02')
})

test('04.03 - null as input', t => {
  t.deepEqual(
    fillMissingKeys(
      null,
      {
        a: {
          b: false
        }
      }
    ),
    undefined,
    '04.03')
})

test('04.04 - both args missing (as in undefined-missing)', t => {
  t.deepEqual(
    fillMissingKeys(
      undefined,
      undefined
    ),
    undefined,
    '04.04')
})

test('04.05 - both args completely missing', t => {
  t.deepEqual(
    fillMissingKeys(),
    undefined,
    '04.05')
})

// ================================
// 5. Input arg mutation prevention
// ================================

var testObj = {
  a: 'a'
}

var tempRes = fillMissingKeys(
  testObj,
  {
    a: false,
    b: false,
    c: false
  }
)

test('05.01 - does not mutate the input args', t => {
  t.pass(tempRes) // dummy
  t.deepEqual(
    testObj,
    {
      a: 'a'
    },
    '05.01') // real deal
})

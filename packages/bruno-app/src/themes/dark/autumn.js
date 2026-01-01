// Autumn - Dark Theme
// Based on Helix Editor theme: https://github.com/helix-editor/helix

import { rgba } from 'polished';

const colors = {
  // Autumn Palette
  BLACK: '#212121',
  BROWN: '#cfba8b',
  GRAY0: '#232323',
  GRAY1: '#2b2b2b',
  GRAY2: '#323232',
  GRAY3: '#404040',
  GRAY4: '#646f69',
  GRAY5: '#646f69',
  GRAY6: '#a8a8a8',
  GRAY7: '#c8c8c8',
  GRAY8: '#e8e8e8',
  GREEN: '#99be70',
  RED: '#F05E48',
  TURQUOISE1: '#86c1b9',
  TURQUOISE2: '#72a59e',
  WHITE1: '#F3F2CC',
  WHITE2: '#F3F2CC',
  WHITE3: '#F3F2CC',
  WHITE4: '#7e7d6a',
  YELLOW1: '#FAD566',
  YELLOW2: '#ffff9f',

  // Mapped to Bruno structure
  TEXT: '#F3F2CC',
  SUBTEXT1: '#c8c8c8',
  SUBTEXT0: '#a8a8a8',
  OVERLAY2: '#646f69',
  OVERLAY1: '#646f69',
  OVERLAY0: '#646f69',
  SURFACE2: '#404040',
  SURFACE1: '#323232',
  SURFACE0: '#2b2b2b',
  BASE: '#232323',
  MANTLE: '#232323',
  CRUST: '#212121',

  WHITE: '#fff',
  BLACK_PURE: '#000',

  CODEMIRROR_TOKENS: {
    DEFINITION: '#86c1b9', // function - matches Helix treesitter function color (turquoise/blue)
    PROPERTY: '#86c1b9', // property - matches Helix treesitter property color
    STRING: '#99be70', // string - matches Helix treesitter string color (green)
    NUMBER: '#FAD566', // number - matches Helix treesitter number color (yellow)
    ATOM: '#FAD566', // type - matches Helix treesitter type color (yellow)
    VARIABLE: '#F3F2CC', // variable - matches Helix treesitter variable color (text)
    KEYWORD: '#F05E48', // keyword - matches Helix treesitter keyword color (red)
    COMMENT: '#646f69', // comment - matches Helix treesitter comment color (muted)
    OPERATOR: '#F3F2CC', // operator - matches Helix treesitter operator color (text)
    TAG: '#86c1b9', // tag - matches Helix treesitter tag color (blue/cyan)
    TAG_BRACKET: '#646f69' // tag bracket - matches Helix treesitter bracket color (muted)
  }
};

const autumnTheme = {
  mode: 'dark',
  brand: colors.YELLOW1,
  text: colors.TEXT,
  textLink: colors.TURQUOISE2,
  bg: colors.BASE,

  primary: {
    solid: colors.YELLOW1,
    text: colors.YELLOW1,
    strong: colors.YELLOW1,
    subtle: colors.YELLOW1
  },

  accents: {
    primary: colors.YELLOW1
  },

  background: {
    base: colors.BASE,
    mantle: colors.MANTLE,
    crust: colors.CRUST,
    surface0: colors.SURFACE0,
    surface1: colors.SURFACE1,
    surface2: colors.SURFACE2
  },

  overlay: {
    overlay2: colors.OVERLAY2,
    overlay1: colors.OVERLAY1,
    overlay0: colors.OVERLAY0
  },

  font: {
    size: {
      xs: '0.6875rem',
      sm: '0.75rem',
      base: '0.8125rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.125rem'
    }
  },

  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.3)',
    md: '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.4)',
    lg: '0 2px 12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.4)'
  },

  border: {
    radius: {
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '10px',
      xl: '12px'
    },
    border2: colors.SURFACE2,
    border1: colors.SURFACE1,
    border0: colors.SURFACE0
  },

  colors: {
    text: {
      white: colors.WHITE,
      green: colors.GREEN,
      danger: colors.RED,
      warning: colors.YELLOW1,
      muted: colors.SUBTEXT0,
      purple: colors.BROWN,
      yellow: colors.YELLOW1,
      subtext2: colors.TEXT,
      subtext1: colors.SUBTEXT1,
      subtext0: colors.SUBTEXT0
    },
    bg: {
      danger: colors.RED
    },
    accent: colors.YELLOW1
  },

  input: {
    bg: 'transparent',
    border: colors.SURFACE1,
    focusBorder: colors.TURQUOISE1,
    placeholder: {
      color: colors.OVERLAY0,
      opacity: 0.75
    }
  },

  sidebar: {
    color: colors.TEXT,
    muted: colors.SUBTEXT0,
    bg: colors.BASE,
    dragbar: {
      border: colors.SURFACE0,
      activeBorder: colors.OVERLAY0
    },

    collection: {
      item: {
        bg: colors.SURFACE0,
        hoverBg: colors.SURFACE0,
        focusBorder: colors.SURFACE1,
        indentBorder: `solid 1px ${colors.SURFACE2}`,
        active: {
          indentBorder: `solid 1px ${colors.YELLOW1}`
        },
        example: {
          iconColor: colors.OVERLAY1
        }
      }
    },

    dropdownIcon: {
      color: colors.TEXT
    }
  },

  dropdown: {
    color: colors.TEXT,
    iconColor: colors.SUBTEXT1,
    bg: colors.SURFACE0,
    hoverBg: rgba(colors.GRAY3, 0.16),
    shadow: 'none',
    border: rgba(colors.SURFACE1, 0.5),
    separator: colors.SURFACE1,
    selectedColor: colors.YELLOW1,
    mutedText: colors.SUBTEXT0
  },

  workspace: {
    accent: colors.YELLOW1,
    border: colors.SURFACE1,
    button: {
      bg: colors.SURFACE0
    }
  },

  request: {
    methods: {
      get: colors.GREEN,
      post: colors.TURQUOISE1,
      put: colors.YELLOW1,
      delete: colors.RED,
      patch: colors.YELLOW2,
      options: colors.TURQUOISE2,
      head: colors.TURQUOISE1
    },

    grpc: colors.TURQUOISE1,
    ws: colors.YELLOW1,
    gql: colors.BROWN
  },

  requestTabPanel: {
    url: {
      bg: colors.BASE,
      icon: colors.TEXT,
      iconDanger: colors.RED,
      border: `solid 1px ${colors.SURFACE1}`
    },
    dragbar: {
      border: colors.SURFACE0,
      activeBorder: colors.OVERLAY0
    },
    responseStatus: colors.TEXT,
    responseOk: colors.GREEN,
    responseError: colors.RED,
    responsePending: colors.TURQUOISE1,
    responseOverlayBg: rgba(35, 35, 35, 0.6),

    card: {
      bg: colors.MANTLE,
      border: 'transparent',
      hr: colors.SURFACE0
    },

    graphqlDocsExplorer: {
      bg: colors.BASE,
      color: colors.TEXT
    }
  },

  notifications: {
    bg: colors.SURFACE0,
    list: {
      bg: colors.SURFACE0,
      borderRight: colors.SURFACE2,
      borderBottom: colors.SURFACE1,
      hoverBg: colors.SURFACE1,
      active: {
        border: colors.TURQUOISE1,
        bg: colors.SURFACE2,
        hoverBg: colors.SURFACE2
      }
    }
  },

  modal: {
    title: {
      color: colors.TEXT,
      bg: colors.MANTLE
    },
    body: {
      color: colors.TEXT,
      bg: colors.BASE
    },
    input: {
      bg: 'transparent',
      border: colors.SURFACE1,
      focusBorder: colors.TURQUOISE1
    },
    backdrop: {
      opacity: 0.2
    }
  },

  button: {
    secondary: {
      color: colors.TEXT,
      bg: colors.SURFACE0,
      border: colors.SURFACE0,
      hoverBorder: colors.OVERLAY0
    },
    close: {
      color: colors.TEXT,
      bg: 'transparent',
      border: 'transparent',
      hoverBorder: ''
    },
    disabled: {
      color: colors.OVERLAY0,
      bg: colors.SURFACE1,
      border: colors.SURFACE1
    },
    danger: {
      color: colors.CRUST,
      bg: colors.RED,
      border: colors.RED
    }
  },
  button2: {
    color: {
      primary: {
        bg: colors.YELLOW1,
        text: colors.CRUST,
        border: colors.YELLOW1
      },
      secondary: {
        bg: colors.SURFACE0,
        text: colors.TEXT,
        border: colors.SURFACE1
      },
      success: {
        bg: colors.GREEN,
        text: colors.CRUST,
        border: colors.GREEN
      },
      warning: {
        bg: colors.YELLOW1,
        text: colors.CRUST,
        border: colors.YELLOW1
      },
      danger: {
        bg: colors.RED,
        text: colors.CRUST,
        border: colors.RED
      }
    }
  },

  tabs: {
    marginRight: '1.2rem',
    active: {
      fontWeight: 400,
      color: colors.TEXT,
      border: colors.YELLOW1
    },
    secondary: {
      active: {
        bg: colors.SURFACE0,
        color: colors.TEXT
      },
      inactive: {
        bg: colors.SURFACE1,
        color: colors.SUBTEXT0
      }
    }
  },

  requestTabs: {
    color: colors.TEXT,
    bg: colors.SURFACE0,
    bottomBorder: colors.SURFACE1,
    icon: {
      color: colors.OVERLAY0,
      hoverColor: colors.TEXT,
      hoverBg: colors.BASE
    },
    example: {
      iconColor: colors.OVERLAY1
    }
  },

  codemirror: {
    bg: colors.BASE,
    border: colors.BASE,
    placeholder: {
      color: colors.OVERLAY0,
      opacity: 0.5
    },
    gutter: {
      bg: colors.BASE
    },
    variable: {
      valid: colors.GREEN,
      invalid: colors.RED,
      prompt: colors.TURQUOISE1
    },
    tokens: {
      definition: colors.CODEMIRROR_TOKENS.DEFINITION,
      property: colors.CODEMIRROR_TOKENS.PROPERTY,
      string: colors.CODEMIRROR_TOKENS.STRING,
      number: colors.CODEMIRROR_TOKENS.NUMBER,
      atom: colors.CODEMIRROR_TOKENS.ATOM,
      variable: colors.CODEMIRROR_TOKENS.VARIABLE,
      keyword: colors.CODEMIRROR_TOKENS.KEYWORD,
      comment: colors.CODEMIRROR_TOKENS.COMMENT,
      operator: colors.CODEMIRROR_TOKENS.OPERATOR,
      tag: colors.CODEMIRROR_TOKENS.TAG,
      tagBracket: colors.CODEMIRROR_TOKENS.TAG_BRACKET
    },
    searchLineHighlightCurrent: rgba(100, 111, 105, 0.18),
    searchMatch: colors.YELLOW1,
    searchMatchActive: colors.YELLOW2
  },

  table: {
    border: colors.SURFACE0,
    thead: {
      color: colors.TEXT
    },
    striped: colors.SURFACE0,
    input: {
      color: colors.TEXT
    }
  },

  plainGrid: {
    hoverBg: colors.SURFACE0
  },

  scrollbar: {
    color: colors.SURFACE0
  },

  dragAndDrop: {
    border: colors.TURQUOISE1,
    borderStyle: '2px solid',
    hoverBg: rgba(134, 193, 185, 0.08),
    transition: 'all 0.1s ease'
  },
  infoTip: {
    bg: colors.SURFACE0,
    border: colors.SURFACE1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
  },

  statusBar: {
    border: colors.SURFACE0,
    color: colors.SUBTEXT0
  },

  console: {
    bg: colors.BASE,
    headerBg: colors.MANTLE,
    contentBg: colors.BASE,
    border: colors.SURFACE0,
    titleColor: colors.TEXT,
    countColor: colors.SUBTEXT0,
    buttonColor: colors.TEXT,
    buttonHoverBg: rgba(243, 242, 204, 0.1),
    buttonHoverColor: colors.TEXT,
    messageColor: colors.TEXT,
    timestampColor: colors.SUBTEXT0,
    emptyColor: colors.SUBTEXT0,
    logHoverBg: rgba(243, 242, 204, 0.05),
    resizeHandleHover: colors.TURQUOISE1,
    resizeHandleActive: colors.TURQUOISE1,
    dropdownBg: colors.MANTLE,
    dropdownHeaderBg: colors.SURFACE0,
    optionHoverBg: rgba(243, 242, 204, 0.05),
    optionLabelColor: colors.TEXT,
    optionCountColor: colors.SUBTEXT0,
    checkboxColor: colors.YELLOW1,
    scrollbarTrack: colors.MANTLE,
    scrollbarThumb: colors.SURFACE2,
    scrollbarThumbHover: colors.OVERLAY0
  },

  grpc: {
    tabNav: {
      container: {
        bg: colors.CRUST
      },
      button: {
        active: {
          bg: colors.SURFACE0,
          color: colors.TEXT
        },
        inactive: {
          bg: 'transparent',
          color: colors.SUBTEXT0
        }
      }
    },
    importPaths: {
      header: {
        text: colors.SUBTEXT0,
        button: {
          color: colors.SUBTEXT0,
          hoverColor: colors.TEXT
        }
      },
      error: {
        bg: 'transparent',
        text: colors.RED,
        link: {
          color: colors.RED,
          hoverColor: colors.RED
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: rgba(243, 242, 204, 0.05),
        text: colors.TEXT,
        icon: colors.SUBTEXT0,
        checkbox: {
          color: colors.TEXT
        },
        invalid: {
          opacity: 0.6,
          text: colors.RED
        }
      },
      empty: {
        text: colors.SUBTEXT0
      },
      button: {
        bg: colors.SURFACE0,
        color: colors.TEXT,
        border: colors.SURFACE0,
        hoverBorder: colors.OVERLAY0
      }
    },
    protoFiles: {
      header: {
        text: colors.SUBTEXT0,
        button: {
          color: colors.SUBTEXT0,
          hoverColor: colors.TEXT
        }
      },
      error: {
        bg: 'transparent',
        text: colors.RED,
        link: {
          color: colors.RED,
          hoverColor: colors.RED
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: rgba(243, 242, 204, 0.05),
        selected: {
          bg: rgba(250, 213, 102, 0.2),
          border: colors.YELLOW1
        },
        text: colors.TEXT,
        secondaryText: colors.SUBTEXT0,
        icon: colors.SUBTEXT0,
        invalid: {
          opacity: 0.6,
          text: colors.RED
        }
      },
      empty: {
        text: colors.SUBTEXT0
      },
      button: {
        bg: colors.SURFACE0,
        color: colors.TEXT,
        border: colors.SURFACE0,
        hoverBorder: colors.OVERLAY0
      }
    }
  },
  deprecationWarning: {
    bg: rgba(240, 94, 72, 0.1),
    border: rgba(240, 94, 72, 0.1),
    icon: colors.RED,
    text: colors.SUBTEXT1
  },

  examples: {
    buttonBg: rgba(250, 213, 102, 0.1),
    buttonColor: colors.YELLOW1,
    buttonText: colors.TEXT,
    buttonIconColor: colors.TEXT,
    border: colors.SURFACE1,
    urlBar: {
      border: colors.SURFACE1,
      bg: colors.MANTLE
    },
    table: {
      thead: {
        bg: colors.MANTLE,
        color: colors.SUBTEXT0
      }
    },
    checkbox: {
      color: colors.CRUST
    }
  },

  app: {
    collection: {
      toolbar: {
        environmentSelector: {
          bg: colors.BASE,
          border: colors.SURFACE0,
          icon: colors.YELLOW1,
          text: colors.TEXT,
          caret: colors.SUBTEXT0,
          separator: colors.SURFACE0,
          hoverBg: colors.BASE,
          hoverBorder: colors.SURFACE1,

          noEnvironment: {
            text: colors.SUBTEXT0,
            bg: colors.BASE,
            border: colors.SURFACE0,
            hoverBg: colors.BASE,
            hoverBorder: colors.SURFACE1
          }
        },
        sandboxMode: {
          safeMode: {
            bg: rgba(153, 190, 112, 0.12),
            color: colors.GREEN
          },
          developerMode: {
            bg: rgba(250, 213, 102, 0.11),
            color: colors.YELLOW1
          }
        }
      }
    }
  }
};

export default autumnTheme;

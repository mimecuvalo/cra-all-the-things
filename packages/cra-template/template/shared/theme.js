import { createMuiTheme } from '@material-ui/core/styles';

// Tweak to your own color scheme.
export const Color = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  GRAY: '#BDBDBD',
  GREEN: '#5ECD91',
  PURPLE: '#5C29D4',
};

// This is an example Material UI theme. Uncomment and tweak as you like!
//const FONT_FAMILY = ['Roboto', 'sans-serif'];
//const MONOSPACE_FONT_FAMILY = ["'Space Mono'", 'monospace'];
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  //   body1: {
  //     FONT_FAMILY,
  //     fontWeight: 700,
  //     letterSpacing: '-0.5px',
  //   },
  //   body2: {
  //     FONT_FAMILY,
  //     fontWeight: 400,
  //   },
  //   button: {
  //     textTransform: 'none',
  //   },
  //   h1: {
  //     FONT_FAMILY,
  //     fontSize: '50px',
  //     fontWeight: 700,
  //     lineHeight: '64px',
  //     letterSpacing: '-0.01em',
  //     padding: '10px 0',
  //   },
  //   subtitle1: {
  //     MONOSPACE_FONT_FAMILY,
  //     fontSize: '14px',
  //     fontWeight: 700,
  //   },
  //   subtitle2: {
  //     MONOSPACE_FONT_FAMILY,
  //     fontSize: '12px',
  //     fontWeight: 700,
  //     letterSpacing: 0,
  //   },
  //   button: {
  //     FONT_FAMILY,
  //     fontSize: '12px',
  //     fontWeight: '700',
  //     textTransform: 'none',
  //   },
  // },
  // palette: {
  //   primary: {
  //     main: Color.BLACK,
  //   },
  //   secondary: {
  //     main: Color.BLACK,
  //   },
  //   text: {
  //     primary: Color.BLACK,
  //     secondary: Color.GRAY,
  //     white: Color.WHITE,
  //   },
  //   background: {
  //     paper: Color.WHITE,
  //     default: Color.WHITE,
  //     purple: Color.PURPLE,
  //     green: Color.GREEN,
  //   },
  },
  // overrides: {
  //   MuiButton: {
  //     root: {
  //       borderRadius: '10px',
  //       FONT_FAMILY,
  //       fontSize: '12px',
  //       fontWeight: '700',
  //     },
  //     textSecondary: {
  //       color: COLOR.GRAY,
  //       fontWeight: 400,
  //     },
  //     contained: {
  //       boxShadow: '0px 0px 0px 0px',
  //       fontWeight: 700,
  //       letterSpacing: '-0.01em',
  //     },
  //     containedSecondary: {
  //       backgroundColor: Color.WHITE,
  //       color: Color.PURPLE,
  //       '&:hover': {
  //         backgroundColor: Color.BACKGROUND_GRAY,
  //       },
  //     },
  //     outlined: {
  //       borderWidth: '2px',
  //     },
  //     outlinedSecondary: {
  //       color: `${Color.WHITE}`,
  //       border: `2px solid ${Color.WHITE}`,
  //       '&:hover': {
  //         color: `${Color.WHITE}`,
  //         border: `2px solid ${Color.WHITE}`,
  //       },
  //     },
  //   },
  //},
});

export default theme;

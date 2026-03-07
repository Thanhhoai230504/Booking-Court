import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#006D38',
            light: '#00894A',
            dark: '#004D28',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#D4A017',
            light: '#E8B838',
            dark: '#B8880F',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#666666',
        },
        error: {
            main: '#E53935',
        },
        success: {
            main: '#43A047',
        },
        info: {
            main: '#1E88E5',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        subtitle1: {
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: '0.875rem',
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #D4A017 0%, #E8B838 100%)',
                    boxShadow: '0 2px 8px rgba(212, 160, 23, 0.35)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #B8880F 0%, #D4A017 100%)',
                        boxShadow: '0 4px 12px rgba(212, 160, 23, 0.5)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;

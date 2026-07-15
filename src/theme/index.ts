import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        background: {
            default: "#F7F8FC",
            paper: "#FFFFFF"
        },

        primary: {
            main: "#2563EB"
        },

        text: {
            primary: "#111827",
            secondary: "#6B7280"
        }

    },

    typography: {

        fontFamily: "Inter",

        h1: {
            fontSize: 34,
            fontWeight: 700
        },

        h2: {
            fontSize: 28,
            fontWeight: 700
        },

        h3: {
            fontSize: 22,
            fontWeight: 600
        },

        body1: {
            fontSize: 15
        },

        button: {
            textTransform: "none",
            fontWeight: 600
        }

    },

    shape: {
        borderRadius: 16
    }

})

export default theme
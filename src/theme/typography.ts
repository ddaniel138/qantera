
import { ThemeOptions } from '@mui/material/styles';

const typography: ThemeOptions['typography'] = {
    fontFamily: "var(--font-primary)",

    h1:{
        fontSize:40,
        fontWeight:700
    },

    h2:{
        fontSize:32,
        fontWeight:700
    },

    h3:{
        fontSize:24,
        fontWeight:600
    },

    h4:{
        fontSize:20,
        fontWeight:600
    },

    body1:{
        fontSize:16
    },

    body2:{
        fontSize:14
    },

    button:{
        fontWeight:600,
        textTransform:"none"
    }

}

export default typography;
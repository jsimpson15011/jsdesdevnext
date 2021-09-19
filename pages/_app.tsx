import React from 'react';
import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { StyledThemeProvider } from "@definitions/styled-components";
import { Provider } from 'react-redux'
import store from '@redux/store'
import "../public/global-variables.css"


function MyApp({ Component, pageProps }: AppProps): JSX.Element {

    return (
        <StyledThemeProvider>
<Provider store={store}>
        <Component {...pageProps} />
        </Provider>
</StyledThemeProvider>
    );
}

export default MyApp;

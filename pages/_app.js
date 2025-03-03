import Head from 'next/head';
import { useRouter } from 'next/router';
import { StateContext } from "@/context/StateContext";
import { createGlobalStyle } from 'styled-components';
import GlobalStyle from '@/styles/globalStyles';
import Navbar from '@/components/Dashboard/Navbar';
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideNavbarRoutes = ['/auth/login', '/auth/signup'];

  return (
    <>
      <Head>
        <title>TeamRides</title>
        <meta name='description' content='Carpooling made easy for clubs'/>
        <meta name='robots' content='index, follow'/>
      </Head>

      <GlobalStyle />

      <StateContext>
        {!hideNavbarRoutes.includes(router.pathname) && <Navbar />}

        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
          <Component {...pageProps} />
        </LoadScript>
      </StateContext>
    </>
  );
}

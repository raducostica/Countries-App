import "../styles/globals.css";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Layout = styled.div`
  max-width: 840px;
  margin: 16px auto;
`;

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

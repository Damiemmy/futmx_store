import { Outlet } from "react-router-dom";

import Header from "../components/header/header";
import Footer from "../components/footer/footer";

const WebsiteLayout = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default WebsiteLayout;
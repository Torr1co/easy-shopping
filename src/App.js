//////////////////////////////////////////FIREBASE
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";

//////////////////////////////////////////Extras
import {
  ConfigProvider,
  DatePicker,
  Space,
  Layout,
  Menu,
  Divider,
  Button,
} from "antd";
import "antd/dist/antd.less";

import "moment/locale/es-us";
import locale from "antd/es/locale/es_ES";
import moment from "moment";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
////////////////////////////////////////// Locale
import "./App.less";
import "./App.css";
import ShopSketch from "./components/ShopSketch";
import ShopForm from "./components/ShopForm";
//////////////////////////////////////////COMPONENTS

const firebaseConfig = {
  apiKey: "AIzaSyBtLemS0BQUQnSsFzKbjrFQaeoxsC74GyI",
  authDomain: "shop-analysis-81491.firebaseapp.com",
  projectId: "shop-analysis-81491",
  storageBucket: "shop-analysis-81491.appspot.com",
  messagingSenderId: "33393107270",
  appId: "1:33393107270:web:5b7ee700d0f8ff20a04547",
  measurementId: "G-EE5E2BNDRW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

////////////////// FUNCTIONS
const picked = (value, datePicker) => {
  console.log("Formatted Selected Time: ", datePicker);
  const y = datePicker.slice(0, 4);
  const w = datePicker.slice(-3, -1);

  var date = new Date(y, 0, 1 + (w - 2) * 7);
  var actDay = date.getDay();
  var monday = date;
  if (actDay <= 4) monday.setDate(date.getDate() - date.getDay() + 1);
  else monday.setDate(date.getDate() + 8 - date.getDay());
  console.log(monday);
};

////////////////// APP
const { Header, Content, Footer } = Layout;
function App() {
  const [IsOpen, setIsOpen] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [shopSketches, setShopSketches] = useState([]);
  // data
  //const [dataSource, setDataSource] = useState(initialState)
  moment.locale("es-us", {
    week: {
      dow: 1,
    },
  });

  /////////////////////
  const addShopSketch = (shopSketch) => {
    setShopSketches([...shopSketches, shopSketch]);
  };

  return (
    <ConfigProvider locale={locale}>
      <Layout>
        <nav>
          <p className="welcome">Inicia sesion para comenzar</p>
          {/* <img src="#" alt="Logo" className="logo" /> */}
          <Button type="primary" size="large">
            Comenzar{" "}
          </Button>{" "}
          {/*&rarr;*/}
        </nav>

        <Content className="content">
          <h1>Selecciona Fecha y Negocio</h1>
          <Space className="space">
            <DatePicker
              picker="week"
              onChange={picked}
              syle={{ color: "#c69963" }}
            />
            <DatePicker picker="month" disabled />
          </Space>

          {/* ---------------CONTENIDO -------------*/}
          <div className="layout__content">
            <div className="shops">
              {shopSketches.map((name, index) => (
                <ShopSketch name={name} key={index} />
              ))}

              <Button
                className="shop dashed"
                type="dashed"
                onClick={() => setIsOpen(true)}
              >
                <ion-icon name="add-outline" size="big" on></ion-icon>
              </Button>

              <ShopForm
                open={IsOpen}
                setOpen={setIsOpen}
                addShops={addShopSketch}
              />

              {/* <DateInfo /> */}
            </div>
            <Button type="primary" style={{ float: "right" }} disabled>
              Continuar
            </Button>
          </div>

          {/* <Divider />

          <h1>Analisis y Graficos</h1>
          <div className="layout__content"></div> */}
        </Content>
        <Footer>Shop administration ©2021 Created by Fabrizio Torrico</Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;

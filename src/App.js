/// ///////////////////////////////////////FIREBASE
import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

/// ///////////////////////////////////////Extras
import { ConfigProvider, Layout, Button } from 'antd';
import 'antd/dist/antd.less';

import 'moment/locale/es-us';
import locale from 'antd/es/locale/es_ES';
import moment from 'moment';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
/// /////////////////////////////////////// Locale
import './App.less';
import './App.css';
import Home from './components/Home';
import Shop from './components/Shop';

/// ///////////////////////////////////////COMPONENTS

const firebaseConfig = {
  apiKey: 'AIzaSyBtLemS0BQUQnSsFzKbjrFQaeoxsC74GyI',
  authDomain: 'shop-analysis-81491.firebaseapp.com',
  projectId: 'shop-analysis-81491',
  storageBucket: 'shop-analysis-81491.appspot.com',
  messagingSenderId: '33393107270',
  appId: '1:33393107270:web:5b7ee700d0f8ff20a04547',
  measurementId: 'G-EE5E2BNDRW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

/// /////////////// APP
const { Header, Content, Footer } = Layout;
function App() {
  const [user, loading, error] = useAuthState(auth);
  const [selectedDate, setSelectedDate] = useState(false);
  const [selectedShop, setSelectedShop] = useState(false);
  const [shopSketches, setShopSketch] = useState({});

  const addShopSketch = (shopSketch) => {
    console.log('shopSketch:  ', shopSketch);
    setShopSketch(Object.assign(shopSketches, shopSketch));
    console.log('shopSketches: ', shopSketches);
  };

  moment.locale('es-us', {
    week: {
      dow: 1,
    },
  });

  return (
    <ConfigProvider locale={locale}>
      <Router>
        {/* ------- lo hace español */}
        <Layout>
          <Header>
            <nav>
              <p className="welcome">Inicia sesion para comenzar</p>
              {/* <img src="#" alt="Logo" className="logo" /> */}
              <Button type="primary" size="large">
                Comenzar
              </Button>
              {/* &rarr; */}
            </nav>
          </Header>

          <Content className="content">
            <Switch>
              <Route exact path="/">
                <Home
                  setSelectedShop={setSelectedShop}
                  setSelectedDate={setSelectedDate}
                  continueButton={Boolean(selectedDate && selectedShop)}
                  addShopSketch={addShopSketch}
                />
              </Route>
              <Route path="/shop">
                <Shop selectedDate={selectedDate} selectedShop={shopSketches[selectedShop]} />
              </Route>
            </Switch>
          </Content>
          <Footer>Shop administration ©2021 Created by Fabrizio Torrico</Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;

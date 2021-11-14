import React, { useState, useEffect } from 'react';
/// ///////////////////////////////////////Firebase
import { GooglePopup, auth } from './firebase-config';
import { signOut } from '@firebase/auth';
/// ///////////////////////////////////////
import { ConfigProvider, Layout, Button, message } from 'antd';
import 'antd/dist/antd.less';

import 'moment/locale/es-us';
import locale from 'antd/es/locale/es_ES';
import moment from 'moment';

import { Redirect, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
/// /////////////////////////////////////// Locale
import './App.less';
import './App.css';
import Home from './components/Home';
import ShopComplete from './components/ShopComplete';
import logo from './img/shop__logo.jpg';

/// ///////////////////////////////////////COMPONENTS

// setPersistence(auth, browserSessionPersistence);
/// /////////////// APP
// GETTERS & UPLOADS ... FROM FIREBASE
// ADD ... FROM LOCAL SETTERS
const { Content, Footer } = Layout;

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(false);
  const [selectedShop, setSelectedShop] = useState(false);
  const [shopSketches, setShopSketch] = useState({});

  const addShopSketch = (shopSketch) => {
    setShopSketch(Object.assign(shopSketches, shopSketch));
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
    return () => {
      setError('');
    };
  }, [error]);

  moment.locale('es-us', {
    week: {
      dow: 1,
    },
  });

  const WelcomeMessage = () => {
    if (user) {
      return (
        <nav>
          <p className="welcome">Buenos Días, {user.displayName}</p>
          <img src={logo} alt="Logo" className="logo" />
          <Button type="primary" size="large" onClick={() => signOut(auth)}>
            Cerrar Sesión
          </Button>
        </nav>
      );
    }

    return (
      <nav>
        <p className="welcome">Inicia sesion para comenzar</p>
        <img src={logo} alt="Logo" className="logo" />
        <Button type="primary" size="large" onClick={() => GooglePopup(setUser, setError)}>
          Comenzar
        </Button>
        {/*  */}
      </nav>
    );
  };

  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/',
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  };

  return (
    <ConfigProvider locale={locale}>
      <Router>
        {/* ------- lo hace español */}
        <Layout style={{ minHeight: '100vh' }}>
          <WelcomeMessage />

          <Content className="content">
            <Switch>
              <Route exact path="/">
                <Home
                  user={user}
                  selectedShop={selectedShop}
                  setSelectedShop={setSelectedShop}
                  setSelectedDate={setSelectedDate}
                  continueButton={Boolean(selectedDate && selectedShop)}
                  addShopSketch={addShopSketch}
                />
              </Route>
              <PrivateRoute path="/shop">
                <ShopComplete
                  user={user}
                  selectedDate={selectedDate}
                  selectedShop={shopSketches[selectedShop]}
                  shopName={selectedShop}
                />
              </PrivateRoute>
            </Switch>
          </Content>
          <Footer>Shop administration ©2021 Created by Fabrizio Torrico</Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;

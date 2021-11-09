import React, { useState, useEffect } from 'react';
/// ///////////////////////////////////////Firebase
import { GooglePopup, auth, checkUser, getShopNames } from './firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from '@firebase/auth';
/// ///////////////////////////////////////
import { ConfigProvider, Layout, Button } from 'antd';
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
  const [user, loading, error] = useAuthState(auth);
  const [selectedDate, setSelectedDate] = useState(false);
  const [selectedShop, setSelectedShop] = useState(false);
  const [shopSketches, setShopSketch] = useState({});

  const addShopSketch = (shopSketch) => {
    setShopSketch(Object.assign(shopSketches, shopSketch));
  };

  moment.locale('es-us', {
    week: {
      dow: 1,
    },
  });

  const WelcomeMessage = () => {
    if (error) {
      return (
        <div>
          <p>Error: {error}</p>
        </div>
      );
    }
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
    } else {
      return (
        <nav>
          <p className="welcome">Inicia sesion para comenzar</p>
          <img src={logo} alt="Logo" className="logo" />
          <Button type="primary" size="large" onClick={() => GooglePopup()}>
            Comenzar
          </Button>
          {/*  */}
        </nav>
      );
    }
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
        <Layout>
          <WelcomeMessage />

          <Content className="content">
            <Switch>
              <Route exact path="/">
                <Home
                  user={user}
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

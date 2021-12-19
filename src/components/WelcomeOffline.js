import React from 'react';

import { GooglePopup } from '../firebase-config';
import { Button } from 'antd';

import chartImg from '../img/analizar ventas-min.jpg';
import paymentImg from '../img/gestionar-pagos-min.jpg';
import notesImg from '../img/guardar-notas-min.jpg';
import home__image from '../img/home_shopping-image.jpg';
import logo from '../img/shop__logo.jpg';

import '../style/welcomeOffline.css';

export const WelcomeOffline = ({ setUser, setError }) => {
  return (
    <div className="headerOffline">
      <div className="message">
        <h4>bienvenido al alpha de shop administration</h4>
      </div>
      <header
        style={{
          backgroundImage: `linear-gradient(rgba(16, 29, 44, 0.93), rgba(16, 29, 44, 0.93)), url(${home__image})`,
        }}
        className="header"
      >
        <img src={logo} alt="Logo" className="header__logo" />
        <h3>facil y seguro</h3>
        <h1>Administra tu Negocio</h1>
        <Button
          type="primary"
          style={{
            justifySelf: 'start',
            alignSelf: 'start',
            width: '20rem',
            height: '4rem',
            textTransform: 'uppercase',
            fontSize: '1.5rem',
          }}
          onClick={() => GooglePopup(setUser, setError)}
        >
          Comenzar
        </Button>
        <div className="header__spacer">utilizado en</div>
      </header>
      <div className="sideInfo">
        <h3>Shop administration permite:</h3>
        <div className="sideInfo__list">
          <img src={paymentImg} alt="" className="sideInfo__img" />
          <h4>Gestionar pagos</h4>
          <img src={notesImg} alt="" className="sideInfo__img" />
          <h4>Guardar Notas</h4>
          <img src={chartImg} alt="" className="sideInfo__img" />
          <h4>Analizar tus ventas</h4>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOffline;

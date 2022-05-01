import React, { useState, useEffect } from 'react';
import { DatePicker, Space, Button, Radio, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom';

import {
  checkUser,
  getShopData,
  initializeSelectedShop,
  deleteShopName,
} from '../firebase-config.js';
import ShopSketch from './ShopSketch';
import ShopForm from './ShopForm';

import '../style/home.css';

const feature__icon = {
  color: '#c69963',
  width: '4.5rem',
  height: ' 4.5rem',
  gridRow: '1 / span 2',
  transform: 'translateY(-1rem)',
};

const Home = ({
  selectedShop,
  setSelectedDate,
  setSelectedShop,
  continueButton,
  addShopSketch,
  user,
}) => {
  //boolean para modal y para los nombres de los negocios
  const [IsOpen, setIsOpen] = useState(false);
  const [shopNames, setShopNames] = useState([]);
  const [deleteShop, setDeleteShop] = useState(false);

  const addShopName = (shopName) => {
    setShopNames([...shopNames, shopName]);
  };

  useEffect(() => {
    if (user) {
      message.loading('cargando data del usuario...');
      checkUser(user.uid);
      getShopData(setShopNames, addShopSketch) //get SHOPSSS data
        .then(() => message.success('cargado con exito'))
        .catch((error) => message.error(error));
    }
    // return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  //pone el picker de la semana en lunes
  const datePicked = (value, datePicker) => {
    const y = datePicker.slice(0, 4);
    const w = datePicker.slice(-3, -1);

    const date = new Date(y, 0, 1 + (w - 2) * 7);
    const actDay = date.getDay();
    const monday = date;
    if (actDay <= 4) monday.setDate(date.getDate() - date.getDay() + 1);
    else monday.setDate(date.getDate() + 8 - date.getDay());

    setSelectedDate(monday);
  };

  return user ? (
    <div>
      <h2>Selecciona Fecha y Negocio</h2>
      <Space className="space">
        <DatePicker picker="week" onChange={datePicked} />
        <DatePicker picker="month" disabled />
        <Button danger onClick={() => setDeleteShop(!deleteShop)}>
          <ion-icon
            style={{ color: 'red', fontSize: '18px' }}
            name={deleteShop ? 'close-outline' : 'trash-outline'}
          ></ion-icon>
        </Button>
      </Space>

      {/* ---------------CONTENIDO -------------*/}
      <div className="layout__content">
        {/* seleccion un shop y mapea los nombre */}
        <Radio.Group
          className="shops"
          onChange={(e) => {
            const selected = e.target.value;
            setSelectedShop(selected);
            initializeSelectedShop(selected);
          }}
        >
          {shopNames.map((name, index) => (
            <ShopSketch
              name={name}
              key={index}
              deleteShop={deleteShop}
              selectedShop={selectedShop}
            />
          ))}

          {/* boton de modal */}
          <Button className="shop dashed" type="dashed" onClick={() => setIsOpen(true)}>
            <ion-icon name="add-outline" size="big" on />
          </Button>

          <ShopForm
            open={IsOpen}
            setOpen={setIsOpen}
            addShopName={addShopName}
            addShopSketch={addShopSketch}
            shopNames={shopNames}
          />
        </Radio.Group>

        {deleteShop ? (
          <Popconfirm
            title="Estas seguro que quieres eliminar la plantilla?"
            onConfirm={() => {
              message.loading('eliminando plantilla de negocio...');
              setShopNames(shopNames.filter((shopName) => shopName !== selectedShop));
              deleteShopName(selectedShop)
                .then(() => message.success('plantilla eliminada con exito'))
                .catch((error) => {
                  message.error(error);
                });
            }}
            okText="Si"
            cancelText="No"
          >
            <Button
              style={{ marginTop: '32px' }}
              type="primary"
              disabled={`${selectedShop ? '' : 'disabled'}`}
              danger
            >
              Eliminar
            </Button>
          </Popconfirm>
        ) : (
          <Link to="/shop/weekinfo">
            <Button
              type="primary"
              style={{ marginTop: '32px' }}
              disabled={`${continueButton ? '' : 'disabled'}`}
            >
              Continuar
            </Button>
          </Link>
        )}
      </div>
    </div>
  ) : (
    <section className="features">
      <div className="feature">
        <ion-icon name="checkmark-circle-outline" style={feature__icon}></ion-icon>
        <h4>Obten privilegios por ser usuario primerizo!</h4>
        <p className="feature__text">
          Podras utilizar nuevas funcionalidades de primera mano antes que cualquier otro usuario.
        </p>
      </div>
      <div className="feature">
        <ion-icon name="trending-up-outline" style={feature__icon}></ion-icon>
        <h4>Renovaciones y mejoras constantes</h4>
        <p className="feature__text">
          Se iran agregando y retocando caracterizticas para que nuestros consumidores tengan un
          poco de frescura. Estas estarán basadas en las opiniones de nuestros clientes y marketing
          online.
        </p>
      </div>
      <div className="feature">
        <ion-icon name="chatbubbles-outline" style={feature__icon}></ion-icon>
        <h4>Nos importa tu opinion</h4>
        <p className="feature__text">
          Nos complace escuchar sus sugerencias y dudas. la aplicacion posee mantenimiento y
          atencion al cliente las 24 horas para garantizar la satisfaccion al cliente.
        </p>
      </div>

      <div className="feature">
        <ion-icon name="bar-chart-outline" style={feature__icon}></ion-icon>
        <h4>Graficas de acuerdo a tus necesidades</h4>
        <p className="feature__text">Graficas basadas en temporalidades</p>
      </div>
      <div className="feature">
        <ion-icon name="lock-closed-outline" style={feature__icon}></ion-icon>
        <h4>Privacidad y Seguridad</h4>
        <p className="feature__text">
          Tus datos se encuentran resguardados con diferentes modelos de proteccion, puedes estar
          seguro que nadie robará la información
        </p>
      </div>
      <div className="feature">
        <ion-icon name="build-outline" style={feature__icon}></ion-icon>
        <h4>Administra según tus propios criterios!</h4>
        <p className="feature__text">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur distinctio
          necessitatibus pariatur voluptatibus.
        </p>
      </div>
    </section>
  );
};
export default Home;

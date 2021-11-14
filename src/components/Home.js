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
      getShopData(setShopNames, addShopSketch)
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
      <h1>Selecciona Fecha y Negocio</h1>
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
    <div>
      <h1>Bienvenido a la primera version de Administracion de Negocio!</h1>
    </div>
  );
};
export default Home;

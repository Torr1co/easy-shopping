import React, { useState, useEffect } from 'react';
import { DatePicker, Space, Button, Radio } from 'antd';
import { Link } from 'react-router-dom';

import { checkUser, getShopData, initializeSelectedShop } from '../firebase-config.js';
import ShopSketch from './ShopSketch';
import ShopForm from './ShopForm';

const Home = ({ setSelectedDate, setSelectedShop, continueButton, addShopSketch, user }) => {
  //boolean para modal y para los nombres de los negocios
  const [IsOpen, setIsOpen] = useState(false);
  const [shopNames, setShopNames] = useState([]);

  const addShopName = (shopName) => {
    setShopNames([...shopNames, shopName]);
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      checkUser(user.uid);
      getShopData(setShopNames, addShopSketch);
    }
    // return () => {};
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
            <ShopSketch name={name} key={index} />
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
        <Link to="/shop/weekinfo">
          <Button
            type="primary"
            style={{ float: 'right' }}
            disabled={`${continueButton ? '' : 'disabled'}`}
          >
            Continuar
          </Button>
        </Link>
      </div>
    </div>
  ) : (
    <div>
      <h1>Bienvenido a la primera version de Administracion de Negocio!</h1>
    </div>
  );
};
export default Home;

import React, { useState } from 'react';
import { DatePicker, Space, Button, Radio } from 'antd';
import { Link } from 'react-router-dom';
import ShopSketch from './ShopSketch';
import ShopForm from './ShopForm';

const Home = ({ setSelectedDate, setSelectedShop, continueButton, addShopSketch }) => {
  const [IsOpen, setIsOpen] = useState(false);
  const [shopNames, setShopName] = useState([]);

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

  const addShopName = (shopName) => {
    setShopName([...shopNames, shopName]);
  };

  return (
    <div>
      <h1>Selecciona Fecha y Negocio</h1>
      <Space className="space">
        <DatePicker picker="week" onChange={datePicked} syle={{ color: '#c69963' }} />
        <DatePicker picker="month" disabled />
      </Space>

      {/* ---------------CONTENIDO -------------*/}
      <div className="layout__content">
        <Radio.Group className="shops" onChange={(e) => setSelectedShop(e.target.value)}>
          {shopNames.map((name, index) => (
            <ShopSketch name={name} key={index} />
          ))}

          <Button className="shop dashed" type="dashed" onClick={() => setIsOpen(true)}>
            <ion-icon name="add-outline" size="big" on />
          </Button>

          <ShopForm
            open={IsOpen}
            setOpen={setIsOpen}
            addShopName={addShopName}
            addShopSketch={addShopSketch}
          />
        </Radio.Group>
        <Link to="/shop">
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
  );
};
export default Home;

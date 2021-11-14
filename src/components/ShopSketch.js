import { Radio } from 'antd';
import { React } from 'react';
const ShopSketch = ({ name, selectedShop, deleteShop }) => {
  return (
    <Radio.Button
      value={name}
      className={`shop ${deleteShop ? 'shop-delete' : ''}`}
      style={
        selectedShop === name && deleteShop
          ? {
              border: '2.5px solid #ff4d4f',
              color: '#ff4d4f',
            }
          : { borderWidth: '2.5px' }
      }
    >
      <p>{name}</p>
      <ion-icon name="wallet-outline" size="big"></ion-icon>
    </Radio.Button>
  );
};

export default ShopSketch;

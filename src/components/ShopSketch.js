import { Radio } from 'antd';
import { React, useRef, useEffect } from 'react';
const ShopSketch = ({ name }) => {
  const shopRef = useRef();

  /* useEffect(() => {
    const actShop = shopRef.current;
    if (actShop.props.checked) {
    }
  }); */

  return (
    <Radio.Button ref={shopRef} value={name} className="shop" style={{ borderWidth: '2.5px' }}>
      <p>{name}</p>
      <ion-icon name="wallet-outline" size="big"></ion-icon>
    </Radio.Button>
  );
};

export default ShopSketch;

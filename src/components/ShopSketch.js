import { Radio } from "antd";
const ShopSketch = ({ name }) => {
  return (
    <Radio.Button value={name} className="shop" style={{ borderWidth: "3px" }}>
      <p>{name}</p>
      {<ion-icon name="wallet-outline" size="big"></ion-icon>}
    </Radio.Button>
  );
};

export default ShopSketch;

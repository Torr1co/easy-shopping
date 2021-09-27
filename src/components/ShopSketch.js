import { Button } from "antd";
const ShopSketch = ({ name }) => {
  return (
    <Button className="shop" style={{ borderWidth: "3px" }}>
      <p>{name}</p>
      <ion-icon name="wallet-outline" size="big"></ion-icon>
    </Button>
  );
};

export default ShopSketch;

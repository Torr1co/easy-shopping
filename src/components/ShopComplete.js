import ShopTable from './ShopTable';
import React, { useState, useEffect } from 'react';

const ShopComplete = ({ selectedShop, selectedDate, shopName }) => {
  // OBTENER DIAS DE LA SEMANA
  const [weekKeys, setWeekKeys] = useState(
    [...Array(7)].map((_, i) => {
      const dayAux = new Date(selectedDate);
      dayAux.setDate(selectedDate.getDate() + i);
      return dayAux.toJSON().slice(0, 10);
    }),
  );

  // OBTENER DATA PARA LA TABLA
  // Tabledata = [dayKey:[data] * 7 dias de la semana]
  const [weekDataSource, setWeekDataSource] = useState(
    weekKeys.reduce((prev, dayKey) => {
      const auxObj = {};
      auxObj[dayKey] = [...Array(3)].map((_, i) => {
        return {
          ...selectedShop
            .map((obj) => obj.dataIndex)
            .reduce((a, v) => ({ ...a, [v]: `data ${i}` }), {}),
          key: i,
        };
      });
      return Object.assign(prev, auxObj);
    }, {}),
  );
  // console.log(weekDataSource);
  useEffect(() => {
    console.log(weekDataSource);
  }, [weekDataSource]);
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{shopName}</h1>
      {/* <Button
        onClick={this.handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Añade una fila
      </Button> */}
      {weekKeys.map((dayKey, i) => (
        <ShopTable
          selectedShop={selectedShop}
          dataSource={weekDataSource[dayKey]}
          setDataSource={setWeekDataSource}
          dayKey={dayKey}
          index={i}
        />
      ))}
    </div>
  );
};

export default ShopComplete;

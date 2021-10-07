import ShopTable from './ShopTable';
import React, { useState } from 'react';

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
  const [tableDataSource, setTableDataSource] = useState(
    [...Array(2)].map((_, i) => {
      return {
        ...selectedShop
          .map((obj) => obj.dataIndex)
          .reduce((a, v) => ({ ...a, [v]: `data ${i}` }), {}),
        key: i,
      };
    }),
  );

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
      <ShopTable
        selectedShop={selectedShop}
        dataSource={tableDataSource}
        setDataSource={setTableDataSource}
      />
    </div>
  );
};

export default ShopComplete;

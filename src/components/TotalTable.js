import React from 'react';
import { Table } from 'antd';
const TotalTable = ({ dataSource, weekKeys, selectedShop }) => {
  // OBTENER TOTAL Y BALANCE
  const totalColumns = [...selectedShop, { title: 'operacion', dataIndex: 'operacion' }];

  const getTotal = () => {
    //creas un objeto incializado en 0 para la dataSource de la tabla
    const totalData = selectedShop.reduce((prev, title) => {
      const objAux = {};
      objAux[title.dataIndex] = 0;
      return Object.assign(prev, objAux);
    }, {});

    //iteras por toda la data y sumas al total
    weekKeys.forEach((dayKey) => {
      dataSource[dayKey].forEach((dayData) => {
        for (const title of Object.keys(totalData)) {
          //si es un numero sumar al total. (en el codigo es: si no es un no numero)
          if (!isNaN(dayData[title])) {
            totalData[title] += +dayData[title];
          }
        }
      });
    });
    //se le agrega la info y la key requeridas
    return [Object.assign(totalData, { operacion: 'total', key: 0 })];
  };
  return (
    <Table
      style={{ border: '2px #c69963 solid' }}
      columns={totalColumns}
      // summary={getTotal}
      dataSource={getTotal()}
      pagination={{ position: ['none', 'none'] }}
      summary={(pageData) => {
        let Balance = 0;

        pageData.forEach((e) => {
          for (const value of Object.values(e)) {
            if (!isNaN(value)) {
              Balance += +value;
            }
          }
        });

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2}>{Balance}</Table.Summary.Cell>
              <Table.Summary.Cell>Balance</Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
};

export default TotalTable;

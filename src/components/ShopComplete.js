import React, { useEffect, useState } from 'react';
import { PageHeader, Button } from 'antd';
import { Link, Switch, Route } from 'react-router-dom';
/////////////////////////////////7
import ShopTable from './ShopTable';
import TotalTable from './TotalTable';
import ShopChart from './ShopChart';
import { getDayData, getMonthData, uploadDayData, uploadMonthData } from '../firebase-config';

const ShopComplete = ({ selectedShop, selectedDate, shopName, user }) => {
  // OBTENER DIAS DE LA SEMANA
  const weekKeys = [...Array(7)].map((_, i) => {
    const dayAux = new Date(selectedDate);
    dayAux.setDate(selectedDate.getDate() + i);
    return dayAux.toJSON().slice(0, 10);
  });

  // OBTENER DATA PARA LA TABLA
  // weekDataSource = {dayKey:[data] * 7 dias de la semana}
  const [weekDataSource, setWeekDataSource] = useState(
    weekKeys.reduce((prev, dayKey) => {
      const auxObj = {};
      auxObj[dayKey] = [...Array(2)].map((_, i) => {
        return {
          ...selectedShop.map((obj) => obj.dataIndex).reduce((a, v) => ({ ...a, [v]: '-' }), {}),
          key: i,
        };
      });
      return Object.assign(prev, auxObj);
    }, {}),
  );

  useEffect(() => {
    if (user) {
      (async () => {
        console.log(weekKeys.slice(1));
        const response = await getDayData(weekKeys[0]);
        if (response) {
          console.log('res: ', response);
          const newData = {};
          newData[weekKeys[0]] = response;

          await weekKeys.slice(1).reduce(async (prev, dayKey) => {
            await prev;
            const auxObj = {};
            const data = await getDayData(dayKey);
            auxObj[dayKey] = data;
            Object.assign(newData, auxObj);
            return Promise.resolve();
          }, Promise.resolve());

          console.log(weekDataSource);
          setWeekDataSource(newData);
          console.log('fin');
        }
      })();
    }
  }, [user]);

  //poner el mes seleccionado (chequeanado el primer dia de la semana con el ultimo)
  const selectedMonth =
    weekKeys[0] !== weekKeys[weekKeys.length - 1]
      ? weekKeys[weekKeys.length - 1].slice(0, 7)
      : weekKeys[0].slice(0, 7);

  //obtener mes para los graficos-> {fecha: [0, 0...0]}
  const [monthDataSource, setMonthDataSource] = useState(() => {
    const objAux = {};
    objAux[selectedMonth] = [...Array(31)].fill(0);
    return objAux;
  });

  // ver si cambian los datos desde shopTable
  /* useEffect(() => {
    // console.log(weekDataSource);
  }, [weekDataSource]); */
  return (
    <div>
      <PageHeader
        className="site-page-header"
        backIcon={
          <Link to="/">
            <ion-icon
              name="arrow-back-outline"
              style={{ fontSize: '24px', color: 'black' }}
            ></ion-icon>
          </Link>
        }
        onBack={() => <Link to="/" />}
        title="Informacion Semanal"
        style={{ padding: '0 0 24px 0', margin: '-30px 0 0 0' }}
        extra={[
          <Link to="/shop/weekInfo">
            <Button type="primary">Tabla</Button>
          </Link>,
          <Link to="/shop/charts">
            <Button>Graficos</Button>
          </Link>,
        ]}
      />
      <Switch>
        <Route exact path="/shop/weekInfo">
          <h1 style={{ textAlign: 'center' }}>{shopName}</h1>

          {weekKeys.map((dayKey, i) => (
            <ShopTable
              selectedShop={selectedShop}
              weekDataSource={weekDataSource}
              setWeekDataSource={setWeekDataSource}
              monthDataSource={monthDataSource}
              setMonthDataSource={setMonthDataSource}
              dayKey={dayKey}
              index={i}
              key={i}
            />
          ))}

          <TotalTable dataSource={weekDataSource} weekKeys={weekKeys} selectedShop={selectedShop} />
        </Route>

        <Route exact path="/shop/charts">
          <ShopChart monthData={monthDataSource[selectedMonth]} selectedMonth={selectedMonth} />
        </Route>
      </Switch>
      <Button
        type="primary"
        style={{ marginTop: '32px', float: 'right' }}
        onClick={() => {
          // SUBIR LA DATA PARA CADA DIA
          for (const [key, value] of Object.entries(weekDataSource)) {
            uploadDayData(key, { weekTableData: value });
          }
        }}
      >
        Guardar cambios
      </Button>
    </div>
  );
};

export default ShopComplete;

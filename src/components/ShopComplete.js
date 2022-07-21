import React, { useEffect, useState } from 'react';
import { PageHeader, Button, message } from 'antd';
import { Link, Switch, Route, useLocation } from 'react-router-dom';
/////////////////////////////////7
import ShopTable from './ShopTable';
import TotalTable from './TotalTable';
import ShopChart from './ShopChart';
import { getDayData, getMonthData, uploadDayData, uploadMonthData } from '../firebase-config';

const ShopComplete = ({ selectedShop, selectedDate, shopName, user }) => {
  //locaciones
  const pathTable = '/shop/weekInfo';
  const pathChart = '/shop/charts';

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

  //poner el mes seleccionado (chequeanado el primer dia de la semana con el ultimo)
  const selectedMonth =
    weekKeys[0] !== weekKeys[weekKeys.length - 1]
      ? weekKeys[weekKeys.length - 1].slice(0, 7)
      : weekKeys[0].slice(0, 7);

  //obtener mes para los graficos-> {fecha: [0, 0...0]}
  const [monthDataSource, setMonthDataSource] = useState(() => [...Array(31)].fill(0));

  useEffect(() => {
    if (user) {
      message.loading('verificando data del negocio...');
      (async () => {
        //obtiene la data del mes
        const fetchedMonthData = await getMonthData(selectedMonth);
        if (fetchedMonthData) setMonthDataSource(fetchedMonthData);

        //prueba obtener data del primer dia de la semana
        const response = await getDayData(weekKeys[0]);
        if (response) {
          const fetchedDayData = {};
          //primer día en la data traída
          fetchedDayData[weekKeys[0]] = response;

          //esperar que la data traída del día anterior termine para traer la del siguiente
          await weekKeys.slice(1).reduce(async (prev, dayKey) => {
            await prev;
            const auxObj = {};
            const data = await getDayData(dayKey);
            auxObj[dayKey] = data;
            Object.assign(fetchedDayData, auxObj);
            return Promise.resolve();
          }, Promise.resolve());
          setWeekDataSource(fetchedDayData);
        }
        // const newMonthData = weekKeys[0] !== weekKeys[weekKeys.length - 1] ?
        //    await getMonthData()
      })()
        .then(() => message.success('data conectada con exito'))
        .catch((error) => message.error(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const ShopNav = () => {
    let location = useLocation().pathname;
    return (
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
        title="Inicio"
        style={{ padding: '0 0 24px 0', margin: '-30px 0 0 0' }}
        extra={[
          <Link to={pathTable} key="0">
            <Button type={location === pathTable ? 'primary' : ''}>Tabla</Button>
          </Link>,
          <Link to={pathChart} key="1">
            <Button type={location === pathChart ? 'primary' : ''}>Graficos</Button>
          </Link>,
        ]}
      />
    );
  };

  return (
    <div>
      <ShopNav />
      <Switch>
        <Route exact path={pathTable}>
          <h2 style={{ textAlign: 'center' }}>{shopName}</h2>
          <div className="shoptable__wrapper">
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
            <TotalTable
              dataSource={weekDataSource}
              weekKeys={weekKeys}
              selectedShop={selectedShop}
            />
          </div>
        </Route>

        <Route exact path={pathChart}>
          <ShopChart monthData={monthDataSource} selectedMonth={selectedMonth} />
        </Route>
      </Switch>
      <Button
        type="primary"
        size="large"
        style={{ marginTop: '32px', float: 'right' }}
        onClick={() => {
          message.loading('subiendo la data...');
          // SUBIR LA DATA PARA CADA DIA
          (async () => {
            for (const [key, value] of Object.entries(weekDataSource)) {
              await uploadDayData(key, { weekTableData: value });
            }
            await uploadMonthData(selectedMonth, { monthChartData: monthDataSource });
          })()
            .then(() => message.success('data subida con exito'))
            .catch((error) => message.error(error));
        }}
      >
        Guardar cambios
      </Button>
    </div>
  );
};

export default ShopComplete;

import React from 'react';
import { Bar } from 'react-chartjs-2';

const monthsName = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  // height: 350,
  // width: 700,
};
const ShopChart = ({ monthData, selectedMonth }) => {
  const data = {
    labels: Array(31)
      .fill(null)
      .map((_, i) => i + 1),

    datasets: [
      {
        label: 'Balance del mes',
        data: monthData,
        backgroundColor: 'rgba(255, 206, 86, 0.3)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1.5,
      },
    ],
  };
  console.log(monthData);

  return (
    <>
      <div className="header">
        <h1 style={{ textAlign: 'center' }}>
          {monthsName[+selectedMonth.slice(-2) - 1]} {selectedMonth.slice(0, 4)}
        </h1>
        <div
          style={{
            /* width: '800px', height: '500px', */ backgroundColor: 'white',
            padding: '30px',
          }}
        >
          <h2>Grafico de Barras</h2>
          <Bar data={data} options={options} />
        </div>
      </div>
    </>
  );
};

export default ShopChart;

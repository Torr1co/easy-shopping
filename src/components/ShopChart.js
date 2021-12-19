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
  const chartBackground = [];
  const chartBorder = [];
  monthData.forEach((value) => {
    if (value > 0) {
      chartBackground.push('rgb(128, 237, 153, 0.4)');
      chartBorder.push('#57cc99');
    } else {
      chartBackground.push('rgba(255, 99, 132, 0.4)');
      chartBorder.push('rgba(255, 99, 132, 1)');
    }
  });

  const data = {
    labels: Array(31)
      .fill(null)
      .map((_, i) => `dia ${i + 1}`),

    datasets: [
      {
        label: 'Balance del mes',
        data: monthData,
        backgroundColor: chartBackground,
        borderColor: chartBorder,
        borderWidth: 1.5,
      },
    ],
  };
  console.log(monthData);

  return (
    <>
      <div>
        <h2 style={{ textAlign: 'center' }}>
          {monthsName[+selectedMonth.slice(-2) - 1]} {selectedMonth.slice(0, 4)}
        </h2>
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

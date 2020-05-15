import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const InvertedColors = {
  fill: '#006dcc',
  background: '#2f2f2f',
  lineColor: '#DDD',
  tickColor: '#DDD',
  text: '#DDD',
};

const NormalColors = {
  fill: '#006dcc',
  background: '#FFF',
  lineColor: '#000',
  tickColor: '#000',
  text: '#000',
};

function MatchedWordsChart(
  {
    results, title, noDataMessage, width, inverted,
  },
) {
  // Process the data into what the charting library expects
  const categories = [];
  const data = [];

  if (results) {
    for (var key in results) {
      if (results.hasOwnProperty(key)) {
        categories.push(key);
        data.push(results[key])
      }
    }
  }

  // Determine the color scheme
  let colors = NormalColors;

  if (inverted) {
    colors = InvertedColors;
  }

  // Construct the options
  const options = {
    colors: [colors.fill],
    chart: {
      type: 'bar',
      backgroundColor: colors.background,
      width,
    },
    title: {
      text: title,
      style: { color: colors.text },
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories,
      title: {
        text: null,
      },
      labels: {
        style: { color: colors.text },
      },
      lineColor: colors.lineColor,
      tickColor: colors.tickColor,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Count',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
        style: {
          color: colors.text,
        },
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: 'Count',
        data,
      },
    ],
  };

  return (
    <>
      {data.length >= 0 && (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      )}
      {data.length === 0 && (
        noDataMessage
      )}
    </>
  );
};


MatchedWordsChart.propTypes = {
  results: PropTypes.shape.isRequired,
  title: PropTypes.string.isRequired,
  noDataMessage: PropTypes.string,
  width: PropTypes.number,
  inverted: PropTypes.bool,
};

MatchedWordsChart.defaultProps = {
  noDataMessage: 'No data matched',
  width: null,
  inverted: false,
};

export default MatchedWordsChart;

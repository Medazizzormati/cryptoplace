import React, { useEffect, useState, useRef } from 'react';

const LineChart = ({ historicalData }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 600, height: 250 });
  const containerRef = useRef(null);

  // Update dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        setDimensions({
          width: Math.min(containerWidth, 600),
          height: Math.min(containerHeight, 250)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (historicalData && historicalData.prices) {
      try {
        // Process data for custom chart
        const processedData = historicalData.prices.map((item, index) => ({
          x: index,
          y: item[1],
          date: new Date(item[0]).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        }));
        setChartData(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing chart data:', error);
        setIsLoading(false);
      }
    }
  }, [historicalData]);

  // Show loading state if no data
  if (isLoading || !historicalData || !historicalData.prices || historicalData.prices.length === 0) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          width: '100%',
          color: '#e3e3e3' 
        }}
      >
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          width: '100%',
          color: '#e3e3e3' 
        }}
      >
        <p>No chart data available</p>
      </div>
    );
  }

  // Calculate chart dimensions and scales
  const { width, height } = dimensions;
  const margin = { 
    top: 20, 
    right: 30, 
    bottom: 40, 
    left: width < 400 ? 40 : 60 
  };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Find min and max values
  const minY = Math.min(...chartData.map(d => d.y));
  const maxY = Math.max(...chartData.map(d => d.y));
  const yRange = maxY - minY;
  const yPadding = yRange * 0.1;

  // Create scales
  const xScale = (index) => (index / (chartData.length - 1)) * chartWidth;
  const yScale = (value) => chartHeight - ((value - minY + yPadding) / (yRange + 2 * yPadding)) * chartHeight;

  // Create path string for the line
  const createPath = () => {
    return chartData.map((point, index) => {
      const x = xScale(index);
      const y = yScale(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Create area path for gradient fill
  const createAreaPath = () => {
    const linePath = chartData.map((point, index) => {
      const x = xScale(index);
      const y = yScale(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return `${linePath} L ${xScale(chartData.length - 1)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;
  };

  const fontSize = width < 400 ? 10 : 12;
  const pointRadius = width < 400 ? 3 : 4;

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <svg 
        width={width} 
        height={height} 
        style={{ 
          background: 'transparent',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#7927ff', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#7927ff', stopOpacity: 0.05 }} />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#7927ff', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#9d4eff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#00ff88', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Chart area */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((percent) => (
            <line
              key={percent}
              x1={0}
              y1={chartHeight * percent}
              x2={chartWidth}
              y2={chartHeight * percent}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={1}
            />
          ))}

          {/* Area fill */}
          <path
            d={createAreaPath()}
            fill="url(#priceGradient)"
          />

          {/* Price line */}
          <path
            d={createPath()}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points - show fewer on mobile */}
          {chartData.map((point, index) => {
            const showPoint = width < 400 ? index % 2 === 0 : true;
            return showPoint ? (
              <circle
                key={index}
                cx={xScale(index)}
                cy={yScale(point.y)}
                r={pointRadius}
                fill="#00ff88"
                stroke="#fff"
                strokeWidth={2}
                opacity={0.8}
              />
            ) : null;
          })}

          {/* Y-axis labels */}
          <text
            x={-10}
            y={yScale(maxY)}
            textAnchor="end"
            fill="#e3e3e3"
            fontSize={fontSize}
          >
            ${maxY.toFixed(2)}
          </text>
          <text
            x={-10}
            y={yScale(minY)}
            textAnchor="end"
            fill="#e3e3e3"
            fontSize={fontSize}
          >
            ${minY.toFixed(2)}
          </text>

          {/* X-axis labels */}
          <text
            x={0}
            y={chartHeight + 20}
            textAnchor="middle"
            fill="#e3e3e3"
            fontSize={fontSize}
          >
            {chartData[0]?.date}
          </text>
          <text
            x={chartWidth}
            y={chartHeight + 20}
            textAnchor="middle"
            fill="#e3e3e3"
            fontSize={fontSize}
          >
            {chartData[chartData.length - 1]?.date}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
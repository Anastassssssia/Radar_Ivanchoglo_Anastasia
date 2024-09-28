import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const Radar = () => {
  const [targets, setTargets] = useState([]);
  const [config, setConfig] = useState({
    measurementsPerRotation: 360,
    rotationSpeed: 60,
    targetSpeed: 100,
  });

  useEffect(() => {
    const connectToWebSocket = () => {
      const socket = new WebSocket('ws://localhost:4000');

      socket.onopen = () => {
        console.log('Підключено до WebSocket сервера');
      };

      socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // console.log('Отримані дані:', data); 

          const newTargets = data.echoResponses.map((response) => {
              const distance = (response.time * 300000) / 2; 
              return { angle: data.scanAngle, distance: distance, power: response.power };
          });
          setTargets((prevTargets) => [...prevTargets, ...newTargets].slice(-1));
      };
   

      socket.onclose = () => {
        console.log("З'єднання закрито");
      };

      socket.onerror = (error) => {
        console.error('Помилка WebSocket:', error);
      };
      return socket;
    };
    
    const timeout= setTimeout(() => {
      connectToWebSocket();
    }, 1000); 

    return () => clearTimeout(timeout);
   
  }, []);

   const handleInputChange = (e) => {
    setConfig((prevConfig) => ({ ...prevConfig, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/config', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        throw new Error('Щось пішло не так');
      }
      console.log('Налаштування радара оновлено');
    } catch (error) {
      console.error('Помилка під час оновлення налаштувань:', error);
    }
  };


  const angles = targets.map((target) => target.angle);
  const distances = targets.map((target) => target.distance);
  const powers = targets.map((target) => target.power);

  return (
    <div>
      <h2>Оновлення налаштувань радара</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Кількість вимірювань на один оберт:
          <input type="number"name="measurementsPerRotation" value={config.measurementsPerRotation} onChange={handleInputChange}/>
        </label>
        <br /><br/>
        <label>
          Швидкість обертання (RPM):
          <input type="number" name="rotationSpeed" value={config.rotationSpeed} onChange={handleInputChange}/>
        </label>
        <br /><br/>
        <label>
          Швидкість цілей (км/год):
          <input type="number" name="targetSpeed" value={config.targetSpeed} onChange={handleInputChange}/>
        </label>
        <br /><br/>
        <button type="submit" >Оновити налаштування</button>
      </form>

    <Plot
      data={[
        {
          type: 'scatterpolar',
          mode: 'markers',
          r: distances,
          theta: angles,
          marker: {
            color: powers,
            colorscale: 'Viridis',
            size: 10,
            cmin: 0,
            cmax: 1,
          },
        },
      ]}
      layout={{
        polar: {
          radialaxis: { visible: true, range: [0, 200] },
        },
        title: {
          text: 'Графік радара',
          font: {
            family: 'Arial, sans-serif',
            size: 24,
            color: 'black',
            weight: 'bold',
          },
        }
      }}
    />
     </div>
  );
};

export default Radar;
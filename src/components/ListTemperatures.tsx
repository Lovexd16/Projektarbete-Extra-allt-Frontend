import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);

interface Temperature {
  temperatureId: string;
  celcius: number;
  timestamp: string;
}

function ListTemperatures() {
  const [temperatures, setTemperatures] = useState<Temperature[]>([]);
  const [averageTemperature, setAverageTemperature] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetch(`${API_URL}/temperatures`)
      .then((res) => res.json())
      .then((data) => {
        const sortedTemperatures = data.sort(
          (a: Temperature, b: Temperature) => {
            return (
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
          }
        );
        setTemperatures(sortedTemperatures);

        const totalTemperature = sortedTemperatures.reduce(
          (sum: number, temp: Temperature) => sum + temp.celcius,
          0
        );
        const average = totalTemperature / sortedTemperatures.length;
        setAverageTemperature(average);
      })
      .catch((error) =>
        console.error("Fel vid hämtning av temperaturer: ", error)
      );
  }, []);

  return (
    <div>
      <h1>Veckans mätningar</h1>
      {averageTemperature !== null && (
        <h2 className="averageTemperature">
          Medeltemperatur: {averageTemperature.toFixed(2)} °C
        </h2>
      )}
      <ul className="temperatureListUl">
        {temperatures.map((temperature) => (
          <li className="temperatureListLi" key={temperature.temperatureId}>
            <strong>Temperatur:</strong> {temperature.celcius} °C |{" "}
            <strong>Tid:</strong>{" "}
            {new Date(temperature.timestamp).toLocaleString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListTemperatures;

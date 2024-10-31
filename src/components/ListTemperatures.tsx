import "./css/temperatureList.css";
import { useEffect, useState } from "react";
import Calendar from "./Calendar";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetch(`${API_URL}/temperatures`)
      .then((res) => res.json())
      .then((data) => {
        //Sorterar temperaturerna baserat på vilken tid den mättes
        const sortedTemperatures = data.sort(
          (a: Temperature, b: Temperature) => {
            return (
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
          }
        );
        setTemperatures(sortedTemperatures);
      })
      .catch((error) =>
        console.error("Fel vid hämtning av temperaturer: ", error)
      );
  }, []);

  //Visar bara de temperaturer som mättes på den valda dagen
  const filteredTemperatures = selectedDate
    ? temperatures.filter((temp) => {
        const tempDate = new Date(temp.timestamp);
        return (
          tempDate.getFullYear() === selectedDate.getFullYear() &&
          tempDate.getMonth() === selectedDate.getMonth() &&
          tempDate.getDate() === selectedDate.getDate()
        );
      })
    : temperatures;

  //Beräknar meddeltemperaturen av alla mätningar för den valda dagen om det finns fler än 0 mätningar
  useEffect(() => {
    if (filteredTemperatures.length > 0) {
      const totalTemperature = filteredTemperatures.reduce(
        (sum: number, temp: Temperature) => sum + temp.celcius,
        0
      );
      const average = totalTemperature / filteredTemperatures.length;
      setAverageTemperature(average);
    } else {
      setAverageTemperature(null);
    }
  }, [filteredTemperatures]);

  return (
    <div>
      <h1>Temperaturmätningar</h1>
      <h2 className="selectedDate">
        Valt datum: {selectedDate.toLocaleDateString()}{" "}
      </h2>
      <div className="temperatureWrapper">
        <Calendar onDateSelection={(date) => setSelectedDate(date)} />
        <div className="temperatureList">
          {averageTemperature !== null && (
            <h2 className="averageTemperature">
              Medeltemperatur: {averageTemperature.toFixed(2)} °C
            </h2>
          )}
          <ul className="temperatureListUl">
            {filteredTemperatures.length > 0 ? (
              filteredTemperatures.map((temperature) => (
                <li
                  className="temperatureListLi"
                  key={temperature.temperatureId}
                >
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
              ))
            ) : (
              <h3 className="temperatureListLiError">
                Inga mätningar finns för det valda datumet.
              </h3>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ListTemperatures;

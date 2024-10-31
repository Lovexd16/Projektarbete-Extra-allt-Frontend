//Importerar in ReactCalendar paketet
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalendarProps {
  onDateSelection: (date: Date) => void;
}

function Calendar({ onDateSelection }: CalendarProps) {
  return (
    <div>
      {/*Sätter kalenderns vy till månad*/}
      <ReactCalendar view="month" onClickDay={onDateSelection} />
    </div>
  );
}

export default Calendar;

import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function ExpenseCalendar({ value, onChange, activeStartDate, onActiveStartDateChange, tileContent }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <ReactCalendar
                onChange={onChange}
                value={value}
                activeStartDate={activeStartDate}
                onActiveStartDateChange={onActiveStartDateChange}
                tileContent={tileContent}
                className="spendly-calendar w-full border-0"
                showNavigation={false}
                showNeighboringMonth={true}
                calendarType="gregory"
                formatShortWeekday={(locale, date) =>
                    date.toLocaleDateString(locale, { weekday: "short" }).toUpperCase()
                }
            />
        </div>
    );
}

export default ExpenseCalendar;
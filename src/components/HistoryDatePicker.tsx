import type { SetStateAction } from "react";
import type {  Calendar } from "../sharedTypes";
import ButtonEvent from "./ButtonEvent";

type HistoryDatePickerProps = {
    onExitHistory: () => void; 
    onDateChosen: () => void; 
    userCalendar: null | Calendar; 
    selectedYear: string; 
    selectedMonth: string; 
    selectedDay: string;
    setSelectedYear: React.Dispatch<SetStateAction<string>>
    setSelectedMonth: React.Dispatch<SetStateAction<string>>
    setSelectedDay: React.Dispatch<SetStateAction<string>>
    hasHistory: boolean; 
    yearOptions: string[]; 
    monthOptions: string[]; 
    dayOptions: string[] 
}

const HistoryDatePicker = ({onDateChosen, onExitHistory, userCalendar, selectedDay, selectedMonth, selectedYear, setSelectedDay, setSelectedMonth, setSelectedYear, hasHistory, yearOptions, monthOptions, dayOptions}: HistoryDatePickerProps) => {
    return (
        <div>
              {!hasHistory || !userCalendar ? (
                <p>No history available yet. Create more todos first.</p>
                    ) : (
                <div className="flex flex-col gap-4">
                {/* Year select */}
                <div className="">
                    <label className="block mb-1 font-semibold">
                    Year
                    </label>
                    <select
                    className="border px-2 py-1 w-full text-sm md:text-lg dark:text-[hsl(234,39%,85%)] dark:bg-[hsl(235,24%,19%)]"
                    value={selectedYear}
                    onChange={(e) => {
                        const year = e.target.value;
                        setSelectedYear(year);
                        setSelectedMonth("");
                        setSelectedDay("");
                    }}
                    >
                    <option value="">Select a year</option>
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>
                        {year}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Month select */}
                <div>
                    <label className="block mb-1 font-semibold">
                    Month
                    </label>
                    <select
                    className="border px-2 py-1 w-full text-sm md:text-lg dark:text-[hsl(234,39%,85%)] dark:bg-[hsl(235,24%,19%)]"
                    value={selectedMonth}
                    onChange={(e) => {
                        const month = e.target.value;
                        setSelectedMonth(month);
                        setSelectedDay("");
                    }}
                    disabled={!selectedYear}
                    >
                    <option value="">
                        {selectedYear ? "Select a month" : "Select a year first"}
                    </option>
                    {monthOptions.map((month) => (
                        <option key={month} value={month}>
                        {month}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Day select */}
                <div>
                    <label className="block mb-1 font-semibold">
                    Day
                    </label>
                    <select
                    className="border px-2 py-1 w-full text-sm md:text-lg dark:text-[hsl(234,39%,85%)] dark:bg-[hsl(235,24%,19%)]"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    disabled={!selectedYear || !selectedMonth}
                    >
                    <option value="">
                        {selectedMonth
                        ? "Select a day"
                        : "Select year and month first"}
                    </option>
                    {dayOptions.map((day) => (
                        <option key={day} value={day}>
                        {day}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Debug / next step placeholder */}
                {selectedYear && selectedMonth && selectedDay && (
                    <div>
                    <span className="block mt-2">
                    Selected date: {selectedYear}-{selectedMonth}-{selectedDay}
                    </span>
                    <ButtonEvent onClickHandler={onDateChosen} text="Go to Date"/>
                    </div>
                )}
                </div>
                )}
                <div className="mt-[1rem]">
                    <ButtonEvent onClickHandler={onExitHistory} text="Exit History"/>
                </div>
        </div>
    )
}

export default HistoryDatePicker; 
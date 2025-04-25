import React from "react";
import { Card } from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useAttendance } from "@/contexts/AttendanceContext";

interface CalendarSidebarProps {
  renderDay: DatePickerProps["renderDay"];
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ renderDay }) => {
  const { selectedDate, setSelectedDate } = useAttendance();

  return (
    <Card withBorder shadow="sm" px="lg" py="xs" style={{ width: "300px" }}>
      <DatePicker
        value={selectedDate}
        onChange={setSelectedDate}
        renderDay={renderDay}
      />
    </Card>
  );
};

export default CalendarSidebar;

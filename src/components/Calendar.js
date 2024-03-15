import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Box, Flex, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

function Calendar({ defaultRange, ...props }) {
  const [dateRange, setDateRange] = useState(
    defaultRange ? defaultRange : [null, null]
  );
  const [startDate, endDate] = dateRange;

  //   console.log(dateRange);

  return (
    <Stack>
      <Box>
        <DatePicker
          formatWeekDay={(day) => day.slice(0, 3).toUpperCase()}
          onCalendarClose={() => {
            props.onSelectDate(dateRange);
          }}
          showPopperArrow={false}
          customInput={<Input />}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <Flex justify={"space-between"} align={"center"} p={"5px 15px"}>
              <Text fontWeight={"bold"} fontSize={"lg"}>
                {date.getFullYear()} . {date.getUTCMonth() + 1}
              </Text>
              <Box>
                <IconButton
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  icon={<ChevronLeftIcon w="24px" h={"24px"} />}
                  color={"red"}
                  size="sm"
                  variant={"ghost"}
                />
                <IconButton
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  icon={<ChevronRightIcon w="24px" h={"24px"} />}
                  color={"red"}
                  size="sm"
                  variant={"ghost"}
                />
              </Box>
            </Flex>
          )}
          dateFormat="yyyy.MM.dd"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            if (update[0] > new Date() || update[1] > new Date()) {
              alert("오늘 이후의 날짜는 선택할 수 없습니다.");
              return;
            }
            setDateRange(update);
          }}
          dayClassName={(d) => {
            const calDate =
              d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
            let startDate, endDate;
            if (dateRange[0]) {
              startDate =
                dateRange[0].getFullYear() +
                "." +
                (dateRange[0].getMonth() + 1) +
                "." +
                dateRange[0].getDate();
            }

            if (dateRange[1]) {
              endDate =
                dateRange[1].getFullYear() +
                "." +
                (dateRange[1].getMonth() + 1) +
                "." +
                dateRange[1].getDate();
            }

            if (startDate === calDate || endDate === calDate) {
              return "selectedDay";
            } else {
              return "unselectedDay";
            }
          }}
        />
      </Box>
    </Stack>
  );
}

export default Calendar;

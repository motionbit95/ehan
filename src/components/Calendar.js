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
          onCalendarClose={() => {
            props.onSelectDate(dateRange);
          }}
          showPopperArrow={false}
          customInput={
            <Flex>
              <IconButton icon={<CalendarIcon />} />
            </Flex>
          }
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <Flex justify={"space-between"} align={"center"} p={"5px 15px"}>
              <Text fontWeight={"bold"} fontSize={"24px"}>
                {date.getFullYear()} . {date.getMonth() + 1}
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

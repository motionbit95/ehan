import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Box, Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

function Calendar() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <Stack>
      <Flex>
        <StyleDatePicker
          customInput={
            <Flex>
              <CustomInput />
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
            <Flex
              bgColor={"white"}
              justify={"space-between"}
              align={"center"}
              p={"0 10px"}
            >
              <Text fontWeight={"bold"} fontSize={"lg"}>
                {date.getFullYear()} . {date.getMonth() + 1}
              </Text>
              <Box>
                <IconButton
                  bgColor={"white"}
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  icon={<ChevronLeftIcon />}
                />
                <IconButton
                  bgColor={"white"}
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  icon={<ChevronRightIcon />}
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
        />
      </Flex>
      <Flex>
        {startDate && endDate && (
          <Box
            bgColor={"white"}
            border={"1px solid black"}
            borderRadius={"10px"}
            p={"5px"}
            textAlign={"center"}
          >
            <Text>선택되면 출력</Text>
            {startDate.toLocaleDateString()} ~ {endDate.toLocaleDateString()}
          </Box>
        )}
      </Flex>
    </Stack>
  );
}

export default Calendar;

const StyleDatePicker = styled(DatePicker)`
  display: flex;
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
`;

const CustomInput = styled.input`
  background-color: #d9d9d9;
`;

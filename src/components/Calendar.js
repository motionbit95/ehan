import { Box, Flex, FormLabel, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Calendar() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <Flex
      flexDirection="row"
      gap={"20px"}
      p={"20px"}
      border={"1px solid black"}
      borderRadius={"10px"}
      bgColor={"#d9d9d9"}
    >
      <label>시작일</label>
      <Flex
        bgColor={"white"}
        border={"1px solid black"}
        borderRadius={"10px"}
        p={"5px"}
      >
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="시작 날짜를 선택하세요"
        />
      </Flex>
      <label>종료일</label>
      <Flex
        bgColor={"white"}
        border={"1px solid black"}
        borderRadius={"10px"}
        p={"5px"}
      >
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="종료 날짜를 선택하세요"
        />
      </Flex>
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
  );
}

export default Calendar;

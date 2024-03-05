import {
  Box,
  Center,
  Flex,
  Grid,
  HStack,
  Image,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Calendar = () => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const generateMonthDays = (year, month) => {
    const totalDays = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    const blankDays = Array.from({ length: firstDay }, (_, i) => null);

    return [...blankDays, ...daysArray];
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentMonthDays = generateMonthDays(currentYear, currentMonth);

  const handlePrevMonth = () => {
    // 이전 달로 이동
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    // 다음 달로 이동
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateClick = (day) => {
    // 날짜 선택
    setSelectedDate({
      // 선택한 날짜를 저장
      year: currentYear,
      month: currentMonth,
      day,
    });

    if (!startDate || (startDate && endDate)) {
      // 선택된 시작 날짜가 없거나 이미 시작 날짜와 끝 날짜가 선택된 경우
      setStartDate(day);
      setEndDate(null); // 새로운 시작 날짜가 선택되면 끝 날짜 초기화
    } else if (day > startDate && !endDate) {
      // 선택된 시작 날짜가 있고, 선택된 끝 날짜가 없으면 끝 날짜로 설정
      setEndDate(day);
    } else {
      // 이미 시작 날짜와 끝 날짜가 선택되어 있으면 선택 취소
      setStartDate(null);
      setEndDate(null);
    }
  };

  const isInRange = (day) => {
    // 선택된 범위의 시작과 끝 날짜가 존재하는 경우
    if (startDate && endDate) {
      return day >= startDate && day <= endDate;
    }
    return false;
  };

  return (
    <Stack
      align={"center"}
      w={"400px"}
      bgColor={"white"}
      border={"1px solid #d9d9d9"}
      borderRadius={"10px"}
    >
      <Stack>
        <HStack h={"40px"}>
          <Text>
            {currentDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Stack onClick={handlePrevMonth}>
            <Image src={require("../image/CkChevronLeft.png")} />
          </Stack>
          <Stack onClick={handleNextMonth}>
            <Image src={require("../image/CkChevronRight.png")} />
          </Stack>
        </HStack>
        <Table w={"350px"}>
          <Flex w={"350px"} justifyContent={"space-around"}>
            {daysOfWeek.map((day, index) => (
              <Box key={index}>
                <Text>{day}</Text>
              </Box>
            ))}
          </Flex>
          <Grid>
            {[...Array(Math.ceil(currentMonthDays.length / 7))].map(
              (_, weekIndex) => (
                <Flex py={"5px"} gap={0} key={weekIndex}>
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const day = currentMonthDays[weekIndex * 7 + dayIndex];
                    const isCurrentMonthDays = day !== null; // 저장된 년도와 월이 day에 저장된 날짜와 일치한지?

                    const isSelected =
                      (day && startDate === day) ||
                      (endDate && day >= startDate && day <= endDate); // 선택된 날짜 (시작 날짜랑 끝 날짜 비교하여 해당 구간 모두 선택된 공간)

                    const isRange =
                      isInRange(day) &&
                      // 선택된 범위의 시작과 끝이 같은 달에 있는 경우만 고려
                      startDate &&
                      endDate &&
                      startDate === endDate;

                    return (
                      <Box
                        p={0}
                        key={dayIndex}
                        onClick={() => handleDateClick(day)}
                      >
                        <Center
                          w={"50px"}
                          h={"50px"}
                          backgroundColor={
                            isSelected && startDate && endDate
                              ? "rgba(255, 59, 48, 0.2)"
                              : isRange
                              ? "rgba(0, 123, 255, 0.2)" // 선택된 범위에 대한 스타일
                              : ""
                          }
                          borderRadius={
                            day === startDate
                              ? "50px 0px 0px 50px"
                              : day === endDate
                              ? "0px 50px 50px 0px"
                              : ""
                          }
                        >
                          <Center
                            w={"50px"}
                            h={"50px"}
                            backgroundColor={
                              isSelected &&
                              (day === startDate || day === endDate)
                                ? "red"
                                : ""
                            }
                            borderRadius={
                              day === startDate
                                ? "50px"
                                : day === endDate
                                ? "50px"
                                : ""
                            }
                            color={
                              isSelected &&
                              (day === startDate || day === endDate)
                                ? "white"
                                : "black"
                            }
                          >
                            {isCurrentMonthDays ? day : ""}
                          </Center>
                        </Center>
                      </Box>
                    );
                  })}
                </Flex>
              )
            )}
          </Grid>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Calendar;

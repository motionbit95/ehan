import { Box, Center, Flex, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { getRandomColor } from "../firebase/api";

const PAYCOLORS = ["#5AC8FA", "#E53E3E", "#FFCC00", "#34C759"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="custom-tooltip">
        <p>{`${payload[0].name}: ${value}건`}</p>
      </div>
    );
  }
  return null;
};

const DonutChart = ({ data }) => {
  const [COLORS, setColors] = useState(
    data.length === 4 ? PAYCOLORS : new Array(data.length).fill("white")
  );

  useEffect(() => {
    if (data.length > 4) {
      let colors = new Array(data.length).fill("white");
      colors.forEach((color, index) => {
        colors[index] = getRandomColor();
      });
      setColors(colors);
    } else {
      setColors(PAYCOLORS);
    }
  }, [data]);

  return (
    <Flex
      w={"100%"}
      h={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      // pt={"30px"}
    >
      <PieChart width={400} height={220}>
        <Pie data={data} innerRadius={48} outerRadius={72} dataKey="value">
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "gray", strokeWidth: 2 }}
          wrapperStyle={{ zIndex: 1000 }}
          isAnimationActive={false}
        />
        <Legend
          wrapperStyle={{
            padding: "10px",
            lineHeight: "40px",
            display: "flex",
            alignItems: data.length > 7 ? "flex-start" : "center",
            overflowY: "auto",
            height: "100%",
            width: "50%",
            fontSize: "12px",
            top: "0px",
            right: "0px",
          }}
          iconSize={20}
          iconType="circle"
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
      </PieChart>
    </Flex>
  );
};

export default DonutChart;

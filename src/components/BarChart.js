import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ dataset, color }) => {
  // 주어진 데이터를 변환하여 차트에 사용할 수 있도록 준비합니다.
  const data = {
    labels: [
      "대디",
      "도미넌트",
      "디그레이더",
      "디그레이디",
      "로프버니",
      "리거",
      "리틀",
      "마스터",
      "마조히스트",
      "바닐라",
      "브랫",
      "브랫테이머",
      "사디스트",
      "서브미시브",
      "스위치",
      "스팽커",
      "스팽키",
      "슬레이브",
      "오너",
      "펫",
      "프레이",
      "헌터",
    ],
    datasets: [
      {
        label: "Scores",
        data: [
          dataset.대디,
          dataset.도미넌트,
          dataset.디그레이더,
          dataset.디그레이디,
          dataset.로프버니,
          dataset.리거,
          dataset.리틀,
          dataset.마스터,
          dataset.마조히스트,
          dataset.바닐라,
          dataset.브랫,
          dataset.브랫테이머,
          dataset.사디스트,
          dataset.서브미시브,
          dataset.스위치,
          dataset.스팽커,
          dataset.스팽키,
          dataset.슬레이브,
          dataset.오너,
          dataset.펫,
          dataset.프레이,
          dataset.헌터,
        ],
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  // 차트 옵션
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          display: false, // y축 라벨을 숨깁니다.
        },
        grid: {
          display: false, // y축의 그리드 라인을 숨깁니다.
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false, // 레전드를 숨깁니다.
      },
      title: {
        display: false,
        text: "Role Scores Bar Chart",
      },
    },
  };

  return (
    <Box>
      <Bar height={100} data={data} options={options} />
    </Box>
  );
};

export default BarChart;

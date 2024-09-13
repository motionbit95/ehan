import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button, Stack, Flex } from "@chakra-ui/react";
import Autoplay from "embla-carousel-autoplay";

const EmblaCarousel = (props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true, // 슬라이드가 무한 루프로 반복
    },
    [Autoplay({ delay: 5000 })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const Banner = [
    require("../Asset/banner_1.png"),
    require("../Asset/banner_1.png"),
    require("../Asset/banner_1.png"),
  ];
  return (
    <Stack
      spacing={4}
      align="center"
      w={"full"}
      h={"full"}
      position={"relative"}
    >
      {/* Embla Viewport */}
      <Box ref={emblaRef} overflow="hidden" w={"full"} h={"full"}>
        <Flex w={"full"} h={"full"}>
          {Banner.map((i) => (
            <Box
              overflow={"hidden"}
              borderRadius={"10"}
              key={i}
              flex="0 0 80%" // 슬라이드가 화면의 80%만 차지하여 양옆 미리보기 가능
              mx={2} // 슬라이드 사이 간격
              display="flex"
              justifyContent="center"
              alignItems="center"
              fontSize={"2xl"}
              fontWeight="bold"
            >
              <img src={i} alt="banner" />
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Navigation Buttons */}
      <Flex gap={2} position={"absolute"} bottom={2}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            w={"10px"}
            h={"10px"}
            borderRadius="full"
            border={"1px solid white"}
            bg={selectedIndex === i ? "gray.500" : "white"}
            onClick={() => emblaApi && emblaApi.scrollTo(i)}
          />
        ))}
      </Flex>
    </Stack>
  );
};

export default EmblaCarousel;

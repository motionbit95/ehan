import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button, Stack, Flex, Image } from "@chakra-ui/react";
import Autoplay from "embla-carousel-autoplay";

const EmblaCarousel = (props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true, // 슬라이드가 무한 루프로 반복
      align: "center",
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

  useEffect(() => {
    console.log(props.list);
  }, [props.list]);

  return (
    <Stack
      py={2}
      spacing={4}
      align="center"
      w={"full"}
      h={"full"}
      position={"relative"}
    >
      {/* Embla Viewport */}
      <Box ref={emblaRef} overflow="hidden" w={"full"} h={"full"}>
        <Flex w={"full"} h={"full"}>
          {props.list.map((i) => (
            <Box
              overflow={"hidden"}
              borderRadius={"10"}
              key={i}
              flex={"0 0 100%"}
              mx={2} // 슬라이드 사이 간격
              display="flex"
              justifyContent="center"
              alignItems="center"
              w={"full"}
              height={"200px"}
              onClick={() => window.open(i.advertiser)}
            >
              <Image
                src={i.banner_image}
                alt="banner"
                w={"full"}
                h={"full"}
                objectFit={"cover"}
              />
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Navigation Buttons */}
      <Flex gap={2} position={"absolute"} bottom={4}>
        {props.list.map((i) => (
          <Box
            key={i}
            w={{ base: "5px", md: "10px" }}
            h={{ base: "5px", md: "10px" }}
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

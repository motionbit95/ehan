import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button, Stack, Flex, Image } from "@chakra-ui/react";
import Autoplay from "embla-carousel-autoplay";

const EmblaCarousel = (props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, autoPlay: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", handleSelect);

    // Auto-play
    const autoPlay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000); // 3초마다 다음으로 이동

    return () => {
      clearInterval(autoPlay);
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index) => {
    emblaApi.scrollTo(index);
  };

  useEffect(() => {
    console.log(props.list);
  }, [props.list]);

  return (
    <Stack
      py={2}
      align="center"
      w={"full"}
      h={"full"}
      position={"relative"}
      spacing={0}
    >
      {/* Embla Viewport */}
      <Box ref={emblaRef} overflow="hidden" borderRadius="lg">
        <Box display="flex">
          {props.list.map((item, index) => (
            <Box key={index} minWidth="100%">
              <Image src={item.banner_image} borderRadius="lg" />
            </Box>
          ))}
        </Box>
      </Box>
      <Flex justify="center" mt={{ base: "2px", md: "0px" }}>
        {props.list.map((_, index) => (
          <Box
            key={index}
            onClick={() => scrollTo(index)}
            bgColor={selectedIndex === index ? "gray.500" : "gray.300"}
            // border={"1px solid black"}
            borderRadius={"full"}
            boxSize={{ base: "6px", md: "12px" }}
            mx={1}
          />
        ))}
      </Flex>
    </Stack>
  );
};

export default EmblaCarousel;

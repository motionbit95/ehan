import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button, Stack, Flex } from "@chakra-ui/react";
import Autoplay from "embla-carousel-autoplay";

const EmblaCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
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
          {[1, 2, 3].map((i) => (
            <Box
              w={"full"}
              h={"full"}
              flex="0 0 100%"
              bg="gray.200"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              Slide {i}
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Navigation Buttons */}
      <Flex gap={2} position={"absolute"} bottom={2}>
        <Box
          w={2}
          h={2}
          bg={selectedIndex === 0 ? "blue.500" : "gray.500"}
          borderRadius={"full"}
          onClick={() => emblaApi && emblaApi.scrollTo(0)}
        />
        <Box
          w={2}
          h={2}
          bg={selectedIndex === 1 ? "blue.500" : "gray.500"}
          borderRadius={"full"}
          onClick={() => emblaApi && emblaApi.scrollTo(1)}
        />
        <Box
          w={2}
          h={2}
          bg={selectedIndex === 2 ? "blue.500" : "gray.500"}
          borderRadius={"full"}
          onClick={() => emblaApi && emblaApi.scrollTo(2)}
        />
      </Flex>
    </Stack>
  );
};

export default EmblaCarousel;

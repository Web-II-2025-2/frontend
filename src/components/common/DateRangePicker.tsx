"use client";

import { Box, Button, Popover, Portal, Text, VStack } from "@chakra-ui/react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { formatDate } from "@/utils/date";
import "./day-picker.css";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  const today = new Date();

  const dateLabel =
    dateRange?.from && dateRange?.to
      ? `${formatDate(dateRange.from)} → ${formatDate(dateRange.to)}`
      : dateRange?.from
        ? `${formatDate(dateRange.from)} → ...`
        : "Selecionar datas";

  const nightCount =
    dateRange?.from && dateRange?.to
      ? Math.round(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  return (
    <VStack align="center">
      <Text fontSize="xs" fontWeight="bold" letterSpacing="widest">
        CHECK-IN - CHECK-OUT
      </Text>
      <Popover.Root positioning={{ placement: "top" }}>
        <Popover.Trigger asChild>
          <Button
            bg="sage.600"
            color="white"
            border="1px solid"
            borderColor="whiteAlpha.700"
            _hover={{
              bg: "sage.500",
              borderColor: "whiteAlpha.800",
            }}
            transition="all 0.2s"
            px={6}
            py={4}
            h="auto"
          >
            {dateLabel}
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content
              bg="blackAlpha.900"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="xl"
              boxShadow="0 25px 50px rgba(0,0,0,0.6)"
              p={2}
              zIndex={100}
              w="auto"
              maxW="none"
            >
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={onChange}
                numberOfMonths={2}
                disabled={{ before: today }}
                showOutsideDays={false}
              />
              {nightCount > 0 && (
                <Box px={4} pb={3} textAlign="center">
                  <Text color="whiteAlpha.600" fontSize="sm">
                    {nightCount} noite{nightCount !== 1 ? "s" : ""}
                  </Text>
                </Box>
              )}
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </VStack>
  );
}

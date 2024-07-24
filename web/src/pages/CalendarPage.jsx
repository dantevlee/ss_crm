import { ChakraProvider, Flex } from '@chakra-ui/react';
import {
  Calendar, CalendarDefaultTheme, CalendarControls, CalendarPrevButton,
  CalendarNextButton, CalendarMonths, CalendarMonth, CalendarMonthName,
  CalendarWeek, CalendarDays,
} from '@uselessdev/datepicker';
import { useState } from 'react';

const CalendarPage = () => {
  const [dates, setDates] = useState([]);
  const handleSelectDate = (values) => setDates(values);

  return (
    <>
    <Flex flexDirection="column"
        marginTop="200px"
        justifyContent="center"
        alignItems="center">
    <ChakraProvider theme={CalendarDefaultTheme}>
      <Calendar value={dates} onSelectDate={handleSelectDate}>
        <CalendarControls>
          <CalendarPrevButton />
          <CalendarNextButton />
        </CalendarControls>
        <CalendarMonths>
          <CalendarMonth>
            <CalendarMonthName />
            <CalendarWeek />
            <CalendarDays />
          </CalendarMonth>
        </CalendarMonths>
      </Calendar>
    </ChakraProvider>
    </Flex>
    </>
  );
}

export default CalendarPage;

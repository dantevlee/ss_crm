import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ConvertToLeadForm = ({ onCancel, lead, onFetchLeads }) => {
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [endDate, setEndDate] = useState("");
  const [endDateCalcuated, setEndDateCalculated] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  const handleStepperChange = (value) => {
    setNumberOfWeeks(value);
  };

  const handlInputWeeksChange = (e) => {
    setNumberOfWeeks(parseInt(e.target.value));
  };

  const calculateEndDate = () => {
    const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
    const durationInMilliseconds = numberOfWeeks * millisecondsInWeek;

    const startDateObject = new Date(startDate);

    const endDateResult = new Date(
      startDateObject.getTime() + durationInMilliseconds
    );
    const endDateFormatted = endDateResult.toISOString().split("T")[0];

    setEndDate(endDateFormatted);
    setEndDateCalculated(true);
  };

  const handleCancel = () => {
    onCancel();
  };

  const convertLeadToClient = async () => {
    const token = Cookies.get('SessionID')
    const LEAD_INDICATOR = 'N'
    const formData = {
      firstName: lead.firstName, 
      lastName: lead.lastName,
      clientEmail: lead.client_email || email,
      startDate: startDate,
      endDate: endDate,
      leadIndicator: LEAD_INDICATOR
    }
    try{
      await axios.put(`http://localhost:3000/api/update/client/${lead.id}`, formData, {
        headers: {
          Authorization: `${token}`
        }
      }).then((res) => {
       if(res.status === 200){
        onFetchLeads()
        handleCancel();
       } 
      })
    } catch(error){
      console.error(error)
    }
  }

  return (
    <>
      {!lead.client_email && (
        <FormControl>
          <FormLabel>E-mail</FormLabel>
          <Input onChange={handleEmailChange} placeholder="E-mail" />
        </FormControl>
      )}
      <FormControl mt={4}>
        <FormLabel>Start Date</FormLabel>
        <Input onChange={handleStartDateChange} size="md" type="date" />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>How many weeks is your program?</FormLabel>
        <Flex justifyContent="space-between">
          <InputGroup>
            <NumberInput defaultValue={1} min={1} max={52}>
              <NumberInputField onChange={handlInputWeeksChange} />
              <NumberInputStepper>
                <NumberIncrementStepper
                  onClick={() => handleStepperChange(numberOfWeeks + 1)}
                />
                <NumberDecrementStepper
                  onClick={() => handleStepperChange(numberOfWeeks - 1)}
                />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
          <Button
            mr={8}
            colorScheme="teal"
            width="150px"
            onClick={calculateEndDate}
          >
            Calculate
          </Button>
        </Flex>
        {endDateCalcuated && (
          <FormControl mt={4}>
            <FormLabel>End Date</FormLabel>
            <Input
              onChange={handleEndDateChange}
              placeholder="Select Date"
              size="md"
              type="date"
              value={endDate}
            />
          </FormControl>
        )}
      </FormControl>
      <Flex mt={6} justifyContent="flex-start">
        <Button onClick={convertLeadToClient} colorScheme="blue">Convert</Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ConvertToLeadForm;

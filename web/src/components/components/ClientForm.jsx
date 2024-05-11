import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";

const ClientForm = ({ onSave, onCancel }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [endDate, setEndDate] = useState(new Date());
  const [endDateCalcuated, setEndDateCalculated] = useState(false);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    setStartDate(newStartDate);
  };

  const handleNumberOfWeeksChange = (e) => {
    setNumberOfWeeks(parseInt(e.target.value));
  };

  const calculateEndDate = () => {
    const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
    const durationInMilliseconds = numberOfWeeks * millisecondsInWeek;
    const endDateResult = new Date(
      startDate.getTime() + durationInMilliseconds
    );

    const endDateFormatted = endDateResult.toISOString().split("T")[0];

    setEndDate(endDateFormatted);
    setEndDateCalculated(true);
  };

  const handleFormSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      clientEmail: email,
      startDate: startDate,
      endDate: endDate,
    };
    onSave(formData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <FormControl>
        <FormLabel>First Name</FormLabel>
        <Input onChange={handleFirstNameChange} placeholder="First Name" />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Last name</FormLabel>
        <Input onChange={handleLastNameChange} placeholder="Last Name" />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>E-mail</FormLabel>
        <Input onChange={handleEmailChange} placeholder="E-mail" />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Start Date</FormLabel>
        <Input
          onChange={handleStartDateChange}
          placeholder="Select Date"
          size="md"
          type="date"
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>How many weeks is your program?</FormLabel>
        <Flex justifyContent="space-between">
          <InputGroup>
            <NumberInput defaultValue={1} min={1} max={52}>
              <NumberInputField onChange={handleNumberOfWeeksChange} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
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
              value={endDate}
              placeholder="Select Date"
              size="md"
              type="date"
            />
          </FormControl>
        )}
      </FormControl>
      <Flex mt={6} justifyContent="flex-start">
        <Button onClick={handleFormSubmission} colorScheme="blue">
          Save
        </Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ClientForm;

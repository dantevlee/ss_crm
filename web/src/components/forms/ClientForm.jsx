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
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ClientForm = ({
  onSave,
  onEdit,
  onArchive,
  onCancel,
  clientFormValue,
  onRestore
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [endDate, setEndDate] = useState("");
  const [endDateCalcuated, setEndDateCalculated] = useState(false);
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [archive, setArchive] = useState("N");

  useEffect(() => {
    if (clientFormValue) {
      setEndDateCalculated(true);
      setFirstName(clientFormValue.firstName);
      setLastName(clientFormValue.lastName);
      setEmail(clientFormValue.client_email);
      setStartDate(
        clientFormValue.start_date
          ? clientFormValue.start_date.split("T")[0]
          : ""
      );
      setEndDate(
        clientFormValue.end_date ? clientFormValue.end_date.split("T")[0] : ""
      );
      if(!onRestore){
        setIsEditingEntry(true);
      } else {
        setIsEditingEntry(false);
        setEmail(clientFormValue.email);
      }
    
    }
  }, [clientFormValue]);

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

  const handleFormSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      clientEmail: email,
      startDate: startDate,
      endDate: endDate,
    };
    if (isEditingEntry) {
      onEdit(formData, clientFormValue.id);
      if(archive === 'Y'){
        handleArchiveSubmission()
      }
    } else if (onRestore) {
      handleArchiveToClientSubmission()
    }
    
    else {
      onSave(formData);
    }
  };

  const handleArchiveSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      lastActiveDate: endDate
    }

    onArchive(formData, clientFormValue.id)
  }

  const handleArchiveToClientSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      clientEmail: email,
      startDate: startDate,
      endDate: endDate
    }

    onArchive(formData, clientFormValue.id)
  }

  const handleCancel = () => {
    onCancel();
  };


  return (
    <>
      <FormControl>
        <FormLabel>First Name</FormLabel>
        <Input
          onChange={handleFirstNameChange}
          placeholder="First Name"
          value={firstName}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Last name</FormLabel>
        <Input
          onChange={handleLastNameChange}
          placeholder="Last Name"
          value={lastName}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>E-mail</FormLabel>
        <Input
          onChange={handleEmailChange}
          placeholder="E-mail"
          value={email}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Start Date</FormLabel>
        <Input
          onChange={handleStartDateChange}
          size="md"
          type="date"
          value={startDate}
        />
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
              value={endDate}
              placeholder="Select Date"
              size="md"
              type="date"
            />
          </FormControl>
        )}
        {isEditingEntry && (
          <FormControl mt={4}>
            <FormLabel>Archive Client?</FormLabel>
            <RadioGroup onChange={setArchive} value={archive}>
              <Stack direction="column">
                <Radio value="Y">Yes</Radio>
                <Radio value="N">No</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        )}
      </FormControl>
      <Flex mt={6} justifyContent="flex-start">
        <Button onClick={handleFormSubmission} colorScheme="blue">
          {isEditingEntry ? "Update" : "Save"}
        </Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ClientForm;

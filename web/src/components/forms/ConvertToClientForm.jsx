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
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
  FormErrorMessage,
  useTab,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";

const ConvertToClientForm = ({ onCancel, lead, onFetchLeads}) => {
  const [email, setEmail] = useState("");
  const [emailTouched, setemailTouched] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [endDate, setEndDate] = useState("");
  const [endDateCalcuated, setEndDateCalculated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (lead) {
      setEmail(lead.lead_email);
    }
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailTouched) {
      setemailTouched(true);
    }
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
    const token = Cookies.get("SessionID");
    const formData = {
      firstName: lead.firstName,
      lastName: lead.lastName,
      clientEmail: email,
      startDate: startDate,
      endDate: endDate,
      phoneNumber: lead.phone_number,
      socialMediaSource: lead.social_media_source,
      socialMedia: lead.soical_media,
    };
    try {
      setLoading(true)
      await axios
        .post(
          `http://localhost:3000/api/lead/convert/client/${lead.id}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            onFetchLeads();
            handleCancel();
            toast({
              title: "Success!",
              description: "Lead successfully converted to client!",
              status: "success",
              duration: 7000,
              position: "top 100px", 
              isClosable: true
            });
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message)
      setShowAlert(true)
    } finally{
      setLoading(false)
    }
  };

  const emailInputError =
  (email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) && emailTouched;

  return (
    <>
      <FormControl isInvalid ={emailInputError}>
        <FormLabel color="white">E-mail</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: "4px",
              borderColor: "blue.600",
            },
          }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleEmailChange}
          placeholder="E-mail"
          value={email}
        />
         <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="225px"
          textColor="black"
        >
          Please Enter a Valid E-mail.
        </FormErrorMessage>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel color="white" >Start Date</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: "4px",
              borderColor: "blue.600",
            },
          }}
          borderRadius={10}
          backgroundColor="white"
         onChange={handleStartDateChange} size="md" type="date" />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel color="white" >How many weeks is your program?</FormLabel>
        <Flex justifyContent="space-between">
          <InputGroup
          >
            <NumberInput defaultValue={1} min={1} max={52}>
              <NumberInputField 
                sx={{
                  _focus: {
                    borderWidth: "4px",
                    borderColor: "blue.600",
                  },
                }}
                borderRadius={10}
                backgroundColor="white"
              onChange={handlInputWeeksChange} />
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
            <FormLabel color="white" >End Date</FormLabel>
            <Input
              sx={{
                _focus: {
                  borderWidth: "4px",
                  borderColor: "blue.600",
                },
              }}
              borderRadius={10}
              backgroundColor="white"
              onChange={handleEndDateChange}
              placeholder="Select Date"
              size="md"
              type="date"
              value={endDate}
            />
          </FormControl>
        )}
      </FormControl>
      {showAlert && (
        <Alert mt={showAlert ? 4 : 0} status="error">
          <AlertIcon />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <Flex mt={6} justifyContent="flex-start">
      
          <Button onClick={convertLeadToClient} colorScheme="blue">
          {loading ? <Spinner size="md" thickness="4px" /> : "Convert"}
          </Button>
      
          <Button onClick={handleCancel} colorScheme="gray" ml={4}>
            Cancel
          </Button>
      </Flex>
    </>
  );
};

export default ConvertToClientForm;

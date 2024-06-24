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
  onRestore,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [endDate, setEndDate] = useState("");
  const [contactSource, setContactSource] = useState("");
  const [socialMediaSource, setSocialMediaSource] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
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
      setPhoneNumber(
        clientFormValue.phone_number ? clientFormValue.phone_number : ""
      );
      if (clientFormValue.phone_number) {
        setContactSource("Phone Number");
      }
      if (clientFormValue.social_media_source) {
        setContactSource("Social Media");
        setSocialMediaSource(clientFormValue.social_media_source);
        setSocialMedia(clientFormValue.social_media);
      }
      if (onRestore) {
        setIsEditingEntry(false);
        setEmail(clientFormValue.email);
        setSocialMedia(clientFormValue.soical_media);
        setEndDateCalculated(false);
      } else {
        setIsEditingEntry(true);
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

  const handleContactSourceChange = (e) => {
    setContactSource(e);
    if (e === "None") {
      setSocialMedia("");
      setPhoneNumber("");
      setSocialMediaSource("");
    }
  };

  const handleSocialMediaSourceChange = (e) => {
    setSocialMediaSource(e);
    setSocialMedia("");
  };

  const handleSocialMediaChange = (e) => {
    setSocialMedia(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
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
      phoneNumber: phoneNumber,
      socialMediaSource: socialMediaSource,
      socialMedia: socialMedia,
    };
    if (isEditingEntry) {
      onEdit(formData, clientFormValue.id);
      if (archive === "Y") {
        handleArchiveSubmission();
      }
    } else if (onRestore) {
      handleArchiveToClientSubmission();
    } else {
      onSave(formData);
    }
  };

  const handleArchiveSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      socialMediaSource: socialMediaSource,
      socialMedia: socialMedia,
      lastActiveDate: endDate,
    };

    onArchive(formData, clientFormValue.id);
  };

  const handleArchiveToClientSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      clientEmail: email,
      startDate: startDate,
      endDate: endDate,
      phoneNumber: phoneNumber,
      socialMediaSource: socialMediaSource,
      socialMedia: socialMedia,
    };

    onArchive(formData, clientFormValue.id);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <FormControl>
        <FormLabel color="white">First Name:</FormLabel>
        <Input
            sx={{
              _focus: {
                borderWidth: '4px',
                borderColor: 'blue.600',
              },
            }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleFirstNameChange}
          placeholder="First Name"
          value={firstName}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel color="white">Last Name:</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: '4px',
              borderColor: 'blue.600',
            },
          }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleLastNameChange}
          placeholder="Last Name"
          value={lastName}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel color="white">E-mail:</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: '4px',
              borderColor: 'blue.600',
            },
          }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleEmailChange}
          placeholder="E-mail"
          value={email}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel color="white">Alternate Contact Source?</FormLabel>
        <RadioGroup
          color="white"
          onChange={handleContactSourceChange}
          value={contactSource}
        >
          <Stack direction="column">
            <Radio value="Social Media">Social Media</Radio>
            <Radio value="Phone Number">Phone Number</Radio>
            <Radio value="None">None</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      {contactSource === "Social Media" && (
        <FormControl mt={4}>
          <FormLabel color="white">Social Media?</FormLabel>
          <RadioGroup
            color="white"
            onChange={handleSocialMediaSourceChange}
            value={socialMediaSource}
          >
            <Stack direction="column">
              <Radio value="Instagram">Instagram</Radio>
              <Radio value="Facebook">Facebook</Radio>
              <Radio value="LinkedIn">LinkedIn</Radio>
              <Radio value="Tik Tok">Tik Tok</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      )}{" "}
      {socialMediaSource === "Instagram" && (
        <FormControl mt={4}>
          <FormLabel color="white">IG:</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: '4px',
                borderColor: 'blue.600',
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            value={socialMedia}
            placeholder="Instagram"
            onChange={handleSocialMediaChange}
          />
        </FormControl>
      )}
      {socialMediaSource === "Facebook" && (
        <FormControl mt={4}>
          <FormLabel color="white">Facebook:</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: '4px',
                borderColor: 'blue.600',
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            value={socialMedia}
            placeholder="Facebook"
            onChange={handleSocialMediaChange}
          />
        </FormControl>
      )}
      {socialMediaSource === "LinkedIn" && (
        <FormControl mt={4}>
          <FormLabel color="white">LinkedIn:</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: '4px',
                borderColor: 'blue.600',
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            value={socialMedia}
            placeholder="LinkedIn"
            onChange={handleSocialMediaChange}
          />
        </FormControl>
      )}
      {socialMediaSource === "Tik Tok" && (
        <FormControl mt={4}>
          <FormLabel color="white">Tik Tok:</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: '4px',
                borderColor: 'blue.600',
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            value={socialMedia}
            placeholder="Tik-Tok"
            onChange={handleSocialMediaChange}
          />
        </FormControl>
      )}
      {contactSource === "Phone Number" && (
        <FormControl mt={4}>
          <FormLabel color="white">Phone Number</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: '4px',
                borderColor: 'blue.600',
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            onChange={handlePhoneNumberChange}
            placeholder="Phone Number"
            value={phoneNumber}
          />
        </FormControl>
      )}
      <FormControl mt={4}>
        <FormLabel color="white">Start Date</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: '4px',
              borderColor: 'blue.600',
            },
          }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleStartDateChange}
          size="md"
          type="date"
          value={startDate}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel color="white">How many weeks is your program?</FormLabel>
        <Flex justifyContent="space-between">
          <InputGroup>
            <NumberInput
              borderRadius={10}
              backgroundColor="white"
              defaultValue={1}
              min={1}
              max={52}
            >
              <NumberInputField   
              sx={{
                _focus: {
                  borderWidth: '4px',
                  borderColor: 'blue.600',
                },
              }} onChange={handlInputWeeksChange} />
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
            colorScheme="yellow"
            width="150px"
            onClick={calculateEndDate}
          >
            Calculate
          </Button>
        </Flex>
        {endDateCalcuated && (
          <FormControl mt={4}>
            <FormLabel color="white">End Date</FormLabel>
            <Input
                sx={{
                  _focus: {
                    borderWidth: '4px',
                    borderColor: 'blue.600',
                  },
                }}
              borderRadius={10}
              backgroundColor="white"
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
            <FormLabel color="white">Archive Client?</FormLabel>
            <RadioGroup color="white" onChange={setArchive} value={archive}>
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

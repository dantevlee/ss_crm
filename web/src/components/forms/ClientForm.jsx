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
  FormErrorMessage,
  Spinner,
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
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameTouched, setLastNameTouched] = useState(false)
  const [email, setEmail] = useState("");
  const [emailTouched, setemailTouched] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberTouched, setPhoneNumberTouched] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [endDate, setEndDate] = useState("");
  const [contactSource, setContactSource] = useState("None");
  const [socialMediaSource, setSocialMediaSource] = useState("");
  const [socialMediaSourceTouched, setSocialMediaSourceTouched] = useState(false)
  const [socialMedia, setSocialMedia] = useState("");
  const [socialMediaTouched, setSocialMediaTouched] = useState(false)
  const [endDateCalcuated, setEndDateCalculated] = useState(false);
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [archive, setArchive] = useState("N");
  const[loading, setLoading] = useState(false)

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

  const emailInputError =
    (email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) && emailTouched;

  const firstNameInputError = firstName.trim() === "" && firstNameTouched;

  const lastNameInputError = lastName.trim() === "" && lastNameTouched;

  const phoneNumberInputError = phoneNumber.trim() === "" && phoneNumberTouched

  const socialMediaSourceInputError =  socialMediaSource.trim() === "" && socialMediaSourceTouched

  const socialMediaInputError = socialMedia.trim() === "" && socialMediaTouched


  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    if(!firstNameTouched){
      setFirstNameTouched(true)
    }
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    if(!lastNameTouched){
      setLastNameTouched(true)
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if(!emailTouched){
      setemailTouched(true)
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

  const handleContactSourceChange = (e) => {
    setContactSource(e);
    if (e === "None") {
      setSocialMedia("");
      setPhoneNumber("");
      setSocialMediaSource("");
      setPhoneNumberTouched(false)
      setSocialMediaTouched(false)
    }
    if(e === "Social Media"){
      setPhoneNumber("");
      setPhoneNumberTouched(false)
    }

    if(e === "Phone Number"){
      setSocialMediaSource("");
      setSocialMediaTouched(false)
      setSocialMedia("");
    }
  };

  const handleSocialMediaSourceChange = (e) => {
    setSocialMediaSource(e);
    setSocialMedia("");
    if(!socialMediaSourceTouched){
      setSocialMediaSourceTouched(true)
    }
  };

  const handleSocialMediaChange = (e) => {
    setSocialMedia(e.target.value);
    if(!socialMediaTouched){
      setSocialMediaTouched(true)
    }
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    if(!phoneNumberTouched){
      setPhoneNumberTouched(true)
    }
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
        setLoading(true)
        handleArchiveSubmission();
      }
    } else if (onRestore) {
      setLoading(true)
      handleArchiveToClientSubmission();
    } else {
      setLoading(true)
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
      <FormControl isInvalid={firstNameInputError}>
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
        <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="225px"
        textColor="black">Please Enter First Name of Client.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={lastNameInputError} mt={4}>
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
         <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="225px"
        textColor="black">Please Enter Last Name of Client.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={emailInputError} mt={4}>
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
        <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="225px"
        textColor="black">Please Enter a Valid E-mail.</FormErrorMessage>
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
        <FormControl isInvalid={socialMediaSourceInputError} mt={4}>
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
          <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="250px"
        textColor="black">Please Select A Social Media Option.</FormErrorMessage>
        </FormControl>
      )}{" "}
      {socialMediaSource === "Instagram" && contactSource === "Social Media" && (
        <FormControl isInvalid={socialMediaInputError} mt={4}>
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
        <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="160px"
        textColor="black">Please Enter IG Handle.</FormErrorMessage>
        </FormControl>
      )}
      {socialMediaSource === "Facebook" && contactSource === "Social Media" && (
        <FormControl isInvalid={socialMediaInputError} mt={4}>
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
           <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="200px"
        textColor="black">Please Enter Facebook Name.</FormErrorMessage>
        </FormControl>
      )}
      {socialMediaSource === "LinkedIn" &&
      contactSource === "Social Media" && (
        <FormControl mt={4} isInvalid={socialMediaInputError}>
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
           <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="200px"
        textColor="black">Please Enter LinkedIn Name.</FormErrorMessage>
        </FormControl>
      )}
      {socialMediaSource === "Tik Tok" && contactSource === "Social Media" && (
        <FormControl isInvalid={socialMediaInputError} mt={4}>
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
           <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="200px"
        textColor="black">Please Enter Tik-Tok Handle.</FormErrorMessage>
        </FormControl>
      )}
      {contactSource === "Phone Number" && (
        <FormControl isInvalid={phoneNumberInputError} mt={4}>
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
           <FormErrorMessage fontSize="14px"
        fontWeight='bold'
        backgroundColor="red.300"
        maxWidth="245px"
        textColor="black">Please 
        Enter A Valid Phone Number.</FormErrorMessage>
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
          {loading ? <Spinner size="md" thickness="4px"/> : isEditingEntry  ? "Update" : "Save"}
        </Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ClientForm;

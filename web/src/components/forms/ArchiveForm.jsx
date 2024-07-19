import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ArchiveForm = ({
  archiveFormValue,
  onCancel,
  onEdit,
  onError,
  onLoading,
  onAlert,
}) => {
  const [firstName, setFirstName] = useState(archiveFormValue.firstName || "");
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastName, setLastName] = useState(archiveFormValue.lastName || "");
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [email, setEmail] = useState(archiveFormValue.email || "");
  const [emailTouched, setemailTouched] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    archiveFormValue.phone_number || ""
  );
  const [phoneNumberTouched, setPhoneNumberTouched] = useState(false);
  const [contactSource, setContactSource] = useState("");
  const [socialMediaSource, setSocialMediaSource] = useState(
    archiveFormValue.social_media_source || ""
  );
  const [socialMediaSourceTouched, setSocialMediaSourceTouched] =
    useState(false);
  const [socialMedia, setSocialMedia] = useState(
    archiveFormValue.soical_media || ""
  );
  const [socialMediaTouched, setSocialMediaTouched] = useState(false);
  const [lastActiveDate, setLastActiveDate] = useState(
    archiveFormValue.last_active_date || ""
  );

  useEffect(() => {
    if (archiveFormValue.email) {
      setContactSource("E-mail");
    }
    if (archiveFormValue.phone_number) {
      setContactSource("Phone Number");
    }
    if (archiveFormValue.social_media_source) {
      setContactSource("Social Media");
      setSocialMediaSource(archiveFormValue.social_media_source);
      setSocialMedia(archiveFormValue.soical_media);
    }
    setLastActiveDate(archiveFormValue.last_active_date.split("T")[0]);
  }, [archiveFormValue]);

  const emailInputError =
    (email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) && emailTouched;

  const firstNameInputError = firstName.trim() === "" && firstNameTouched;

  const lastNameInputError = lastName.trim() === "" && lastNameTouched;

  const phoneNumberInputError =
    !/^[0-9\b()-]*$/.test(phoneNumber) ||
    (phoneNumber.trim() === "" && phoneNumberTouched);

  const socialMediaSourceInputError =
    socialMediaSource.trim() === "" && socialMediaSourceTouched;

  const socialMediaInputError = socialMedia.trim() === "" && socialMediaTouched;

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    if (!firstNameTouched) {
      setFirstNameTouched(true);
    }
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    if (!lastNameTouched) {
      setLastNameTouched(true);
    }
  };

  const handleLastActiveDateChange = (e) => {
    setLastActiveDate(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailTouched) {
      setemailTouched(true);
    }
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    if (!phoneNumberTouched) {
      setPhoneNumberTouched(true);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleContactSourceChange = (e) => {
    setContactSource(e);
    if (e === "None") {
      setSocialMedia("");
      setPhoneNumber("");
      setSocialMediaSource("");
      setPhoneNumberTouched(false);
      setSocialMediaTouched(false);
    }
    if (e === "Social Media") {
      setPhoneNumber("");
      setPhoneNumberTouched(false);
      setSocialMediaTouched(true);
      setSocialMediaSourceTouched(true);
    }
    if (e === "Phone Number") {
      setSocialMediaSource("");
      setSocialMediaTouched(false);
      setSocialMedia("");
      setPhoneNumberTouched(true);
    }
  };

  const handleSocialMediaSourceChange = (e) => {
    setSocialMediaSource(e);
    setSocialMedia("");
    if (!socialMediaSourceTouched) {
      setSocialMediaSourceTouched(true);
    }
  };

  const handleSocialMediaChange = (e) => {
    setSocialMedia(e.target.value);
    if (!socialMediaTouched) {
      setSocialMediaTouched(true);
    }
  };

  const handleEditSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      socialMediaSource: socialMediaSource,
      socialMedia: socialMedia,
      lastActiveDate: lastActiveDate,
    };

    onEdit(formData);
  };

  return (
    <>
      <FormControl isInvalid={firstNameInputError}>
        <FormLabel color="white">First Name:</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: "4px",
              borderColor: "blue.600",
            },
          }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleFirstNameChange}
          placeholder="First Name"
          value={firstName}
        />
        <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="240px"
          textColor="black"
        >
          Please Enter First Name of Archive.
        </FormErrorMessage>
      </FormControl>
      <FormControl mt={4} isInvalid={lastNameInputError}>
        <FormLabel color="white">Last Name:</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: "4px",
              borderColor: "blue.600",
            },
          }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleLastNameChange}
          placeholder="Last Name"
          value={lastName}
        />
        <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="240px"
          textColor="black"
        >
          Please Enter Last Name of Archive.
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={emailInputError} mt={4}>
        <FormLabel color="white">E-mail:</FormLabel>
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
          maxWidth="240px"
          textColor="black"
        >
          Please Enter a Valid E-mail.
        </FormErrorMessage>
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
        <FormControl mt={4} isInvalid={socialMediaSourceInputError}>
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
          <FormErrorMessage
            fontSize="14px"
            fontWeight="bold"
            backgroundColor="red.300"
            maxWidth="240px"
            textColor="black"
          >
            Please Select A Social Media Option.
          </FormErrorMessage>
        </FormControl>
      )}{" "}
      {socialMediaSource === "Instagram" &&
        contactSource === "Social Media" && (
          <FormControl isInvalid={socialMediaInputError} mt={4}>
            <FormLabel color="white">IG:</FormLabel>
            <Input
              sx={{
                _focus: {
                  borderWidth: "4px",
                  borderColor: "blue.600",
                },
              }}
              borderRadius={10}
              backgroundColor="white"
              value={socialMedia}
              placeholder="Instagram"
              onChange={handleSocialMediaChange}
            />
            <FormErrorMessage
              fontSize="14px"
              fontWeight="bold"
              backgroundColor="red.300"
              maxWidth="160px"
              textColor="black"
            >
              Please Enter IG Handle.
            </FormErrorMessage>
          </FormControl>
        )}
      {socialMediaSource === "Facebook" && contactSource === "Social Media" && (
        <FormControl isInvalid={socialMediaInputError} mt={4}>
          <FormLabel color="white">Facebook:</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: "4px",
                borderColor: "blue.600",
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            value={socialMedia}
            placeholder="Facebook"
            onChange={handleSocialMediaChange}
          />
          <FormErrorMessage
            fontSize="14px"
            fontWeight="bold"
            backgroundColor="red.300"
            maxWidth="200px"
            textColor="black"
          >
            Please Enter Facebook Name.
          </FormErrorMessage>
        </FormControl>
      )}
      {socialMediaSource === "LinkedIn" && contactSource === "Social Media" && (
        <FormControl mt={4} isInvalid={socialMediaInputError}>
          <FormLabel color="white">LinkedIn:</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: "4px",
                borderColor: "blue.600",
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            value={socialMedia}
            placeholder="LinkedIn"
            onChange={handleSocialMediaChange}
          />
          <FormErrorMessage
            fontSize="14px"
            fontWeight="bold"
            backgroundColor="red.300"
            maxWidth="200px"
            textColor="black"
          >
            Please Enter LinkedIn Name.
          </FormErrorMessage>
        </FormControl>
      )}
      {socialMediaSource === "Tik Tok" && contactSource === "Social Media" && (
        <FormControl isInvalid={socialMediaInputError} m mt={4}>
          <FormLabel color="white">Tik Tok:</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: "4px",
                borderColor: "blue.600",
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            value={socialMedia}
            placeholder="Tik-Tok"
            onChange={handleSocialMediaChange}
          />
          <FormErrorMessage
            fontSize="14px"
            fontWeight="bold"
            backgroundColor="red.300"
            maxWidth="200px"
            textColor="black"
          >
            Please Enter Tik-Tok Handle.
          </FormErrorMessage>
        </FormControl>
      )}
      {contactSource === "Phone Number" && (
        <FormControl isInvalid={phoneNumberInputError} mt={4}>
          <FormLabel color="white">Phone Number</FormLabel>
          <Input
            sx={{
              _focus: {
                borderWidth: "4px",
                borderColor: "blue.600",
              },
            }}
            borderRadius={10}
            backgroundColor="white"
            onChange={handlePhoneNumberChange}
            placeholder="Phone Number"
            value={phoneNumber}
          />
          <FormErrorMessage
            fontSize="14px"
            fontWeight="bold"
            backgroundColor="red.300"
            maxWidth="245px"
            textColor="black"
          >
            Please Enter A Valid Phone Number.
          </FormErrorMessage>
        </FormControl>
      )}
      <FormControl mt={4}>
        <FormLabel color="white">Last Active Date</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: "4px",
              borderColor: "blue.600",
            },
          }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleLastActiveDateChange}
          placeholder="Last Active Date"
          size="md"
          type="date"
          value={lastActiveDate}
        />
      </FormControl>
      {onAlert && (
        <Alert mt={onAlert ? 4 : 0} status="error">
          <AlertIcon />
          <AlertDescription>{onError}</AlertDescription>
        </Alert>
      )}
      <Flex mt={6} justifyContent="flex-start">
        <Button onClick={handleEditSubmission} colorScheme="blue">
          {onLoading ? <Spinner size="md" thickness="4px" /> : "Update"}
        </Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ArchiveForm;

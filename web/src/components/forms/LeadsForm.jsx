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

const LeadsForm = ({
  onSave,
  onEdit,
  onArchive,
  onCancel,
  onRestore,
  leadsFormData,
  onLoading,
  onError,
  onErrorMessage,
}) => {
  const [firstName, setFirstName] = useState("");
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setemailTouched] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberTouched, setPhoneNumberTouched] = useState(false);
  const [lastContactedAt, setLastContactedAt] = useState("");
  const [contactSource, setContactSource] = useState("None");
  const [socialMediaSource, setSocialMediaSource] = useState("");
  const [socialMediaSourceTouched, setSocialMediaSourceTouched] =
    useState(false);
  const [socialMedia, setSocialMedia] = useState("");
  const [socialMediaTouched, setSocialMediaTouched] = useState(false);
  const [archive, setArchive] = useState("N");
  const [isEditingEntry, setIsEditingEntry] = useState(false);

  useEffect(() => {
    if (leadsFormData) {
      setFirstName(leadsFormData.firstName);
      setLastName(leadsFormData.lastName);
      setEmail(leadsFormData.lead_email ? leadsFormData.lead_email : "");
      setPhoneNumber(
        leadsFormData.phone_number ? leadsFormData.phone_number : ""
      );
      setLastContactedAt(
        leadsFormData.last_contacted_at
          ? leadsFormData.last_contacted_at.split("T")[0]
          : ""
      );
      if (leadsFormData.phone_number) {
        setContactSource("Phone Number");
      }
      if (leadsFormData.social_media_source) {
        setContactSource("Social Media");
        setSocialMediaSource(leadsFormData.social_media_source);
        setSocialMedia(leadsFormData.soical_media);
      }
      if (!onRestore) {
        setIsEditingEntry(true);
      } else {
        setIsEditingEntry(false);
        setEmail(leadsFormData.email);
      }
    }
  }, [leadsFormData]);

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

  const handleLastContactedAt = (e) => {
    const newStartDate = e.target.value;
    setLastContactedAt(newStartDate);
  };

  const handleSocialMediaChange = (e) => {
    setSocialMedia(e.target.value);
    if (!socialMediaTouched) {
      setSocialMediaTouched(true);
    }
  };

  const handleSocialMediaSourceChange = (e) => {
    setSocialMediaSource(e);
    setSocialMedia("");
    if (!socialMediaSourceTouched) {
      setSocialMediaSourceTouched(true);
    }
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
      setSocialMediaSourceTouched(true)
    }

    if (e === "Phone Number") {
      setSocialMediaSource("");
      setPhoneNumberTouched(true);
      setSocialMediaTouched(false);
      setSocialMedia("");
    }
  };

  const handleFormSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      leadEmail: email,
      lastContactedAt: lastContactedAt,
      phoneNumber: phoneNumber,
      socialMediaSource: socialMediaSource,
      socialMedia: socialMedia,
    };
    if (isEditingEntry) {
      onEdit(formData);
    } else if (onRestore) {
      handleArchiveToLeadSubmission();
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
      lastActiveDate: lastContactedAt,
    };

    onArchive(formData);
  };

  const handleArchiveToLeadSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      leadEmail: email,
      lastContactedAt: lastContactedAt,
      phoneNumber: phoneNumber,
      socialMediaSource: socialMediaSource,
      soicalMedia: socialMedia,
    };

    onArchive(formData);
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
          maxWidth="225px"
          textColor="black"
        >
          Please Enter First Name of Lead.
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
          maxWidth="225px"
          textColor="black"
        >
          Please Enter Last Name of Lead.
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={emailInputError} mt={4}>
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
          <FormErrorMessage
            fontSize="14px"
            fontWeight="bold"
            backgroundColor="red.300"
            maxWidth="250px"
            textColor="black"
          >
            Please Select A Social Media Option.
          </FormErrorMessage>
        </FormControl>
      )}{" "}
      {socialMediaSource === "Instagram" && (
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
      {socialMediaSource === "Facebook" && (
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
      {socialMediaSource === "LinkedIn" && (
        <FormControl isInvalid={socialMediaInputError} mt={4}>
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
      {socialMediaSource === "Tik Tok" && (
        <FormControl isInvalid={socialMediaInputError} mt={4}>
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
        <FormLabel color="white">Last Contacted?</FormLabel>
        <Input
          sx={{
            _focus: {
              borderWidth: "4px",
              borderColor: "blue.600",
            },
          }}
          borderRadius={10}
          backgroundColor="white"
          onChange={handleLastContactedAt}
          size="md"
          type="date"
          value={lastContactedAt}
        />
      </FormControl>
      {isEditingEntry && (
        <FormControl mt={4}>
          <FormLabel color="white">Archive Lead?</FormLabel>
          <RadioGroup color="white" onChange={setArchive} value={archive}>
            <Stack direction="column">
              <Radio value="Y">Yes</Radio>
              <Radio value="N">No</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      )}
      {onError && (
        <Alert mt={onError ? 4 : 0} status="error">
          <AlertIcon />
          <AlertDescription>{onErrorMessage}</AlertDescription>
        </Alert>
      )}
      <Flex mt={6} justifyContent="flex-start">
      {archive === "Y" && (
          <Button onClick={handleArchiveSubmission} colorScheme="red">
             {onLoading ? <Spinner size="md" thickness="4px" /> : "Archive"}
          </Button>
        )}
        {archive === "N" && (<Button onClick={handleFormSubmission} colorScheme="blue">
          {onLoading ? (
            <Spinner size="md" thickness="4px" />
          ) : isEditingEntry ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
        )}
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};
export default LeadsForm;

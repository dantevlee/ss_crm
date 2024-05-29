import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ArchiveForm = ({ archiveFormValue, onCancel, onEdit }) => {
  const [firstName, setFirstName] = useState(archiveFormValue.firstName || "");
  const [lastName, setLastName] = useState(archiveFormValue.lastName || "");
  const [email, setEmail] = useState(archiveFormValue.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    archiveFormValue.phone_number || ""
  );
  const [contactSource, setContactSource] = useState("");
  const [socialMediaSource, setSocialMediaSource] = useState(
    archiveFormValue.social_media_source || ""
  );
  const [socialMedia, setSocialMedia] = useState(
    archiveFormValue.soical_media || ""
  );

  const [lastActiveDate, setLastActiveDate] = useState(archiveFormValue.last_active_date || "")

  useEffect(() => {
    if (archiveFormValue.email) {
      setContactSource("E-mail");
    } if (archiveFormValue.phone_number) {
      setContactSource("Phone Number");
    } if (archiveFormValue.social_media_source) {
      setContactSource("Social Media");
      setSocialMediaSource(archiveFormValue.social_media_source);
      setSocialMedia(archiveFormValue.soical_media);
    }
    setLastActiveDate(archiveFormValue.last_active_date.split("T")[0])
  }, [archiveFormValue]);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleLastActiveDateChange = (e) => {
    setLastActiveDate(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleContactSourceChange = (e) => {
    setContactSource(e);
  };

  const handleSocialMediaSourceChange = (e) => {
    setSocialMediaSource(e);
    setSocialMedia("")
  };

  const handleSocialMediaChange = (e) => {
    setSocialMedia(e.target.value);
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
    }

    onEdit(formData, archiveFormValue.id)
  }

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
        <FormLabel>Last Name</FormLabel>
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
        <FormLabel>Primary Contact Source?</FormLabel>
        <RadioGroup onChange={handleContactSourceChange} value={contactSource}>
          <Stack direction="column">
            <Radio value="Social Media">Social Media</Radio>
            <Radio value="Phone Number">Phone Number</Radio>
            <Radio value="None">None</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      {contactSource === "Social Media" && (
        <FormControl mt={4}>
          <FormLabel>Social Media?</FormLabel>
          <RadioGroup
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
      {socialMediaSource === "Instagram" && contactSource === "Social Media" && (
        <FormControl mt={4}>
          <FormLabel>IG:</FormLabel>
          <Input
            value={socialMedia}
            placeholder="Instagram"
            onChange={handleSocialMediaChange}
          />
        </FormControl>
      )}
      {socialMediaSource === "Facebook" && contactSource === "Social Media" && (
        <FormControl mt={4}>
          <FormLabel>Facebook:</FormLabel>
          <Input
            value={socialMedia}
            placeholder="Facebook"
            onChange={handleSocialMediaChange}
          />
        </FormControl>
      )}
      {socialMediaSource === "LinkedIn" && contactSource === "Social Media" && (
        <FormControl mt={4}>
          <FormLabel>LinkedIn:</FormLabel>
          <Input
            value={socialMedia}
            placeholder="LinkedIn"
            onChange={handleSocialMediaChange}
          />
        </FormControl>
      )}
      {socialMediaSource === "Tik Tok" && contactSource === "Social Media" && (
        <FormControl mt={4}>
          <FormLabel>Tik Tok:</FormLabel>
          <Input
            value={socialMedia}
            placeholder="Tik-Tok"
            onChange={handleSocialMediaChange}
          />
        </FormControl>
      )}
      {contactSource === "Phone Number" && (
        <FormControl mt={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            onChange={handlePhoneNumberChange}
            placeholder="Phone Number"
            value={phoneNumber}
          />
        </FormControl>
      )}
      <FormControl mt={4}>
      <FormLabel>Last Active Date</FormLabel>
        <Input
          onChange={handleLastActiveDateChange}
          placeholder="Last Active Date"
          size="md"
          type="date"
          value={lastActiveDate}
        />
      </FormControl>
      <Flex mt={6} justifyContent="flex-start">
        <Button onClick={handleEditSubmission} colorScheme="blue">Update</Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ArchiveForm;

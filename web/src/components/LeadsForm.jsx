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
import { useState } from "react";

const LeadsForm = ({onSave, onCancel}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lastContactedAt, setLastContactedAt] = useState("");
  const [contactSource, setContactSource] = useState("");
  const [socialMediaSource, setSocialMediaSource] = useState("");
  const [socialMedia, setSocialMedia] = useState('')

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleLastContactedAt = (e) => {
    const newStartDate = e.target.value;
    setLastContactedAt(newStartDate);
  };

  const handleSocialMediaChange = (e) => {
    setSocialMedia(e.target.value)
  }

  const handleFormSubmission = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      clientEmail: email,
      lastContactedAt: lastContactedAt,
      phoneNumber: phoneNumber,
      socialMediaSource: socialMediaSource,
      socialMedia: socialMedia,
    }

    onSave(formData)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <>
      <FormControl>
        <FormLabel>First Name:</FormLabel>
        <Input
        onChange={handleFirstNameChange}
        placeholder="First Name"
        value={firstName}
        />
      </FormControl>
      <FormControl  mt={4}>
        <FormLabel>Last Name:</FormLabel>
        <Input 
          onChange={handleLastNameChange}
          placeholder="Last Name"
          value={lastName}
        />
      </FormControl>
      <FormControl  mt={4}>
        <FormLabel>Contact Source?</FormLabel>
        <RadioGroup onChange={setContactSource} value={contactSource}>
          <Stack direction="column">
            <Radio value="Social Media">Social Media</Radio>
            <Radio value="E-mail">E-mail</Radio>
            <Radio value="Phone Number">Phone Number</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      {contactSource === "Social Media" && (
        <FormControl  mt={4}>
          <FormLabel>Social Media?</FormLabel>
          <RadioGroup onChange={setSocialMediaSource} value={socialMediaSource}>
            <Stack direction="column">
              <Radio value="Instagram">Instagram</Radio>
              <Radio value="Facebook">Facebook</Radio>
              <Radio value="LinkedIn">LinkedIn</Radio>
              <Radio value="Tik Tok">Tik Tok</Radio>
              <Radio value="None">None</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      )}{" "}
      {socialMediaSource === "Instagram" && (
        <FormControl  mt={4}>
          <FormLabel>IG:</FormLabel>
          <Input 
          placeholder="Instagram"
          onChange={handleSocialMediaChange} />
        </FormControl>
      )}
       {socialMediaSource === "Facebook" && (
        <FormControl  mt={4}>
          <FormLabel>Facebook:</FormLabel>
          <Input 
          placeholder="Facebook"
          onChange={handleSocialMediaChange} />
        </FormControl>
      )}
       {socialMediaSource === "LinkedIn" && (
        <FormControl  mt={4}>
          <FormLabel>LinkedIn:</FormLabel>
          <Input 
          placeholder="LinkedIn"
          onChange={handleSocialMediaChange} />
        </FormControl>
      )}
       {socialMediaSource === "Tik Tok" && (
        <FormControl  mt={4}>
          <FormLabel>Tik Tok:</FormLabel>
          <Input
          placeholder="Tik-Tok" 
          onChange={handleSocialMediaChange} />
        </FormControl>
      )}
      {contactSource === "E-mail" && (
        <FormControl  mt={4}>
          <FormLabel>E-mail</FormLabel>
          <Input
           onChange={handleEmailChange}
           placeholder="E-mail"
           value={email} />
        </FormControl>
      )}
      {contactSource === "Phone Number" && (
        <FormControl  mt={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input
           onChange={handlePhoneNumberChange}
           placeholder="Phone Number"
           value={phoneNumber}  />
        </FormControl>
      )}
      <FormControl  mt={4}>
        <FormLabel>Last Contacted?</FormLabel>
        <Input onChange={handleLastContactedAt} 
        size="md" 
        type="date"
        value={lastContactedAt} />
      </FormControl>
      <Flex mt={6} justifyContent="flex-start">
        <Button onClick={handleFormSubmission} colorScheme="blue">Save</Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};
export default LeadsForm;

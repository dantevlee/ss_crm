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

const LeadsForm = ({onCancel}) => {
  const [contactSource, setContactSource] = useState("");
  const [socialMediaSource, setSocialMediaSource] = useState("");

  const handleCancel = () => {
    onCancel()
  }

  return (
    <>
      <FormControl>
        <FormLabel>First Name:</FormLabel>
        <Input />
      </FormControl>
      <FormControl  mt={4}>
        <FormLabel>Last Name:</FormLabel>
        <Input />
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
            </Stack>
          </RadioGroup>
        </FormControl>
      )}{" "}
      {socialMediaSource === "Instagram" && (
        <FormControl  mt={4}>
          <FormLabel>IG:</FormLabel>
          <Input />
        </FormControl>
      )}
       {socialMediaSource === "Facebook" && (
        <FormControl  mt={4}>
          <FormLabel>Facebook:</FormLabel>
          <Input />
        </FormControl>
      )}
       {socialMediaSource === "LinkedIn" && (
        <FormControl  mt={4}>
          <FormLabel>LinkedIn:</FormLabel>
          <Input />
        </FormControl>
      )}
       {socialMediaSource === "Tik Tok" && (
        <FormControl  mt={4}>
          <FormLabel>Tik Tok:</FormLabel>
          <Input />
        </FormControl>
      )}
      {contactSource === "E-mail" && (
        <FormControl  mt={4}>
          <FormLabel>E-mail</FormLabel>
          <Input />
        </FormControl>
      )}
      {contactSource === "Phone Number" && (
        <FormControl  mt={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input />
        </FormControl>
      )}
      <FormControl  mt={4}>
        <FormLabel>Last Contacted?</FormLabel>
        <Input size="md" type="date" />
      </FormControl>
      <Flex mt={6} justifyContent="flex-start">
        <Button colorScheme="blue">Save</Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};
export default LeadsForm;

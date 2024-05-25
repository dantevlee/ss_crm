import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useState } from "react";

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ArchiveForm = ({archiveFormValue, onCancel, onEdit}) => {
  const [firstName, setFirstName] = useState(archiveFormValue.firstName || '')
  const [lastName, setLastName] = useState(archiveFormValue.lastName || '')
  const [email, setEmail] = useState(archiveFormValue.client_email || '')
  const [phoneNumber, setPhoneNumber] = useState(archiveFormValue.phone_number || '')
  const [startDate, setStartDate] = useState(formatDateForInput(archiveFormValue.start_date));

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleCancel = () => {
    onCancel();
  };

  return(
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
      {(archiveFormValue.client_email &&
      <FormControl mt={4}>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="E-mail"
          value={email}
        />
      </FormControl>
      )}
      {(archiveFormValue.phone_number &&
      <FormControl mt={4}>
        <FormLabel>Phone Number</FormLabel>
        <Input
          placeholder="Phone Number"
          value={phoneNumber}
        />
      </FormControl>
      )}
      {( archiveFormValue.start_date &&
       <FormControl mt={4}>
        <FormLabel>Start Date</FormLabel>
        <Input
          size="md"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </FormControl>
)}
      <Flex mt={6} justifyContent="flex-start">
        <Button colorScheme="blue">
          Update
        </Button>
        <Button onClick={handleCancel} colorScheme="gray" ml={4}>
          Cancel
        </Button>
      </Flex>
    </>
  )
}

export default ArchiveForm
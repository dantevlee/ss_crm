import { Button, FormControl, FormErrorMessage, FormLabel, Input, Spinner, Textarea, Text, Flex, RadioGroup, Stack, Radio, Select } from "@chakra-ui/react";
import { useState } from "react";

const EventForm = ({ onClose, onLoading, leads, clients }) => {
  const [titleInput, setTitleInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [eventTitleInputTouched, setEventTitleInputTouched] = useState(false);
  const [eventNoteInputTouched, setEventNoteInputTouched] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventType, setEventType] = useState("Client")
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [charCount, setCharCount] = useState(0);


  const eventTitleInputError = titleInput.trim() === "" && eventTitleInputTouched
  const eventNoteInputError = noteInput.trim() === "" && eventNoteInputTouched

  const handleTitleInputChange = (e) => {
    if(!eventTitleInputTouched){
      setEventTitleInputTouched(true)
    }
    setTitleInput(e.target.value);
  };

  const handleEventInputChange = (e) => {
    if(!eventNoteInputTouched){
      setEventNoteInputTouched(true)
    }
    setNoteInput(e.target.value);
    setCharCount(e.target.value.length)
  }

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e)
  }

  return (
    <>
     <FormControl>
        <FormLabel color="white">Set Event For?</FormLabel>
        <RadioGroup
          color="white"
          onChange={handleEventTypeChange}
          value={eventType}
        >
          <Stack direction="row" spacing={8}>
            <Radio value="Client">Client</Radio>
            <Radio value="Lead">Lead</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      {eventType === "Client" ?
        <FormControl mt={4}>
        <FormLabel color="white">Clients:</FormLabel>
        <Select
        variant='filled'
        size='sm'
        sx={{
          _focus: {
            borderWidth: "4px",
            borderColor: "blue.600",
            backgroundColor: "white"
          },
        }} 
        backgroundColor="white"
        >
        {clients.map((client) => (
              <option key={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
        
        </Select>
      </FormControl>
      : 
      <FormControl mt={4}>
      <FormLabel color="white">Leads:</FormLabel>
      <Select
      variant='filled'
      size='sm'
      sx={{
        _focus: {
          borderWidth: "4px",
          borderColor: "blue.600",
          backgroundColor: "white"
        },
      }} 
      backgroundColor="white"
      >
         {leads.map((lead) => (
            <option
            key={lead.id}
            >
              {lead.firstName} {lead.lastName}
            </option>
          ))}
      </Select>
    </FormControl>
      }
    <FormControl mt={4} isInvalid={eventTitleInputError}>
        <FormLabel color="white">Title:</FormLabel>
        <Input
        sx={{
          _focus: {
            borderWidth: "4px",
            borderColor: "blue.600",
          },
        }}
          backgroundColor="white"
          onChange={handleTitleInputChange}
          placeholder="Title"
          value={titleInput}
        />
         <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="160px"
          textColor="black"
        >
          Please Enter Note Title.
        </FormErrorMessage>
      </FormControl>
      <Flex mt={4}>
  <FormControl>
    <FormLabel color="white">Start Date:</FormLabel>
    <Input
      sx={{
        _focus: {
          borderWidth: "4px",
          borderColor: "blue.600",
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
  
  <FormControl ml={4}>
    <FormLabel color="white">Start Time:</FormLabel>
    <Input
      sx={{
        _focus: {
          borderWidth: "4px",
          borderColor: "blue.600",
        },
      }}
      borderRadius={10}
      backgroundColor="white"
      onChange={handleStartTimeChange}
      size="md"
      type="time"
      value={startTime}
    />
  </FormControl>
</Flex>
<Flex mt={4}>
  <FormControl>
    <FormLabel color="white">End Date:</FormLabel>
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
      size="md"
      type="date"
      value={endDate}
    />
  </FormControl>
  
  <FormControl ml={4}>
    <FormLabel color="white"> End Time:</FormLabel>
    <Input
      sx={{
        _focus: {
          borderWidth: "4px",
          borderColor: "blue.600",
        },
      }}
      borderRadius={10}
      backgroundColor="white"
      onChange={handleEndTimeChange}
      size="md"
      type="time"
      value={endTime}
    />
  </FormControl>
</Flex>
      <FormControl mt={4} isInvalid={eventNoteInputError}>
      <FormLabel color="white">Notes:</FormLabel>
      <Textarea
      sx={{
        _focus: {
          borderWidth: "4px",
          borderColor: "blue.600",
        },
      }}
        backgroundColor="white"
        onChange={handleEventInputChange}
        placeholder="Add Note.."
        size="lg"
        height="200px"
        value={noteInput}
      />
       <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="175px"
          textColor="black"
        >
          Please Enter Event Details.
        </FormErrorMessage>
      <Text color="white" mt={2} align="right">
        {charCount}/500
      </Text>
      </FormControl>
      <Button colorScheme="blue">
        {onLoading ? (
          <Spinner size="md" thickness="4px" />
        ) : isEditingEntry ? (
          "Update"
        ) : (
          "Save"
        )}
      </Button>
      <Button onClick={onClose} colorScheme="gray" ml={4}>
        Cancel
      </Button>
    </>
  );
};

export default EventForm;

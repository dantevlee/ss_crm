import { Button, FormControl, FormErrorMessage, FormLabel, Input, Spinner, Textarea, Text, Flex, RadioGroup, Stack, Radio, Select, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import { useState } from "react";

const EventForm = ({ onClose, onLoading, leads, clients, addClientEvent, addLeadEvent, onError }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedLead, setSelectedLead] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [eventTitleInputTouched, setEventTitleInputTouched] = useState(false);
  const [eventNoteInputTouched, setEventNoteInputTouched] = useState(false);
  const [selectedClientTouched, setSelectedClientTouched] = useState(false)
  const [selectedLeadTouched, setSelectedLeadTouched] = useState(false)
  const [startDateTouched, setStartDateTouched] = useState(false)
  const [ startTimeTouched, setStartTimeTouched] = useState(false)
  const [ endDateTouched, setEndDateTouched] = useState(false)
  const [endTimeTouched, setEndTimeTouched] = useState(false)
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventType, setEventType] = useState("Client")
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const clientSelectionError = selectedClient.trim() === "" && selectedClientTouched
  const leadSelectionError = selectedLead.trim() === "" && selectedLeadTouched
  const eventTitleInputError = titleInput.trim() === "" && eventTitleInputTouched
  const eventNoteInputError = noteInput.trim() === "" && eventNoteInputTouched
  const startDateInvalid = startDate.trim() === "" && startDateTouched
  const startTimeError = startTime.trim() === "" && startTimeTouched
  const endDateError = endDate.trim() === "" && endDateTouched
  const endTimeError = endTime.trim() === "" && endTimeTouched

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
    if(!startDateTouched){
      setStartDateTouched(true)
    }
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    if(!startTimeTouched){
      setStartTimeTouched(true)
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if(!endDateTouched){
      setEndDateTouched(true)
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    if(!endTimeTouched){
      setEndTimeTouched(true)
    }
  };

  const handleEventTypeChange = (e) => {
    setEventType(e)
    if(selectedClient){
      setSelectedClient("")
    }
    if(selectedLead){
      setSelectedLead("")
    }
  }

  const handleFormSubmission = () => {
    const formData = {
      startTime: startTime, 
      endTime: endTime,
      appointmentStartDate: startDate, 
      appointmentEndDate: endDate,
      title: titleInput,
      notes: noteInput
    }

    if(eventType === "Client") {
      formData.clientId = selectedClient
      addClientEvent(formData)
    }
    if(eventType === "Lead") {
      formData.leadId = selectedLead
      addLeadEvent(formData)
    }

  }

  const handleClientSelection = (e) => {
    setSelectedClient(e.target.value)
    if(!selectedClientTouched){
      setSelectedClientTouched(true)
    }
  }

  const handleLeadSelection = (e) => {
    setSelectedLead(e.target.value)
    if(!selectedLeadTouched){
      setSelectedLeadTouched(true)
    }
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
        <FormControl mt={4} isInvalid={clientSelectionError}>
        <FormLabel color="white">Clients:</FormLabel>
        <Select
        placeholder="---Select a Client---"
        onChange={handleClientSelection}
        onBlur={handleClientSelection}
        value={selectedClient}
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
              <option key={client.id}
              value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
        
        </Select>
        <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="160px"
          textColor="black"
        >
          Please Select a Client.
        </FormErrorMessage>
      </FormControl>
      : 
      <FormControl mt={4} isInvalid={leadSelectionError}>
      <FormLabel color="white">Leads:</FormLabel>
      <Select
      placeholder="---Select a Lead---"
      value={selectedLead}
      onChange={handleLeadSelection}
      onBlur={handleLeadSelection}
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
            value={lead.id}
            >
              {lead.firstName} {lead.lastName}
            </option>
          ))}
      </Select>
      <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="160px"
          textColor="black"
        >
          Please Select a Lead.
        </FormErrorMessage>
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
          onBlur={handleTitleInputChange}
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
          Please Enter Title.
        </FormErrorMessage>
      </FormControl>
      <Flex mt={4}>
  <FormControl isInvalid={startDateInvalid}>
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
      onBlur={handleStartDateChange}
      size="md"
      type="date"
      value={startDate}
    />
    <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="160px"
          textColor="black"
        >
          Please Enter Start Date.
        </FormErrorMessage>
  </FormControl>
  
  <FormControl ml={4} isInvalid={startTimeError}>
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
      onBlur={handleStartTimeChange}
      size="md"
      type="time"
      value={startTime}
    />
      <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="160px"
          textColor="black"
        >
          Please Enter Start Time.
        </FormErrorMessage>
  </FormControl>
</Flex>
<Flex mt={4}>
  <FormControl isInvalid={endDateError}>
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
      onBlur={handleEndDateChange}
      size="md"
      type="date"
      value={endDate}
    />
    <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="160px"
          textColor="black"
        >
          Please Enter End Date.
        </FormErrorMessage>
  </FormControl>
  
  <FormControl ml={4} isInvalid={endTimeError}>
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
      onBlur={handleEndTimeChange}
      size="md"
      type="time"
      value={endTime}
    />
    <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="160px"
          textColor="black"
        >
          Please Enter End Time.
        </FormErrorMessage>
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
        onBlur={handleEventInputChange}
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
      {onError && (
                <Alert mt={onError ? 2 : 0} mb={onError ? 6 : 0} status="error">
                  <AlertIcon />
                  <AlertDescription>{onError}</AlertDescription>
                </Alert>
              )}
      <Button 
      colorScheme="blue"
      onClick={handleFormSubmission}
      >
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

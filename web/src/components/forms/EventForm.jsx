import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Textarea,
  Text,
  Flex,
  RadioGroup,
  Stack,
  Radio,
  Select,
  Alert,
  AlertIcon,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const EventForm = ({
  onClose,
  onLoading,
  onOpenDelete,
  openDelete,
  onCloseDelete,
  leads,
  clients,
  addClientEvent,
  addLeadEvent,
  editClientEvent,
  editLeadEvent,
  onError,
  onEdit, 
  onDelete,
  event
}) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedLead, setSelectedLead] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [eventTitleInputTouched, setEventTitleInputTouched] = useState(false);
  const [eventNoteInputTouched, setEventNoteInputTouched] = useState(false);
  const [selectedClientTouched, setSelectedClientTouched] = useState(false);
  const [selectedLeadTouched, setSelectedLeadTouched] = useState(false);
  const [startDateTouched, setStartDateTouched] = useState(false);
  const [startTimeTouched, setStartTimeTouched] = useState(false);
  const [endDateTouched, setEndDateTouched] = useState(false);
  const [endTimeTouched, setEndTimeTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventType, setEventType] = useState("Client");
  const [charCount, setCharCount] = useState(0);
  const token = Cookies.get("SessionID");

  useEffect(() => {

    if (event) {
      setTitleInput(event.title || "");
      setNoteInput(event.notes || "");
      setStartDate(event.start ? event.start.toISOString().split('T')[0] : "");
      setStartTime(event.startTime || "");
      setEndDate(event.end ? event.end.toISOString().split('T')[0] : "");
      setEndTime(event.endTime || "");
      
      if (event.client_id) {
        setEventType("Client")
        setSelectedClient(event.client_id);
      }
      if (event.lead_id) {
        setSelectedLead(event.lead_id);
        setEventType("Lead")
      }
    }
  }, []);

  const clientSelectionError =
    !selectedClient && selectedClientTouched;
  const leadSelectionError = !selectedLead && selectedLeadTouched;
  const eventTitleInputError =
    titleInput.trim() === "" && eventTitleInputTouched;
  const eventNoteInputError = noteInput.trim() === "" && eventNoteInputTouched;
  const startDateInvalid = startDate.trim() === "" && startDateTouched;
  const startTimeError = !startTime && startTimeTouched;
  const endDateError = endDate.trim() === "" && endDateTouched;
  const endTimeError = endTime.trim() === "" && endTimeTouched;

  const handleTitleInputChange = (e) => {
    if (!eventTitleInputTouched) {
      setEventTitleInputTouched(true);
    }
    setTitleInput(e.target.value);
  };

  const handleEventInputChange = (e) => {
    if (!eventNoteInputTouched) {
      setEventNoteInputTouched(true);
    }
    setNoteInput(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (!startDateTouched) {
      setStartDateTouched(true);
    }
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    if (!startTimeTouched) {
      setStartTimeTouched(true);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (!endDateTouched) {
      setEndDateTouched(true);
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    if (!endTimeTouched) {
      setEndTimeTouched(true);
    }
  };

  const handleEventTypeChange = (e) => {
    setEventType(e);
    if (selectedClient) {
      setSelectedClient("");
    }
    if (selectedLead) {
      setSelectedLead("");
    }
  };

  const handleFormSubmission = () => {
    const formData = {
      startTime: startTime,
      endTime: endTime,
      appointmentStartDate: startDate,
      appointmentEndDate: endDate,
      title: titleInput,
      notes: noteInput,
    };

    if(onEdit){
      if (eventType === "Client") {
        console.log(selectedClient)
        formData.clientId = selectedClient;
        editClientEvent(formData)
      } else if(eventType === "Lead") {
        formData.leadId = selectedLead;
        editLeadEvent(formData)
      }
    } else {
      if (eventType === "Client") {
        formData.clientId = selectedClient;
        addClientEvent(formData);
      }
      else if (eventType === "Lead") {
        formData.leadId = selectedLead;
        addLeadEvent(formData);
      }
    }

    
  };

  const deleteEvent = async () => {
    try {
      setLoading(true);
      if (event.client_id) {
        await axios
        .delete(`http://localhost:3000/api/delete/appointments/${event.id}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            onCloseDelete()
            onDelete(event.id);
          }
        });
      } else if (event.lead_id) {
        await axios
        .delete(`http://localhost:3000/api/delete-lead/appointments/${event.id}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            onCloseDelete()
            onDelete(event.id);
          }
        });
      }
      
    } catch (error) {
      console.log(error)
      setErrorMessage(error.respon.data.message);
    } finally {
      setLoading(false);
    }
  }

  const handleClientSelection = (e) => {
    setSelectedClient(e.target.value);
    if (!selectedClientTouched) {
      setSelectedClientTouched(true);
    }
  };

  const handleLeadSelection = (e) => {
    setSelectedLead(e.target.value);
    if (!selectedLeadTouched) {
      setSelectedLeadTouched(true);
    }
  };

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
    {eventType === "Client" ? (
      <FormControl mt={4} isInvalid={clientSelectionError}>
        <FormLabel color="white">Clients:</FormLabel>
        <Select
          placeholder="---Select a Client---"
          onChange={handleClientSelection}
          onBlur={handleClientSelection}
          value={selectedClient}
          variant="filled"
          size="sm"
          sx={{
            _focus: {
              borderWidth: "4px",
              borderColor: "blue.600",
              backgroundColor: "white",
            },
          }}
          backgroundColor="white"
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
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
    ) : (
      <FormControl mt={4} isInvalid={leadSelectionError}>
        <FormLabel color="white">Leads:</FormLabel>
        <Select
          placeholder="---Select a Lead---"
          value={selectedLead}
          onChange={handleLeadSelection}
          onBlur={handleLeadSelection}
          variant="filled"
          size="sm"
          sx={{
            _focus: {
              borderWidth: "4px",
              borderColor: "blue.600",
              backgroundColor: "white",
            },
          }}
          backgroundColor="white"
        >
          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>
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
    )}
  </FormControl>
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
      <FormControl mt={2}>
      <Button colorScheme="blue" onClick={handleFormSubmission}>
        {onLoading ? (
          <Spinner size="md" thickness="4px" />
        ) : onEdit ? (
          "Update"
        ) : (
          "Save"
        )}
      </Button>
      <Button onClick={onClose} colorScheme="gray" ml={4}>
        Cancel
      </Button>
      </FormControl>
      {onEdit && (
        <FormControl mt={12}>
        <Button onClick={openDelete} marginStart="120px" size='lg' colorScheme="red">
          Delete Event
        </Button>
        </FormControl>
      )}
      {onOpenDelete && (
        <Modal isOpen={onOpenDelete}>
        <ModalOverlay />
        <ModalContent minWidth="500px">
          <ModalHeader>
            {" "}
            <Text>
            Permanently Delete Event: {event.title} ?
            </Text>
          </ModalHeader>
          {errorMessage && (
            <ModalBody>
              <Alert mt={errorMessage ? 4 : 0} status="error">
                <AlertIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              </ModalBody>
            )}
          <ModalFooter>
            <Button onClick={deleteEvent} colorScheme="blue" mr={3}>
              {loading ? <Spinner size="md" thickness="4px" /> : "Confirm"}
            </Button>
            <Button onClick={onCloseDelete} colorScheme="red" mr={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )}
    </>
  );
};

export default EventForm;

import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useState } from "react";
import EventForm from "../components/forms/EventForm";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import CustomEvents from "../customs/CustomEvents";

const localizer = momentLocalizer(moment);


const CalendarPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clientAppointments, setClientAppointments] = useState({ clientDates: [], clientAppointments: []});
  const [leadAppointments, setLeadAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const token = Cookies.get("SessionID");

  useEffect(() => {
    const clientDates = clientAppointments.clientDates || [];
    const clientvalidAppointments = clientAppointments.clientAppointments || [];
    const allAppointments = [...clientDates, ...clientvalidAppointments, ...leadAppointments];


   const combineDateTime = (date, time) => {
    const [hours, minutes] = time.split(':');
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  };
    setEvents(allAppointments.flatMap(appointment => {
      const events = [];
      if (appointment.start_date) {
        events.push({
          start: new Date(appointment.start_date),
          end: new Date(appointment.start_date),
          title: `${appointment.firstName || ''} ${appointment.lastName || ''}\'s start date`.trim()
        });
      }
      if (appointment.end_date) {
        events.push({
          start: new Date(appointment.end_date),
          end: new Date(appointment.end_date),
          title: `${appointment.firstName || ''} ${appointment.lastName || ''}\'s end date`.trim()
        });
      }
      if (appointment.appointment_start_date) {
        events.push({
          start: combineDateTime(appointment.appointment_start_date, appointment.start_time),
          end: combineDateTime(appointment.appointment_end_date, appointment.endTime),
          title: appointment.title,
          notes: appointment.notes
        });
      }
      return events;
    }));
  }, [clientAppointments, leadAppointments]);


  useEffect(() => {
    fetchClients();
    fetchLeads();
    fetchClientAppointments();
    fetchLeadAppointments();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clients", {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.status === 200) {
        setClients(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/leads`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.status === 200) {
        setLeads(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLeadAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/lead/appointments`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setLeadAppointments(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClientAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/client/appointments`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setClientAppointments(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createClientEvent = async (formData) => {
    try {
      setFormLoading(true);
      axios
        .post(`http://localhost:3000/api/client/create-appointment`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            closeEventModal();
          }
        })
        .catch((err) => {
          setErrorMessage(err.response.data.message);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const createLeadEvent = async (formData) => {
    try {
      setFormLoading(true);
      axios
        .post(`http://localhost:3000/api/lead/create-appointment`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            closeEventModal();
          }
        })
        .catch((err) => {
          setErrorMessage(err.response.data.message);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const {
    isOpen: isAddEventOpen,
    onOpen: onAddEventOpen,
    onClose: onAddEventClose,
  } = useDisclosure();

  const closeEventModal = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
    if (loading) {
      setLoading(false);
    }
    onAddEventClose();
  };

  return (
    <>
      <Flex>
        <Button
          marginTop="100px"
          size="lg"
          colorScheme="blue"
          position="absolute"
          right="1rem"
          onClick={onAddEventOpen}
        >
          <AddIcon mr={2} /> Add Event
        </Button>
      </Flex>
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        components={{
          event: CustomEvents
        }}
        style={{
          height: "90vh",
          marginTop: "200px",
          maxWidth: "150vh",
          marginLeft: "30vh",
        }}
      />
      <Modal isOpen={isAddEventOpen} onClose={closeEventModal}>
        <ModalOverlay />
        <ModalContent backgroundColor="gray.500">
          <ModalHeader color="white">Add Event</ModalHeader>
          <ModalBody pb={6}>
            <EventForm
              onClose={closeEventModal}
              onError={errorMessage}
              onLoading={formLoading}
              clients={clients}
              leads={leads}
              addClientEvent={createClientEvent}
              addLeadEvent={createLeadEvent}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CalendarPage;

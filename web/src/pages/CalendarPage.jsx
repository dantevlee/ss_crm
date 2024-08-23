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
  const [clientAppointments, setClientAppointments] = useState({
    clientDates: [],
    clientAppointments: [],
  });
  const [leadAppointments, setLeadAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const token = Cookies.get("SessionID");

  const combineDateTime = (date, time) => {
    const [hours, minutes] = time.split(":");
    const combined = moment.utc(date).set({ hour: hours, minute: minutes, second: 0 });
    return combined.local().toDate();
  };

  useEffect(() => {
    const clientDates = clientAppointments.clientDates || [];
    const clientvalidAppointments = clientAppointments.clientAppointments || [];
    const allAppointments = [
      ...clientDates,
      ...clientvalidAppointments,
      ...leadAppointments,
    ];

    setEvents(
      allAppointments.flatMap((appointment) => {
        const events = [];
        if (appointment.appointment_start_date && appointment.client_id) {
          events.push({
            id: appointment.id,
            client_id: appointment.client_id,
            start: combineDateTime(
              appointment.appointment_start_date,
              appointment.start_time
            ),
            startTime: appointment.start_time,
            end: combineDateTime(
              appointment.appointment_end_date,
              appointment.endTime
            ),
            endTime: appointment.endTime,
            title: appointment.title,
            notes: appointment.notes,
          });
        }
        if (appointment.appointment_start_date && appointment.lead_id) {
          events.push({
            id: appointment.event_id,
            lead_id: appointment.lead_id,
            start: combineDateTime(
              appointment.appointment_start_date,
              appointment.start_time
            ),
            startTime: appointment.start_time,
            end: combineDateTime(
              appointment.appointment_end_date,
              appointment.endTime
            ),
            endTime: appointment.endTime,
            title: appointment.title,
            notes: appointment.notes,
          });
        }
        if (appointment.start_date) {
          events.push({
            client_id: appointment.client_id,
            start: new Date(appointment.start_date),
            end: new Date(appointment.start_date),
            title: `${appointment.firstName || ""} ${
              appointment.lastName || ""
            }\'s start date`.trim(),
          });
        }
        if (appointment.end_date) {
          events.push({
            client_id: appointment.client_id,
            start: new Date(appointment.end_date),
            end: new Date(appointment.end_date),
            title: `${appointment.firstName || ""} ${
              appointment.lastName || ""
            }\'s end date`.trim(),
          });
        }
        return events;
      })
    );
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
            const createdEvent = res.data;
      
            const newEvent = {
              id: createdEvent.id,
              client_id: createdEvent.client_id,
              start: combineDateTime(createdEvent.appointment_start_date, createdEvent.start_time),
              startTime: createdEvent.start_time,
              end: combineDateTime(createdEvent.appointment_end_date, createdEvent.endTime),
              endTime: createdEvent.endTime,
              title: createdEvent.title,
              notes: createdEvent.notes,
            };
      
            setEvents((prevEvents) => [...prevEvents, newEvent]);
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
            const createdEvent = res.data;

            const newEvent = {
              id: createdEvent.id,
              lead_id: createdEvent.lead_id,
              start: combineDateTime(createdEvent.appointment_start_date, createdEvent.start_time),
              startTime: createdEvent.start_time,
              end: combineDateTime(createdEvent.appointment_end_date, createdEvent.endTime),
              endTime: createdEvent.endTime,
              title: createdEvent.title,
              notes: createdEvent.notes,
            };
      
            setEvents((prevEvents) => [...prevEvents, newEvent]);
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

  const editClientEvent = async (formData) => {
    try {
      setFormLoading(true);
      const res = await axios.put(
        `http://localhost:3000/api/update/appointments/${selectedEvent.id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (res.status === 200) {
        const updatedEvent = res.data;
  
        const newEvent = {
          id: updatedEvent.id,
          client_id: updatedEvent.client_id,
          start: combineDateTime(
            updatedEvent.appointment_start_date,
            updatedEvent.start_time
          ),
          startTime: updatedEvent.start_time,
          end: combineDateTime(
            updatedEvent.appointment_end_date,
            updatedEvent.endTime
          ),
          endTime: updatedEvent.endTime,
          title: updatedEvent.title,
          notes: updatedEvent.notes,
        };
  
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id ? newEvent : event
          )
        );
        closeEventModal();
      }
    } catch (err) {
      setErrorMessage(err.response.data.message);
    } finally {
      setFormLoading(false);
    }
  };

  const editLeadEvent = async (formData) => {
    try {
      setFormLoading(true);
      const res = await axios.put(
        `http://localhost:3000/api/update/lead-appointments/${selectedEvent.id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (res.status === 200) {
        const updatedEvent = res.data;
  
        const newEvent = {
          id: updatedEvent.id,
          lead_id: updatedEvent.lead_id,
          start: combineDateTime(
            updatedEvent.appointment_start_date,
            updatedEvent.start_time
          ),
          startTime: updatedEvent.start_time,
          end: combineDateTime(
            updatedEvent.appointment_end_date,
            updatedEvent.endTime
          ),
          endTime: updatedEvent.endTime,
          title: updatedEvent.title,
          notes: updatedEvent.notes,
        };
  
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id ? newEvent : event
          )
        );
        closeEventModal();
      }
    } catch (err) {
      setErrorMessage(err.response.data.message);
    } finally {
      setFormLoading(false);
    }
  };


  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };


  const {
    isOpen: isAddEventOpen,
    onOpen: onAddEventOpen,
    onClose: onAddEventClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteEventOpen,
    onOpen: onDeleteEventOpen,
    onClose: onDeleteEventClose,
  } = useDisclosure();

  const closeEventModal = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
    if (loading) {
      setLoading(false);
    }
    if(isEditing){
      setIsEditing(false)
    }
    onAddEventClose();
  };

  const openEditEventModal = (event) => {
    if(event.startTime) {
      setSelectedEvent(event); 
      onAddEventOpen();
      setIsEditing(true)
    }
    
  };

  const openDeleteModal = () =>{
    onDeleteEventOpen()
  }

  const closeAllEditDeleteModals = () => {
    if(isEditing){
      setIsEditing(false)
    }
    onDeleteEventClose()
    onAddEventClose();
  }

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
        onSelectEvent={openEditEventModal}
        components={{
          event: CustomEvents,
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
            {isEditing ? (
                <EventForm 
                onClose={closeEventModal}
                onError={errorMessage}
                onLoading={formLoading}
                clients={clients}
                leads={leads}
                event={selectedEvent}
                onEdit={isEditing}
                editClientEvent={editClientEvent}
                editLeadEvent={editLeadEvent}
                onDelete={handleDeleteEvent}
                onOpenDelete={isDeleteEventOpen}
                openDelete={openDeleteModal}
                onCloseDelete={closeAllEditDeleteModals}
                />
            ) : (
              <EventForm
                onClose={closeEventModal}
                onError={errorMessage}
                onLoading={formLoading}
                clients={clients}
                leads={leads}
                addClientEvent={createClientEvent}
                addLeadEvent={createLeadEvent}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CalendarPage;

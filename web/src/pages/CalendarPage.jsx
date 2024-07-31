import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import EventForm from "../components/forms/EventForm";
import axios from 'axios'
import Cookies from "js-cookie";
import { useEffect } from "react";

const CalendarPage = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [leads, setLeads] = useState([])
  const token = Cookies.get("SessionID");

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clients", {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.status === 200) {
        console.log(response.data)
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

  useEffect(() => {
    fetchClients();
    fetchLeads()
  }, []);

  const {
    isOpen: isAddEventOpen,
    onOpen: onAddEventOpen,
    onClose: onAddEventClose,
  } = useDisclosure();

  const closeEventModal = () => {
    if (errorMessage) {
      setShowAlert(false);
    }
    if (loading) {
      setLoading(false);
    }
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
      <Modal isOpen={isAddEventOpen} onClose={closeEventModal}>
        <ModalOverlay/>
        <ModalContent backgroundColor="gray.500">
          <ModalHeader color="white">Add Event</ModalHeader>
          <ModalBody pb={6}>
            <EventForm
            onClose={closeEventModal}
            onLoading={formLoading}
            clients={clients}
            leads={leads}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CalendarPage;

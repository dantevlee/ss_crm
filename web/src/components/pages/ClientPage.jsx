import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import ClientForm from "../components/ClientForm";
import axios from "axios";
import Cookies from "js-cookie";
import { AddIcon } from "@chakra-ui/icons";
import ClientCard from "../components/ClientCard";
import { useEffect, useState } from "react";

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchClients = async () => {
    const token = Cookies.get("SessionID");
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

  useEffect(() => {
    fetchClients();
  }, []);

  const saveClient = async (formData) => {
    const token = Cookies.get("SessionID");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/create-client`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchClients();
        onClose();
      }
    } catch (error) {
      console.error("Error saving client:", error.message);
    }
  };

  const deleteClient = async (clientId) => {
    try{
      const token = Cookies.get("SessionID");
      await axios.delete(`http://localhost:3000/api/delete/client/${clientId}`, {
        headers: {
          Authorization: `${token}`,
        },
      }).then((res) => {
        if(res.status === 200){
          fetchClients()
        }
      })
    } catch(error){
      console.error(error)
    }
    
  }

  const editClient = async (clientId, formData) => {
    try {
      const token = Cookies.get("SessionID");
      await axios.put(`http://localhost:3000/api/update/client/${clientId}`, formData, {
        headers: {
          Authorization: `${token}`
        }
      }).then((res) => {
        console.log(res.status)
      })
    } catch(error){
      console.error(error)
    }
  }

  return (
    <>
      <Button
        size="lg"
        colorScheme="teal"
        mt={6}
        onClick={onOpen}
        position="relative"
        left="88rem"
      >
        <AddIcon mr={2} /> Add Client
      </Button>
      <Stack direction="row" spacing={4}>
        {clients.map((client, idx) => (
          <ClientCard mt={12} key={idx} client={client} onDelete={deleteClient} />
        ))}
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ClientForm onSave={saveClient} onCancel={onClose} onEdit={editClient} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClientPage;

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import ClientForm from "../components/forms/ClientForm";
import axios from "axios";
import Cookies from "js-cookie";
import { AddIcon } from "@chakra-ui/icons";
import ClientCard from "../components/cards/ClientCard";
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

  const createClient = async (formData) => {
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
          onClose();
        }
      })
    } catch(error){
      console.error(error)
    }
    
  }

  const editClient = async (formData, clientId) => {
   
    try {
      const token = Cookies.get("SessionID");
      await axios.put(`http://localhost:3000/api/update/client/${clientId}`, formData, {
        headers: {
          Authorization: `${token}`
        }
      }).then((res) => {
       if(res.status === 200){
        fetchClients()
        onClose();
       } 
      })
    } catch(error){
      console.error(error)
    }
  }

  const archiveClient = async (formData, clientId) => {
    const token = Cookies.get("SessionID");

    try {
      await axios.post(`http://localhost:3000/api/archive/client/${clientId}`, formData, 
      {
        headers: {
          Authorization: `${token}`
        }
      }).then((res) => {
        if(res.status === 200){
          fetchClients()
         } 
      })

    } catch (error){
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
        {clients.map((client) => (
          <ClientCard 
          mt={12} 
          key={client.id} 
          client={client} 
          onDelete={deleteClient} 
          onEdit={editClient} 
          onArchive={archiveClient}  />
        ))}
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ClientForm onSave={createClient} onCancel={onClose}  />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClientPage;

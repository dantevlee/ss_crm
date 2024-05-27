import { AddIcon } from "@chakra-ui/icons";
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
import { useEffect, useState } from "react";
import LeadsForm from "../components/forms/LeadsForm"
import LeadsCard from "../components/cards/LeadsCard";
import axios from "axios";
import Cookies from "js-cookie";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = Cookies.get("SessionID");

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
    fetchLeads();
  }, []);

  const createLead = async (formData) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/create-lead`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchLeads();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLead = async (leadId) => {
    try{
      await axios.delete(`http://localhost:3000/api/delete/lead/${leadId}`, {
        headers: {
          Authorization: `${token}`,
        },
      }).then((res) => {
        if(res.status === 200){
          fetchLeads()
          onClose();
        }
      })
    } catch(error){
      console.error(error)
    }
  }

  const editLead = async (formData, leadId) => {
    try{
      await axios.put(`http://localhost:3000/api/update/lead/${leadId}`, formData, { 
        headers: {
          Authorization: `${token}`
      }
    }).then((res) => {
      if(res.status === 200){
        fetchLeads()
        onClose()
      }
    })
    } catch(error){
      console.error(error)
    }
  }

  const archiveLead = async (formData,leadId) => {
    try{
      await axios.post(`http://localhost:3000/api/archive/lead/${leadId}`, formData, {
        headers: {
          Authorization: `${token}`
        }
      }).then((res) => {
        console.log(res)
        if(res.status === 200){
          fetchLeads()
         } 
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
        position="relative"
        left="88rem"
        onClick={onOpen}
      >
        <AddIcon mr={2} /> Add Lead
      </Button>
      <Stack direction="row" spacing={6}>
      {leads.map((lead) => (<LeadsCard mt={12} key={lead.id} lead={lead} onDelete={deleteLead} onEdit={editLead} onFetchLeads={fetchLeads} onArchive={archiveLead} />))}
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Lead</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <LeadsForm onSave={createLead} onCancel={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeadsPage;

import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LeadsForm from "../components/forms/LeadsForm";
import LeadsCard from "../components/cards/LeadsCard";
import axios from "axios";
import Cookies from "js-cookie";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const token = Cookies.get("SessionID");
  const leadsPerPage = 8;

  const fetchLeads = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
    try {
      await axios
        .delete(`http://localhost:3000/api/delete/lead/${leadId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            fetchLeads();
            onClose();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const editLead = async (formData, leadId) => {
    try {
      await axios
        .put(`http://localhost:3000/api/update/lead/${leadId}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setLeads((prevLeads) => {
              const updatedLead = prevLeads.map((lead) =>
                lead.id === leadId ? res.data : lead
              );
              return updatedLead;
            });
            onClose();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const archiveLead = async (formData, leadId) => {
    try {
      await axios
        .post(`http://localhost:3000/api/archive/lead/${leadId}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            fetchLeads();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginateLeads = () => {
    const startIndex = (currentPage - 1) * leadsPerPage;
    return leads.slice(startIndex, startIndex + leadsPerPage)
  };

  const totalPages = Math.ceil(leads.length / leadsPerPage)

  return (
    <>
      <Flex>
        <Button
          marginTop="100px"
          size="lg"
          colorScheme="blue"
          position="absolute"
          right="1rem"
          onClick={onOpen}
        >
          <AddIcon mr={2} /> Add Lead
        </Button>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="80vh">
          <Spinner
            thickness="8px"
            speed="0.65s"
            emptyColor="gray.400"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={8}>
            {...paginateLeads().map((lead) => (
                <LeadsCard
                  key={lead.id}
                  lead={lead}
                  onDelete={deleteLead}
                  onEdit={editLead}
                  onFetchLeads={fetchLeads}
                  onArchive={archiveLead}
                />
            ))}
          </SimpleGrid>
          {leads.length > leadsPerPage && (
             <Flex justifyContent="center" mt={12} mb={4}>
                {currentPage !== 1 && (
                <Button onClick={handlePreviousPage} mr={2}>
                  <Text color="blue.500">Previous</Text>
                </Button>
              )}
                {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  variant={currentPage === index + 1 ? "solid" : "outline"}
                  colorScheme="blue"
                  mr={2}
                >
                  {index + 1}
                </Button>
              ))}
                {!(
                currentPage * leadsPerPage >= leads.length ||
                currentPage === totalPages
              ) && (
                <Button onClick={handleNextPage} ml={2}>
                  <Text color="blue.500">Next</Text>
                </Button>
              )}
            </Flex>
          )}
        </>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Lead</ModalHeader>
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

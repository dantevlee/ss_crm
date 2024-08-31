import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LeadsForm from "../components/forms/LeadsForm";
import LeadsCard from "../components/cards/LeadsCard";
import axios from "axios";
import Cookies from "js-cookie";
import SearchBar from "../customs/SearchBar";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);

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
    setFormLoading(true);
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
        closeAddLeadModal();
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowAlert(true);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLead = (leadId) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
  };

  const handleArchiveLead = (leadId) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
  };

  const handleLeadEdit = (updatedLead) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
  };

  const {
    isOpen: isAddLeadOpen,
    onOpen: onAddLeadOpen,
    onClose: onAddLeadClose,
  } = useDisclosure();

  const closeAddLeadModal = () => {
    if (showAlert) {
      setShowAlert(false);
    }
    if (loading) {
      setLoading(false);
    }
    onAddLeadClose();
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase(); 
    const query = searchQuery.toLowerCase(); // 
    return (
      lead.firstName.toLowerCase().includes(query) ||
      lead.lastName.toLowerCase().includes(query) ||
      fullName.includes(query)
    );
  });

  const paginateLeads = () => {
    const startIndex = (currentPage - 1) * leadsPerPage;
    return filteredLeads.slice(startIndex, startIndex + leadsPerPage);
  };

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  return (
    <>
      <Flex>
        <Button
          marginTop="100px"
          size="lg"
          colorScheme="blue"
          position="absolute"
          right="1rem"
          onClick={onAddLeadOpen}
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
      ) :  leads.length > 0 ? (
        <>
          <Flex justifyContent="center" alignItems="center" mt={10}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} mt={0}>
            {paginateLeads().map((lead) => (
              <LeadsCard
                key={lead.id}
                lead={lead}
                onDelete={handleDeleteLead}
                onEdit={handleLeadEdit}
                onFetchLeads={fetchLeads}
                onArchive={handleArchiveLead}
              />
            ))}
          </SimpleGrid>
          {filteredLeads.length > leadsPerPage && (
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
                currentPage * leadsPerPage >= filteredLeads.length ||
                currentPage === totalPages
              ) && (
                <Button onClick={handleNextPage} ml={2}>
                  <Text color="blue.500">Next</Text>
                </Button>
              )}
            </Flex>
          )}
        </>
       ) :
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Box marginTop="250px" minW={{ base: "100%", md: "500px" }}>
          <Stack
            spacing={6}
            p="3rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
            flexDir="column"
            mb="4"
            justifyContent="center"
            alignItems="center"
          >
            <Heading>No Currently Active Leads.</Heading>
            <Text>Click the "Add Lead" Button To Get Started.</Text>
          </Stack>
        </Box>
      </Flex>}
      <Modal isOpen={isAddLeadOpen} onClose={closeAddLeadModal}>
        <ModalOverlay />
        <ModalContent backgroundColor="gray.500">
          <ModalHeader color="white">Add New Lead</ModalHeader>
          <ModalBody pb={6}>
            <LeadsForm
              onSave={createLead}
              onCancel={closeAddLeadModal}
              onLoading={formLoading}
              onError={showAlert}
              onErrorMessage={errorMessage}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeadsPage;

import {
  Box,
  Button,
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
  useDisclosure
} from "@chakra-ui/react";
import ClientForm from "../components/forms/ClientForm";
import axios from "axios";
import Cookies from "js-cookie";
import { AddIcon } from "@chakra-ui/icons";
import ClientCard from "../components/cards/ClientCard";
import { useEffect, useState } from "react";
import SearchBar from "../customs/SearchBar";

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const clientsPerPage = 8;

  const fetchClients = async () => {
    const token = Cookies.get("SessionID");
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const createClient = async (formData) => {
    const token = Cookies.get("SessionID");
    try {
      setFormLoading(true);
      await axios
        .post(`http://localhost:3000/api/create-client`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            fetchClients();
            closeAddClientModal();
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowAlert(true);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClient = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const handleDeleteClient = (clientId) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  const handleArchiveClient = (clientId) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  const {
    isOpen: isAddClientOpen,
    onOpen: onAddClientOpen,
    onClose: onAddClientClose,
  } = useDisclosure();

  const closeAddClientModal = () => {
    if (showAlert) {
      setShowAlert(false);
    }
    if (loading) {
      setLoading(false);
    }
    onAddClientClose();
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase(); // 
    return (
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      fullName.includes(query)
    );
  });

  const paginateClients = () => {
    const startIndex = (currentPage - 1) * clientsPerPage;
    return filteredClients.slice(startIndex, startIndex + clientsPerPage);
  };

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  return (
    <>
      <Flex>
        <Button
          marginTop="100px"
          size="lg"
          colorScheme="blue"
          position="absolute"
          right="1rem"
          onClick={onAddClientOpen}
        >
          <AddIcon mr={2} /> Add Client
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
      ) : clients.length > 0 ? (
        <>
          <Flex justifyContent="center" alignItems="center" mt={10}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Flex>
          <SimpleGrid mt={0} columns={{ base: 1, md: 2, lg: 4 }}>
            {paginateClients().map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
                onArchive={handleArchiveClient}
              />
            ))}
          </SimpleGrid>
          {filteredClients.length > clientsPerPage && (
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
                currentPage * clientsPerPage >= filteredClients.length ||
                currentPage === totalPages
              ) && (
                  <Button onClick={handleNextPage} ml={2}>
                    <Text color="blue.500">Next</Text>
                  </Button>
                )}
            </Flex>
          )}
        </>
      ) : <Flex flexDirection="column" justifyContent="center" alignItems="center">
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
            <Heading>No Currently Active Clients.</Heading>
            <Text>Click the "Add Client" Button To Get Started.</Text>
          </Stack>
        </Box>
      </Flex>}
      <Modal isOpen={isAddClientOpen} onClose={closeAddClientModal}>
        <ModalOverlay />
        <ModalContent backgroundColor="gray.500">
          <ModalHeader color="white">Add New Client</ModalHeader>
          <ModalBody pb={6}>
            <ClientForm
              onSave={createClient}
              onCancel={closeAddClientModal}
              onLoading={formLoading}
              onAlert={showAlert}
              onErrorMessage={errorMessage}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClientPage;

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
import ClientForm from "../components/forms/ClientForm";
import axios from "axios";
import Cookies from "js-cookie";
import { AddIcon } from "@chakra-ui/icons";
import ClientCard from "../components/cards/ClientCard";
import { useEffect, useState } from "react";

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
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
    try {
      const token = Cookies.get("SessionID");
      await axios
        .delete(`http://localhost:3000/api/delete/client/${clientId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            fetchClients();
            onClose();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const editClient = async (formData, clientId) => {
    try {
      const token = Cookies.get("SessionID");
      await axios
        .put(`http://localhost:3000/api/update/client/${clientId}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setClients(prevClients => {
              const updatedClient = prevClients.map(client =>
                client.id === clientId ? res.data : client
              );
              return updatedClient;
            });
            onClose();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const archiveClient = async (formData, clientId) => {
    const token = Cookies.get("SessionID");

    try {
      await axios
        .post(
          `http://localhost:3000/api/archive/client/${clientId}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            fetchClients();
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

  const paginateClients = () => {
    const startIndex = (currentPage - 1) * clientsPerPage;
    return clients.slice(startIndex, startIndex + clientsPerPage);
  };

  const totalPages = Math.ceil(clients.length / clientsPerPage);

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
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={8}>
            {...paginateClients().map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onDelete={deleteClient}
                onEdit={editClient}
                onArchive={archiveClient}
              />
            ))}
          </SimpleGrid>
          {clients.length > clientsPerPage && (
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
                currentPage * clientsPerPage >= clients.length ||
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
          <ModalHeader>Add New Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ClientForm onSave={createClient} onCancel={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClientPage;

import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Text,
  IconButton,
  CardHeader,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  CardFooter,
  Flex,
  Spinner,
  ModalHeader,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { FaFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ClientForm from "../forms/ClientForm";
import ProgressNotes from "../notes/ProgressNotes";
import ProgressNotesForm from "../forms/ProgressNotesForm";
import ClientFiles from "../file_uploads/ClientFiles";
import axios from "axios";
import "../../App.css";

const ClientCard = ({ client, onNoteEdit, onDelete, onArchive }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchNotes();
  }, []);

  const editClient = async (formData) => {
    try {
      setLoading(true)
      await axios
        .put(`http://localhost:3000/api/update/client/${client.id}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            onEdit(res.data);
            closeEditModal()
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const archiveClient = async (formData) => {

    try {
      setLoading(true)
      await axios
        .post(
          `http://localhost:3000/api/archive/client/${client.id}`,formData,
         
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            closeEditModal()
            onArchive(client.id)
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async () => {
    try {
      setLoading(true);
      await axios
        .delete(`http://localhost:3000/api/delete/client/${client.id}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            closeDeleteModal();
            onDelete(client.id);
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      await axios
        .get(`http://localhost:3000/api/clients/${client.id}/notes`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setNotes(res.data.notes);
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (formData) => {
    try {
      setLoading(true)
      await axios
        .post(
          `http://localhost:3000/api/create/client-note?client_id=${client.id}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            closeNotesModal();
            fetchNotes();
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowAlert(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  };

  const handleClientEdit = (formData) => {
    editClient(formData);
  };

  const handleClientArchive = (formData) => {
    archiveClient(formData);
  };

  const openDeleteModal = () => {
    onOpen();
    setIsDeleting(true);
  };

  const openEditModal = () => {
    onOpen();
    setIsEditing(true);
  };

  const closeDeleteModal = () => {
    if (showAlert) {
      setShowAlert(false);
    }
    onClose();
    setIsDeleting(false);
  };

  const closeEditModal = () => {
    if (showAlert) {
      setShowAlert(false);
    }
    setIsEditing(false);
  };

  const openNotesModal = () => {
    onOpen();
    setIsAddingNotes(true);
  };

  const closeNotesModal = () => {
      if(showAlert){
      setShowAlert(false)
    }
    onClose();
    setIsAddingNotes(false);
  };

  const openFileModal = () => {
    onOpen();
    setIsFileModalOpen(true);
  };

  const closeFilesModal = () => {
    if (showAlert) {
      setShowAlert(false);
    }
    onClose();
    setIsFileModalOpen(false);
  };

  const handleDeleteNote = (noteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId))
  }

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  };

  return (
    <>
      <Card
        shadow="lg"
        _hover={{
          boxShadow: "xl",
          transform: "scale(1.05)",
          transition: "transform 0.2s",
        }}
        minWidth="250px"
        maxWidth="350px"
        marginStart="75px"
        marginEnd="10px"
        marginTop="175px"
        backgroundColor="gray.300"
        borderRadius={15}
      >
        <CardHeader>
          <Flex alignItems="center" width="100%">
            <Tooltip label="Files">
              <IconButton
                onClick={openFileModal}
                colorScheme="blue"
                icon={<FaFileAlt />}
              />
            </Tooltip>
            <Flex ml="auto">
              <Tooltip label="Edit">
                <IconButton
                  onClick={openEditModal}
                  colorScheme="yellow"
                  icon={<EditIcon />}
                  ml={1}
                />
              </Tooltip>
              <Tooltip label="Delete">
                <IconButton
                  onClick={openDeleteModal}
                  colorScheme="red"
                  icon={<DeleteIcon />}
                  ml={1}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          <Stack
            divider={<StackDivider borderWidth="2px" borderColor="blue.500" />}
            spacing="4"
          >
            <Box>
              <Heading
                fontFamily="monospace"
                size="md"
                textTransform="uppercase"
              >
                Client Name
              </Heading>
              <Text fontFamily="initial" pt="2" fontSize="md">
                {client.firstName} {client.lastName}
              </Text>
            </Box>
            <Box>
              <Heading
                fontFamily="monospace"
                size="md"
                textTransform="uppercase"
              >
                Email
              </Heading>
              <Text fontFamily="initial" pt="2" fontSize="md">
                {client.client_email}
              </Text>
            </Box>
            {client.phone_number && (
              <Box>
                <Heading
                  fontFamily="monospace"
                  size="md"
                  textTransform="uppercase"
                >
                  Phone Number
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {client.phone_number}
                </Text>
              </Box>
            )}
            {client.social_media_source && (
              <Box>
                <Heading
                  fontFamily="monospace"
                  size="md"
                  textTransform="uppercase"
                >
                  Social Media
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {client.social_media_source}
                </Text>
              </Box>
            )}
            {client.social_media && (
              <Box>
                <Heading
                  fontFamily="monospace"
                  size="md"
                  textTransform="uppercase"
                >
                  Social Media Handle
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {client.social_media}
                </Text>
              </Box>
            )}
            <Box>
              <Heading
                fontFamily="monospace"
                size="md"
                textTransform="uppercase"
              >
                Start Date
              </Heading>
              <Text fontFamily="initial" pt="2" fontSize="md">
                {formatDate(client.start_date)}
              </Text>
            </Box>
            <Box>
              <Heading
                fontFamily="monospace"
                size="md"
                textTransform="uppercase"
              >
                End Date
              </Heading>
              <Text fontFamily="initial" pt="2" fontSize="md">
                {formatDate(client.end_date)}
              </Text>
            </Box>
            <Button
              onClick={openNotesModal}
              textColor="blue.500"
              colorScheme="transparent"
            >
              <AddIcon mr={2} mt={0.5} color="blue.500" />
              Add Note
            </Button>
          </Stack>
        </CardBody>

        <CardFooter>
          {loading ? (
            <Spinner marginStart="110px" size="md" thickness="4px" />
          ) : (
            <Stack direction="column">
              {notes.map((n) => (
                <ProgressNotes
                  key={n.id}
                  notes={n}
                  onDelete={handleDeleteNote}
                  onNoteEdit={handleEditNote}
                />
              ))}
            </Stack>
          )}
        </CardFooter>
      </Card>
      {isDeleting && (
        <Modal isOpen={isOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent minWidth="500px">
            <ModalHeader>
              {" "}
              <Text>
                Permanently Delete Client: {client.firstName} {client.lastName}?
              </Text>
            </ModalHeader>
            {showAlert && (
              <ModalBody>
                <Alert mt={showAlert ? 4 : 0} status="error">
                  <AlertIcon />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                </ModalBody>
              )}
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={deleteClient}>
                {loading ? <Spinner size="md" thickness="4px" /> : "Confirm"}
              </Button>
              <Button colorScheme="red" mr={3} onClick={closeDeleteModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {isEditing && (
        <Modal isOpen={isOpen} onClose={closeEditModal}>
          <ModalOverlay />
          <ModalContent backgroundColor="gray.500">
            <ModalHeader color="white">Edit Client</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ClientForm
                clientFormValue={client}
                onCancel={closeEditModal}
                onEdit={handleClientEdit}
                onArchive={handleClientArchive}
                onLoading={loading} 
                onAlert={showAlert} 
                onErrorMessage={errorMessage}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isAddingNotes && (
        <Modal isOpen={isOpen} onClose={closeNotesModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <ProgressNotesForm
                onCancel={closeNotesModal}
                onSave={createNote}
                onLoading={loading} 
                onAlert={showAlert} 
                onErrorMessage={errorMessage}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isFileModalOpen && (
        <Modal isOpen={isOpen} onClose={closeFilesModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <ClientFiles client={client} onCancel={closeFilesModal} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ClientCard;

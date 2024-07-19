import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import LeadsForm from "../forms/LeadsForm";
import { FaFileAlt, FaUserAlt } from "react-icons/fa";
import ConvertToClientForm from "../forms/ConvertToClientForm";
import Cookies from "js-cookie";
import axios from "axios";
import ProgressNotesForm from "../forms/ProgressNotesForm";
import LeadFiles from "../file_uploads/LeadFiles";
import LeadProgressNotes from "../notes/LeadProgressNotes";

const LeadsCard = ({ lead, onDelete, onEdit, onArchive, onFetchLeads }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchNotes();
  }, []);

  const editLead = async (formData) => {
    try {
      setLoading(true)
      await axios
        .put(`http://localhost:3000/api/update/lead/${lead.id}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
           onEdit(res.data)
           closeEditModal()
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message)
      setShowAlert(true)
    } finally{
      setLoading(false)
    }
  };

  const archiveLead = async (formData) => {
    try {
      setLoading(true)
      await axios
        .post(`http://localhost:3000/api/archive/lead/${lead.id}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            closeEditModal()
            onArchive(lead.id)
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message)
      setShowAlert(true)
    } finally{
      setLoading(false)
    }
  };

  const deleteLead = async () => {
    try {
      setLoading(true)
      await axios
        .delete(`http://localhost:3000/api/delete/lead/${lead.id}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            onDelete(lead.id)
            closeDeleteModal()
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message)
      setShowAlert(true)
    } finally{
      setLoading(false)
    }
  };

  const fetchNotes = async () => {
    try {
      await axios
        .get(`http://localhost:3000/api/leads/${lead.id}/notes`, {
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
      setLoading(true);
      await axios
        .post(
          `http://localhost:3000/api/create/lead-note?lead_id=${lead.id}`,
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
    } finally{
      setLoading(false)
    }
  };

  const handleDeleteNote = (noteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId))
  }

  const handleEditNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  };


  const openDeleteModal = () => {
    onOpen();
    setIsDeleting(true);
  };

  const closeDeleteModal = () => {
    if(showAlert){
      setShowAlert(false)
    }
    onClose();
    setIsDeleting(false);
  };

  const openEditModal = () => {
    onOpen();
    setIsEditing(true);
  };

  const closeEditModal = () => {
    if(showAlert){
      setShowAlert(false)
    }
    onClose();
    setIsEditing(false);
  };

  const openLeadConversionModal = () => {
    onOpen();
    setIsConverting(true);
  };

  const closeConvertingModal = () => {
    onClose();
    setIsConverting(false);
  };

  const openNotesModal = () => {
    onOpen();
    setIsAddingNotes(true);
  };

  const closeNotesModal = () => {
    onClose();
    setIsAddingNotes(false);
  };

  const openFileModal = () => {
    onOpen();
    setIsFileModalOpen(true);
  };

  const closeFilesModal = () => {
    onClose();
    setIsFileModalOpen(false);
  };

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
              ></IconButton>
            </Tooltip>
            <Flex ml="auto">
              <Tooltip label="Convert To Client?">
                <IconButton
                  onClick={openLeadConversionModal}
                  colorScheme="green"
                  icon={<FaUserAlt />}
                  ml={1}
                ></IconButton>
              </Tooltip>
              <Tooltip label="Edit">
                <IconButton
                  onClick={openEditModal}
                  colorScheme="yellow"
                  icon={<EditIcon />}
                  ml={1}
                ></IconButton>
              </Tooltip>
              <Tooltip label="Delete">
                <IconButton
                  onClick={openDeleteModal}
                  colorScheme="red"
                  icon={<DeleteIcon />}
                  ml={1}
                ></IconButton>
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
            <Heading fontFamily="monospace" size="md" textTransform="uppercase">
                Lead Name
              </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
              {lead.firstName} {lead.lastName}
            </Text>
            </Box>
            <Box>
            <Heading fontFamily="monospace" size="md"  textTransform="uppercase">
                Last Contacted
              </Heading>
              <Text fontFamily="initial" pt="2" fontSize="md">
                {formatDate(lead.last_contacted_at)}
              </Text>
            </Box>
            {lead.lead_email && (
              <Box>
                 <Heading fontFamily="monospace" size="md"  textTransform="uppercase">
                  Email
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {lead.lead_email}
                </Text>
              </Box>
            )}
            {lead.phone_number && (
              <Box>
                   <Heading fontFamily="monospace" size="md"  textTransform="uppercase">
                  Phone Number
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {lead.phone_number}
                </Text>
              </Box>
            )}
            {lead.social_media_source && (
              <Box>
               <Heading fontFamily="monospace" size="md"  textTransform="uppercase">
                  Social Media
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {lead.social_media_source}
                </Text>
              </Box>
            )}
            {lead.soical_media && (
              <Box>
                    <Heading fontFamily="monospace" size="md"  textTransform="uppercase">
                  Social Media Handle
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {lead.soical_media}
                </Text>
              </Box>
            )}
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
                <LeadProgressNotes
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
            <ModalHeader> <Text>
            Permanently Delete Lead: {lead.firstName} {lead.lastName}?</Text></ModalHeader>
            {showAlert && (
              <ModalBody>
                <Alert mt={showAlert ? 4 : 0} status="error">
                  <AlertIcon />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                </ModalBody>
              )}
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={deleteLead}>
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
            <ModalHeader color="white">Edit Lead</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <LeadsForm
                onEdit={editLead}
                onLoading={loading} 
                onCancel={closeEditModal}
                leadsFormData={lead}
                onArchive={archiveLead}
                onErrorMessage={errorMessage}
                onError={showAlert}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isConverting && (
        <Modal isOpen={isOpen} onClose={closeConvertingModal}>
          <ModalOverlay />
          <ModalContent backgroundColor="gray.500">
            <ModalHeader color="white">Convert To Client</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ConvertToClientForm
                lead={lead}
                onCancel={closeConvertingModal}
                onFetchLeads={onFetchLeads}
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
            <ModalCloseButton />
            <ModalBody>
              <LeadFiles lead={lead} onCancel={closeFilesModal} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default LeadsCard;

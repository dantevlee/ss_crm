import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import ProgressNotes from "../notes/ProgressNotes";
import ProgressNotesForm from "../forms/ProgressNotesForm";
import LeadFiles from "../file_uploads/LeadFiles";

const LeadsCard = ({ lead, onDelete, onEdit, onArchive, onFetchLeads }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [isConverting, setIsConverting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notes, setNotes] = useState([]);

  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchNotes();
  }, [lead.id]);

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
    }
  };

  const createNote = async (formData) => {
    try {
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
      console.error(error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      axios
        .delete(`http://localhost:3000/api/delete/note/${noteId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            fetchNotes();
            onClose();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const editNote = async (formData, notesId) => {
    try {
      axios
        .put(`http://localhost:3000/api/update/note/${notesId}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            fetchNotes();
            onClose();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteModal = () => {
    onOpen();
    setIsDeleting(true);
  };

  const closeDeleteModal = () => {
    onClose();
    setIsDeleting(false);
  };

  const handleDelete = () => {
    onDelete(lead.id);
    onClose();
  };

  const handleEdit = (formData) => {
    onEdit(formData, lead.id);
    closeEditModal();
  };

  const openEditModal = () => {
    onOpen();
    setIsEditing(true);
  };

  const closeEditModal = () => {
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
    onOpen()
    setIsFileModalOpen(true)
  }

  const closeFilesModal = () => {
    onClose()
    setIsFileModalOpen(false);
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

  const handleArchive = (formData) => {
    onArchive(formData, lead.id);
    closeEditModal();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Tooltip label="Convert To Client?">
            <IconButton
              onClick={openLeadConversionModal}
              variant="outline"
              colorScheme="teal"
              icon={<FaUserAlt />}
            ></IconButton>
          </Tooltip>
          <Tooltip label="Edit">
            <IconButton
              onClick={openEditModal}
              variant="outline"
              colorScheme="teal"
              icon={<EditIcon />}
            ></IconButton>
          </Tooltip>
          <Tooltip label="Delete">
            <IconButton
              onClick={openDeleteModal}
              variant="outline"
              colorScheme="teal"
              icon={<DeleteIcon />}
            ></IconButton>
          </Tooltip>
          <Tooltip label="Files">
            <IconButton
              onClick={openFileModal}
              variant="outline"
              colorScheme="teal"
              icon={<FaFileAlt />}
            ></IconButton>
          </Tooltip>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Lead Name
              </Heading>
              <Text pt="2" fontSize="sm"></Text>
              {lead.firstName} {lead.lastName}
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Last Contacted
              </Heading>
              <Text pt="2" fontSize="sm">
                {formatDate(lead.last_contacted_at)}
              </Text>
            </Box>
            {lead.lead_email && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Email
                </Heading>
                <Text pt="2" fontSize="sm">
                  {lead.lead_email}
                </Text>
              </Box>
            )}
            {lead.phone_number && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Phone Number
                </Heading>
                <Text pt="2" fontSize="sm">
                  {lead.phone_number}
                </Text>
              </Box>
            )}
            {lead.social_media_source && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media
                </Heading>
                <Text pt="2" fontSize="sm">
                  {lead.social_media_source}
                </Text>
              </Box>
            )}
            {lead.soical_media && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media Handle
                </Heading>
                <Text pt="2" fontSize="sm">
                  {lead.soical_media}
                </Text>
              </Box>
            )}
            <Button
              onClick={openNotesModal}
              textColor="blue"
              colorScheme="transparent"
            >
              <AddIcon mr={2} mt={0.5} color="blue" />
              Add Note
            </Button>
          </Stack>
        </CardBody>

        <CardFooter>
          <Stack direction="column">
            {notes.map((n) => (
              <ProgressNotes
                key={n.id}
                notes={n}
                onDelete={deleteNote}
                onEdit={editNote}
              />
            ))}
          </Stack>
        </CardFooter>
      </Card>
      {isDeleting && (
        <Modal isOpen={isOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Lead?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Delete Lead: {lead.firstName} {lead.lastName}?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleDelete}>
                Confirm
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
          <ModalContent>
            <ModalHeader>Edit Lead</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <LeadsForm
                onEdit={handleEdit}
                onCancel={closeEditModal}
                leadsFormData={lead}
                onArchive={handleArchive}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isConverting && (
        <Modal isOpen={isOpen} onClose={closeConvertingModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Convert To Client</ModalHeader>
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

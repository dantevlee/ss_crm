import { AddIcon, DeleteIcon, EditIcon, UnlockIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import ClientForm from "../forms/ClientForm";
import LeadsForm from "../forms/LeadsForm";
import ArchiveForm from "../forms/ArchiveForm";
import ProgressNotes from "../notes/ProgressNotes";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ProgresNotesForm from '../forms/ProgressNotesForm'

const ArchiveCard = ({ archives, onRestore, onDelete, onEdit, onMakeLead }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isRestoringAsLead, setIsRestoringAsLead] = useState(false);
  const [isRestoringAsClient, setIsRestoringAsClient] = useState(false);
  const [notes, setNotes] = useState([]);
  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchNotes();
  }, [archives.id]);

  const fetchNotes = async () => {
    try {
      await axios
        .get(`http://localhost:3000/api/archives/${archives.id}/notes`, {
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
          `http://localhost:3000/api/create/archive-note?archive_id=${archives.id}`,
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
    try{
      axios.put(`http://localhost:3000/api/update/note/${notesId}`, formData, {
        headers: {
          Authorization: `${token}`
        }
      }).then((res) => {
        if(res.status === 200){
          fetchNotes()
          onClose()
        }
      })
    } catch(error){
      console.error(error)
    }
  }


  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isRestoreOpen,
    onOpen: onRestoreOpen,
    onClose: onRestoreClose,
  } = useDisclosure();

  const {
    isOpen: isRestoreClientOpen,
    onOpen: onRestoreClientOpen,
    onClose: onRestoreClientClose,
  } = useDisclosure();

  const {
    isOpen: isRestoreLeadOpen,
    onOpen: onRestoreLeadOpen,
    onClose: onRestoreLeadClose,
  } = useDisclosure();

  const {
    isOpen: isAddNotesOpen,
    onOpen: onAddNotesOpen,
    onClose: onAddNotesClose,
  } = useDisclosure();

  const openDeleteModal = () => {
    onDeleteOpen();
    setIsDeleting(true);
  };

  const openEditModal = () => {
    onEditOpen();
    setIsEditing(true);
    setIsRestoring(false);
  };

  const openArchiveModal = () => {
    onRestoreOpen();
    setIsRestoring(true);
  };

  const openNotesModal = () => {
    onAddNotesOpen();
    setIsAddingNotes(true);
  };

  const closeNotesModal = () => {
    onAddNotesClose();
    setIsAddingNotes(false);
  };

  const closeDeleteModal = () => {
    onDeleteClose();
    setIsDeleting(false);
  };

  const closeEditModal = () => {
    onEditClose();
    setIsEditing(false);
  };

  const closeArchiveModal = () => {
    onRestoreClose();
    setIsRestoring(false);
  };

  const handleDelete = () => {
    onDelete(archives.id);
    closeDeleteModal();
  };

  const handleEdit = (formData) => {
    onEdit(formData, archives.id);
    closeEditModal();
  };

  const handleArchiveToActive = (formData) => {
    onRestore(formData, archives.id);
    closeClientForm();
  };

  const handleArchiveToActiveLead = (formData) => {
    onMakeLead(formData, archives.id);
    closeLeadForm();
  };

  const handleArchiveToClient = () => {
    onRestoreClientOpen();
    setIsRestoringAsClient(true);
    closeArchiveModal();
  };

  const handleArchiveToLead = () => {
    onRestoreLeadOpen();
    setIsRestoringAsLead(true);
    closeArchiveModal();
  };

  const closeClientForm = () => {
    onRestoreClientClose();
    onRestoreClose();
    setIsRestoringAsClient(false);
  };

  const closeLeadForm = () => {
    onRestoreLeadClose();
    onRestoreClose();
    setIsRestoringAsLead(false);
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
      <Card>
        <CardHeader>
          <Tooltip label="Restore">
            <IconButton
              onClick={openArchiveModal}
              variant="outline"
              colorScheme="teal"
              icon={<UnlockIcon />}
            />
          </Tooltip>
          <Tooltip label="Edit">
            <IconButton
              onClick={openEditModal}
              variant="outline"
              colorScheme="teal"
              icon={<EditIcon />}
            />
          </Tooltip>
          <Tooltip label="Delete">
            <IconButton
              onClick={openDeleteModal}
              variant="outline"
              colorScheme="teal"
              icon={<DeleteIcon />}
            />
          </Tooltip>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Name
              </Heading>
              <Text pt="2" fontSize="sm">
                {archives.firstName} {archives.lastName}
              </Text>
            </Box>
            {archives.email && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Email
                </Heading>
                <Text pt="2" fontSize="sm">
                  {archives.email}
                </Text>
              </Box>
            )}
            {archives.last_active_date && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Last Active Date
                </Heading>
                <Text pt="2" fontSize="sm">
                  {formatDate(archives.last_active_date)}
                </Text>
              </Box>
            )}
            {archives.phone_number && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Phone Number
                </Heading>
                <Text pt="2" fontSize="sm">
                  {archives.phone_number}
                </Text>
              </Box>
            )}

            {archives.social_media_source && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media
                </Heading>
                <Text pt="2" fontSize="sm">
                  {archives.social_media_source}
                </Text>
              </Box>
            )}
            {archives.soical_media && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media Handle
                </Heading>
                <Text pt="2" fontSize="sm">
                  {archives.soical_media}
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
              onEdit={editNote} />
            ))}
          </Stack>
        </CardFooter>
      </Card>

      {isDeleting && (
        <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Delete Archive: {archives.firstName} {archives.lastName}?
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
        <Modal isOpen={isEditOpen} onClose={closeEditModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <ArchiveForm
                archiveFormValue={archives}
                onCancel={closeEditModal}
                onEdit={handleEdit}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isRestoring && (
        <Modal isOpen={isRestoreOpen} onClose={closeArchiveModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Restore {archives.firstName} {archives.lastName} As..?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleArchiveToClient}>
                Client
              </Button>
              <Button colorScheme="green" mr={3} onClick={handleArchiveToLead}>
                Lead
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {isRestoringAsLead && (
        <Modal isOpen={isRestoreLeadOpen} onClose={closeLeadForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <LeadsForm
                onRestore={isRestoringAsLead}
                onCancel={closeLeadForm}
                leadsFormData={archives}
                onArchive={handleArchiveToActiveLead}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isRestoringAsClient && (
        <Modal isOpen={isRestoreClientOpen} onClose={closeClientForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <ClientForm
                onRestore={isRestoringAsClient}
                clientFormValue={archives}
                onCancel={closeClientForm}
                onArchive={handleArchiveToActive}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isAddingNotes && (
        <Modal isOpen={isAddNotesOpen} onClose={closeNotesModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <ProgresNotesForm
               onSave={createNote}
               onCancel={closeNotesModal} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ArchiveCard;

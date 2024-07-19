import { AddIcon, DeleteIcon, EditIcon, UnlockIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Flex,
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
  Spinner,
  ModalHeader,
} from "@chakra-ui/react";
import ClientForm from "../forms/ClientForm";
import LeadsForm from "../forms/LeadsForm";
import ArchiveForm from "../forms/ArchiveForm";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ProgresNotesForm from "../forms/ProgressNotesForm";
import { FaFileAlt } from "react-icons/fa";
import ArchiveFiles from "../file_uploads/ArchiveFiles";
import ArchiveProgressNotes from "../notes/ArchiveNotes";

const ArchiveCard = ({ archives, onRestore, onDelete, onEdit, onMakeLead }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isRestoringAsLead, setIsRestoringAsLead] = useState(false);
  const [isRestoringAsClient, setIsRestoringAsClient] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (formData) => {
    try {
      setLoading(true);
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
      setErrorMessage(error.response.data.message);
      setShowAlert(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = (noteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  const handleEditNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

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

  const {
    isOpen: isFilesModalOpen,
    onOpen: onFileModalOpen,
    onClose: onFileModalClose,
  } = useDisclosure();

  const openFileModal = () => {
    onFileModalOpen();
    setIsUploadingFile(true);
  };

  const closeFilesModal = () => {
    onFileModalClose();
    setIsUploadingFile(false);
  };

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
        marginTop="125px"
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
              <Tooltip label="Restore">
                <IconButton
                  onClick={openArchiveModal}
                  colorScheme="green"
                  icon={<UnlockIcon />}
                  ml={1}
                />
              </Tooltip>
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
                Name
              </Heading>
              <Text fontFamily="initial" pt="2" fontSize="md">
                {archives.firstName} {archives.lastName}
              </Text>
            </Box>
            {archives.email && (
              <Box>
                <Heading
                  fontFamily="monospace"
                  size="md"
                  textTransform="uppercase"
                >
                  Email
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {archives.email}
                </Text>
              </Box>
            )}
            {archives.last_active_date && (
              <Box>
                <Heading
                  fontFamily="monospace"
                  size="md"
                  textTransform="uppercase"
                >
                  Last Active Date
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {formatDate(archives.last_active_date)}
                </Text>
              </Box>
            )}
            {archives.phone_number && (
              <Box>
                <Heading
                  fontFamily="monospace"
                  size="md"
                  textTransform="uppercase"
                >
                  Phone Number
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {archives.phone_number}
                </Text>
              </Box>
            )}

            {archives.social_media_source && (
              <Box>
                <Heading
                  fontFamily="monospace"
                  size="md"
                  textTransform="uppercase"
                >
                  Social Media
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {archives.social_media_source}
                </Text>
              </Box>
            )}
            {archives.soical_media && (
              <Box>
                <Heading
                  fontFamily="monospace"
                  size="md"
                  textTransform="uppercase"
                >
                  Social Media Handle
                </Heading>
                <Text fontFamily="initial" pt="2" fontSize="md">
                  {archives.soical_media}
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
                <ArchiveProgressNotes
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
        <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent minWidth="500px">
            <ModalHeader>
              Permanently Delete Archive: {archives.firstName}{" "}
              {archives.lastName}?
            </ModalHeader>
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
                onCancel={closeNotesModal}
                onLoading={loading}
                onAlert={showAlert}
                onErrorMessage={errorMessage}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isUploadingFile && (
        <Modal isOpen={isFilesModalOpen} onClose={closeFilesModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <ArchiveFiles archive={archives} onCancel={closeFilesModal} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ArchiveCard;

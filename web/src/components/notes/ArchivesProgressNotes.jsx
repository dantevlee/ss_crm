import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";

const ArchivesProgressNotes = ({notes}) => {

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
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box>
              {notes.title}:{" "}
                {notes.version === "0"
                  ? formatDate(notes.created_at)
                  : formatDate(notes.updated_at)}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
          {notes.text}
            <Tooltip label="Edit Note">
              <IconButton
                size="xs"
                variant="outline"
                colorScheme="teal"
                icon={<EditIcon />}
              ></IconButton>
            </Tooltip>
            <Tooltip label="Delete Note">
              <IconButton
                ml={2}
                size="xs"
                variant="outline"
                colorScheme="teal"
                icon={<DeleteIcon />}
              ></IconButton>
            </Tooltip>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default ArchivesProgressNotes;

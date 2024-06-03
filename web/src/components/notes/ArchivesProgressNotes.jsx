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

const ArchivesProgressNotes = () => {
  return (
    <>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box></Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
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

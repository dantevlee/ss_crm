import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";

const ClientProgressNotes = ({ notes }) => {
  const token = Cookies.get("SessionID");


  return (
    <>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box>Section 1 title</Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>{notes.text}</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default ClientProgressNotes;

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ProgressNotesForm = ({
  onCancel,
  onSave,
  onEdit,
  formValues,
  onLoading,
  onAlert,
  onErrorMessage,
}) => {
  const [noteInput, setNoteInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [noteTitleInputTouched, setNoteTitleInputTouched] = useState(false)
  const [noteTextInputTouched, setNoteTextInputTouched] = useState(false)

  useEffect(() => {
    if (formValues) {
      setTitleInput(formValues.title);
      setNoteInput(formValues.text);
      setCharCount(formValues.text.length);
      setIsEditingEntry(true);
    }
  }, []);

  const noteTitleInputError = titleInput.trim() === "" && noteTitleInputTouched
  
  const noteTextInputError = noteInput.trim() === "" && noteTextInputTouched

  const handleNoteInputChange = (e) => {
    const value = e.target.value;
    if(!noteTextInputTouched){
      setNoteTextInputTouched(true)
    }
    setNoteInput(value);
    setCharCount(value.length);
  };

  const handleTitleInputChange = (e) => {
    if(!noteTitleInputTouched){
      setNoteTitleInputTouched(true)
    }
    setTitleInput(e.target.value);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleNotesSubmission = () => {
    const formData = {
      noteTitle: titleInput,
      noteText: noteInput,
    };

    if (isEditingEntry) {
      onEdit(formData);
    } else {
      onSave(formData);
    }
  };
  

  return (
    <>
      <FormControl mt={4} isInvalid={noteTitleInputError}>
        <FormLabel>Title:</FormLabel>
        <Input
          onChange={handleTitleInputChange}
          placeholder="Title"
          value={titleInput}
        />
         <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="160px"
          textColor="black"
        >
          Please Enter Note Title.
        </FormErrorMessage>
      </FormControl>
      <FormControl mt={4} isInvalid={noteTextInputError}>
      <FormLabel>Note:</FormLabel>
      <Textarea
        onChange={handleNoteInputChange}
        placeholder="Add Note.."
        size="lg"
        height="200px"
        value={noteInput}
      />
       <FormErrorMessage
          fontSize="14px"
          fontWeight="bold"
          backgroundColor="red.300"
          maxWidth="175px"
          textColor="black"
        >
          Please Enter Note Details.
        </FormErrorMessage>
      <Text mt={2} align="right">
        {charCount}/500
      </Text>
      </FormControl>
      {onAlert && (
          <Alert mt={onAlert ? 4 : 0} status="error">
            <AlertIcon />
            <AlertDescription>{onErrorMessage}</AlertDescription>
          </Alert>
        )}
      <Flex mt={6} justifyContent="flex-start">
        <div>
        <Button onClick={handleNotesSubmission} colorScheme="blue">
          {onLoading ? (
            <Spinner size="md" thickness="4px" />
          ) : isEditingEntry ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
        </div>
        <div>
        <Button ml={3} colorScheme="gray" onClick={handleCancel}>
          Cancel
        </Button>
        </div>
      </Flex>
    </>
  );
};

export default ProgressNotesForm;

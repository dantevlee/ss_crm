import { Alert, AlertDescription, AlertIcon, Box, Button, Flex, FormErrorMessage, Input, Spinner } from "@chakra-ui/react";
import { useRef } from "react";
import { useState } from "react";


const UserFileForm = ({onCancel, onUpload}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fileInputTouched, setFileInputTouched] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
    if (!fileInputTouched) {
      setFileInputTouched(true);
    }
  };

  const handleFormSubmission = () =>{
    const formData = new FormData();
    formData.append("file", fileToUpload);
    onUpload(formData)
  }
  const handleCancel = () => {
    onCancel();
  };


  return(
    <>
     <Box>
      <Input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        borderWidth="2px"
        _hover={{
          borderColor: "blue.500",
          borderWidth: "3px",
        }}
        color="black.700"
        sx={{
          "::file-selector-button": {
            bg: "teal.600",
            border: "none",
            color: "white",
            fontWeight: "bold",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            mr: 2,
            _hover: {
              bg: "blue.300",
            },
          },
        }}
      />
      <FormErrorMessage>Please select a file to upload.</FormErrorMessage>
      </Box>
      {errorMessage && (
        <Alert status="error" mt={showAlert ? 4 : 0}>
          <AlertIcon />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <Flex mt={6} justifyContent="flex-start">
        <Button colorScheme="blue" onClick={handleFormSubmission}>
        {loading ? <Spinner size="md" thickness="4px" /> : "Upload"}
        </Button>
        <Button ml={3} colorScheme="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>
    </>
  )
}

export default UserFileForm;
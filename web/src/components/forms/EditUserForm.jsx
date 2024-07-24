import {
  chakra,
  Flex,
  Stack,
  Heading,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Link,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import {
  FaIdCard,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const CfaIdCardAlt = chakra(FaIdCard);

const EditUserForm = ({ onEdit, onErrorMessage, onLoading, userFormValue }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [companyNameTouched, setCompanyNameTouched] = useState(false);

  useEffect(() => {
    if(userFormValue) {
      setFirstName(userFormValue.firstName || "")
      setLastName(userFormValue.lastName || "")
      setCompanyName(userFormValue.company_name || "")
    }
  
  },[userFormValue])

  const firstNameInputError = firstName.trim() === "" && firstNameTouched;
  const lastNameInputError = lastName.trim() === "" && lastNameTouched;
  const companyNameInputError = companyName.trim() === "" && companyNameTouched;


  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    if (!firstNameTouched) {
      setFirstNameTouched(true);
    }
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    if (!lastNameTouched) {
      setLastNameTouched(true);
    }
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
    if (!companyNameTouched) {
      setCompanyNameTouched(true);
    }
  };

  const handleFormSubmission = (e) => {
    e.preventDefault();
      const requestBody = {
        firstName: firstName,
        lastName: lastName,
        companyName: companyName
      };

     onEdit(requestBody)
    
  };

  return (
    <>
      <Flex
        flexDirection="column"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <form onSubmit={handleFormSubmission}>
          <Box marginTop="100px" minW={{ base: "100%", md: "500px" }}>
            <Stack
              spacing={6}
              p="3rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              flexDir="column"
              mb="4"
              justifyContent="center"
              alignItems="center"
            >
              <Heading>Edit User</Heading>
              <FormControl isInvalid={firstNameInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CfaIdCardAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    onBlur={() => setFirstNameTouched(true)}
                  />
                </InputGroup>
                {firstNameInputError && (
                  <FormErrorMessage>First Name is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={lastNameInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CfaIdCardAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    onBlur={() => setLastNameTouched(true)}
                  />
                </InputGroup>
                {lastNameInputError && (
                  <FormErrorMessage>Last Name is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={companyNameInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CfaIdCardAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={handleCompanyNameChange}
                    onBlur={() => setCompanyNameTouched(true)}
                  />
                </InputGroup>
                {companyNameInputError && (
                  <FormErrorMessage>Company name is required.</FormErrorMessage>
                )}
              </FormControl>
              {onErrorMessage && (
                <Alert mt={onErrorMessage ? 4 : 0} status="error">
                  <AlertIcon />
                  <AlertDescription>{onErrorMessage}</AlertDescription>
                </Alert>
              )}
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="blue"
              >
                {onLoading ? (
                  <Spinner size="md" thickness="4px" />
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Link color="blue.500" href="/password/reset">
                Reset Password?
              </Link>
            </Stack>
          </Box>
        </form>
      </Flex>
    </>
  );
};

export default EditUserForm;

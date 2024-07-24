import {
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
  FormErrorMessage,
  chakra,
  Icon,
  Link,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CFaMailAlt = chakra(FaEnvelope);

const PasswordResetRequestForm = ({ isLoggedIn }) => {
  const [email, setemail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [emailTouched, setemailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  const toast = useToast();

  const emailInputError =
    (email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) && emailTouched;

  const handleEmailChange = (e) => {
    setemail(e.target.value);
    if (!emailTouched) {
      setemailTouched(true);
    }
  };

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    const requestBody = {
      email: email,
    };

    if (!emailInputError && emailTouched) {
      try {
        setLoading(true);
        await axios
          .post(`http://localhost:3000/api/reset/request`, requestBody)
          .then((res) => {
            if (res.status === 200) {
              if (showAlert) {
                setShowAlert(false);
              }
              toast({
                title: "Password Reset Request Submitted!",
                description: res.data.message,
                status: "success",
                duration: 5000,
                position: "top",
                isClosable: true,
              });
              if (!isLoggedIn) {
                history("/");
              } else {
                history("/dashboard");
              }
            }
          })
          .catch((error) => {
            setErrorMessage(error.response.data.error);
            setShowAlert(true);
          });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Flex
        flexDirection="column"
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <form onSubmit={handlePasswordResetRequest}>
          <Stack
            flexDir="column"
            mb="4"
            justifyContent="center"
            alignItems="center"
          >
            <Icon fontSize="4xl" color="blue.400" as={FaLock} />
            <Heading color="blue.400">Password Reset</Heading>
            <Box minW={{ base: "100%", md: "500px" }}>
              <Stack
                spacing={12}
                p="3rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl isInvalid={emailInputError}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaMailAlt color="gray.300" />}
                    />
                    <Input
                      type="text"
                      placeholder="E-mail"
                      onChange={handleEmailChange}
                      onBlur={() => setemailTouched(true)}
                    />
                  </InputGroup>
                  <FormErrorMessage>Enter a valid email.</FormErrorMessage>
                  {showAlert && (
                    <Alert mt={showAlert ? 4 : 0} status="error">
                      <AlertIcon />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                  width="full"
                >
                  {loading ? (
                    <Spinner size="md" thickness="4px" />
                  ) : (
                    "Request Password Reset"
                  )}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </form>
        {isLoggedIn ? (
          <Box>
            Return to Dashboard?{" "}
            <Link color="blue.500" href="/dashboard">
              Go Back
            </Link>
          </Box>
        ) : (
          <Box>
            Ready to login?{" "}
            <Link color="blue.500" href="/">
              Login
            </Link>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default PasswordResetRequestForm;
